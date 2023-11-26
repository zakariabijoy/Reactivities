namespace Application.Interfaces;

public interface IEmailSender
{
    Task SenEmailAsync(string userEmail, string emailSubject, string msg);
}
