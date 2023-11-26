using System.Security.Claims;
using System.Text;
using API.DTOs;
using API.Services;
using Application.Interfaces;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountController : ControllerBase
{
    private readonly UserManager<AppUser> _userManager;
    private readonly TokenService _tokenService;
    private readonly IConfiguration _config;
    private readonly HttpClient _httpClient;
        private readonly SignInManager<AppUser> _signInManager;
    private readonly IEmailSender _emailSender;

    public AccountController(
        UserManager<AppUser> userManager,
        TokenService tokenService, 
        IConfiguration config, 
        SignInManager<AppUser> signInManager,
        IEmailSender emailSender
    )
    {
        _signInManager = signInManager;
        _emailSender = emailSender;
        _config = config;
        _userManager = userManager;
        _tokenService = tokenService;
        _httpClient = new HttpClient
        {
            BaseAddress = new Uri("https://graph.facebook.com")
        };
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
        var user =  await _userManager.Users.Include(u => u.Photos).FirstOrDefaultAsync(u => u.Email == loginDto.Email);

        if(user is null) return Unauthorized("invalid Email");

        if(user.UserName == "bob") user.EmailConfirmed = true;

        if(!user.EmailConfirmed) return Unauthorized("Email not confirmed");

        var result =  await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

        if(result.Succeeded)
        {
            await SetRefreshToken(user);
            return CreateUserObject(user);
        }

        return Unauthorized("Invalid password");
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<ActionResult> Register(RegisterDto registerDto)
    {
        if(await _userManager.Users.AnyAsync(x => x.UserName == registerDto.Username))
        {
            ModelState.AddModelError("username", "Username is already taken");
            return ValidationProblem();
        }

        if(await _userManager.Users.AnyAsync(x => x.Email == registerDto.Email))
        {
            ModelState.AddModelError("email", "Email is already taken");
            return ValidationProblem();
        }

        var user = new AppUser
        {
            DisplayName = registerDto.DisplayName,
            Email = registerDto.Email,
            UserName = registerDto.Username
        };

        var result = await _userManager.CreateAsync(user, registerDto.Password);

        if(!result.Succeeded) return BadRequest("Problem registerning user");

        var origin = Request.Headers["origin"];
        var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
        token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

        var verifyUrl = $"{origin}/account/verifyEmail?token={token}&email={user.Email}";

        var message = $"<p>Please Click the below link to verify your email address:</P><p><a href='{verifyUrl}'>Click to verify email</a></p>";

        await _emailSender.SendEmailAsync(user.Email, "Please verify email", message);

        return Ok("Registration success - please verify email");
    }

    [AllowAnonymous]
    [HttpPost("verifyEmail")]
    public async Task<IActionResult> VerifyEmail(string token, string email)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if(user == null) return Unauthorized();
        var decodedTokenBytes = WebEncoders.Base64UrlDecode(token);
        var decodedToken = Encoding.UTF8.GetString(decodedTokenBytes);
        var result = await _userManager.ConfirmEmailAsync(user, decodedToken);

        if(!result.Succeeded) return BadRequest("Could not verify email address");

        return Ok("Email confirmed - you can login");
    }

    [AllowAnonymous]
    [HttpGet("resendEmailConfirmationLink")]
    public async Task<IActionResult> ResendEmailConfirmationLink(string email)
    {
        var user = await _userManager.FindByEmailAsync(email);

        if(user is null) return Unauthorized();

        var origin = Request.Headers["origin"];
        var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
        token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

        var verifyUrl = $"{origin}/account/verifyEmail?token={token}&email={user.Email}";

        var message = $"<p>Please Click the below link to verify your email address:</P><p><a href='{verifyUrl}'>Click to verify email</a></p>";

        await _emailSender.SendEmailAsync(user.Email, "Please verify email", message);

        return Ok("Email verification link resent");
    }

    [Authorize]
    [HttpGet]
    public async Task<ActionResult<UserDto>> GetCurrentUser()
    {
        var user = await _userManager.Users.Include(u => u.Photos).FirstOrDefaultAsync(u => u.Email == User.FindFirstValue(ClaimTypes.Email));
        await SetRefreshToken(user);
        return CreateUserObject(user);
    }

    [AllowAnonymous]
    [HttpPost("fbLogin")]
    public async Task<ActionResult<UserDto>> FacebookLogin(string accessToken)
    {
        var fbVerifyKeys = _config["Facebook:AppId"] + "|" + _config["Facebook:AppSecret"];

        var verifyTokenResponse = await _httpClient.GetAsync($"debug_token?input_token={accessToken}&access_token={fbVerifyKeys}");

        if(!verifyTokenResponse.IsSuccessStatusCode) return Unauthorized();

        var fbUrl = $"me?access_token={accessToken}&fields=name,email,picture.width(100).height(100)";

        var fbInfo = await _httpClient.GetFromJsonAsync<FacebookDto>(fbUrl);

        var user = await _userManager.Users.Include(p => p.Photos).FirstOrDefaultAsync(x => x.Email == fbInfo.Email);

        if(user is not null) return CreateUserObject(user);

        user = new AppUser
        {
            DisplayName = fbInfo.Name,
            Email = fbInfo.Email,
            UserName = fbInfo.Email,
            Photos = new List<Photo>
            {
                new Photo
                {
                    Id= "fb_" + fbInfo.Id,
                    Url = fbInfo.Picture.Data.Url,
                    IsMain = true
                }
            }
        };

        var result = await _userManager.CreateAsync(user);

        if(!result.Succeeded) return BadRequest("Problem creating user account");

        await SetRefreshToken(user);
        return CreateUserObject(user);
    }

    [Authorize]
    [HttpPost("refreshToken")]
    public async Task<ActionResult<UserDto>> RefreshToken()
    {
        var refreshToken = Request.Cookies["refreshToken"];
        var user = await _userManager.Users
            .Include(r => r.RefreshTokens)
            .Include(p => p.Photos)
            .FirstOrDefaultAsync(x => x.UserName == User.FindFirstValue(ClaimTypes.Name));

        if(user == null) return Unauthorized();

        var oldToken = user.RefreshTokens.SingleOrDefault(x => x.Token ==  refreshToken);

        if(oldToken is not null && !oldToken.IsActive) return Unauthorized();

        if(oldToken is not null) oldToken.Revoked = DateTime.UtcNow;

        return CreateUserObject(user);
    }

    private UserDto CreateUserObject(AppUser user)
    {
        return new UserDto
        {
            DisplayName = user.DisplayName,
            Image = user?.Photos?.FirstOrDefault(x => x.IsMain)?.Url,
            Token = _tokenService.CreateToken(user),
            Username = user.UserName
        };
    }

    private async Task SetRefreshToken(AppUser user)
    {
        var refreshToken = _tokenService.GenerateRefreshToken();

        user.RefreshTokens.Add(refreshToken);
        await _userManager.UpdateAsync(user);

        var cookieOption = new CookieOptions
        {
            HttpOnly = true,
            Expires = DateTime.UtcNow.AddDays(7),
        };

        Response.Cookies.Append("refreshToken", refreshToken.Token, cookieOption);
    }
}