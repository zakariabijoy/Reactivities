using System.Net;
using System.Net.Mail;
using Application.Interfaces;

namespace Infrastructure.Email;

public class EmailSender : IEmailSender
{
    public async Task SenEmailAsync(string userEmail, string emailSubject, string msg)
    {
        var client = new SmtpClient("sandbox.smtp.mailtrap.io", 2525)
            {
                Credentials = new NetworkCredential("29c8548ad0cad1", "bed041c9b3fcb04e8f9d22dda2e5983b"),
                EnableSsl = true
            };
        await client.SendMailAsync("from@example.com", userEmail, emailSubject, msg);
    }
}
