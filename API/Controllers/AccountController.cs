using API.DTOs;
using Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountController : ControllerBase
{
    private readonly UserManager<AppUser> _userManager;

    public AccountController(UserManager<AppUser> userManager)
    {
        _userManager = userManager;
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
        var user =  await _userManager.FindByEmailAsync(loginDto.Email);

        if(user is null) return Unauthorized();

        var result =  await _userManager.CheckPasswordAsync(user, loginDto.Password);

        if(result)
        {
            return new UserDto
            {
                DisplayName = user.DisplayName,
                Image = null,
                Token ="This will be a token",
                Username = user.UserName
            };
        }

        return Unauthorized();
    }
}