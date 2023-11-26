using System.Net;
using System.Net.Mail;
using Application.Interfaces;

namespace Infrastructure.Email;

public class EmailSender : IEmailSender
{
    public async Task SendEmailAsync(string userEmail, string emailSubject, string msg)
    {
        var client = new SmtpClient("sandbox.smtp.mailtrap.io", 2525)
            {
                Credentials = new NetworkCredential("29c8548ad0cad1", "5ffdb51e9acbce"),
                EnableSsl = true
            };

        var mail = new MailMessage
        {
            IsBodyHtml = true,
            From = new MailAddress("reactivities@example.com", "Reactivities")
        };
        mail.To.Add(userEmail);
        mail.Subject = emailSubject;
        mail.Body = msg;

        await client.SendMailAsync(mail);
    }
}
