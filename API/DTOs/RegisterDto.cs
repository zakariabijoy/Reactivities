namespace API.DTOs;

public class RegisterDto
{
    public string Email { get; set; }
    public string Password { get; set; }
    public string DisplayName { get; set; }
    public string Username { get; set; }
}