using API.Extensions;
using API.Middleware;
using API.SignalR;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Persistence;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers(opt => {
  var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
  opt.Filters.Add(new AuthorizeFilter(policy));
});
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration);


var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseMiddleware<ExceptionMiddleware>();

app.UseXContentTypeOptions();
app.UseReferrerPolicy(opt => opt.NoReferrer());
app.UseXXssProtection(opt => opt.EnabledWithBlockMode());
app.UseXfo(opt => opt.Deny());
app.UseCspReportOnly(opt => opt
      .BlockAllMixedContent()
      .StyleSources(s => s.Self().CustomSources("https://fonts.googleapis.com", "sha256-DpOoqibK/BsYhobWHnU38Pyzt5SjDZuR/mFsAiVN7kk="))
      .FontSources(s => s.Self().CustomSources("https://fonts.gstatic.com", "data:"))
      .FormActions(s => s.Self())
      .FrameAncestors(s => s.Self())
      .ImageSources(s => s.Self().CustomSources("blob:", "https://res.cloudinary.com", "data:", "https://platform-lookaside.fbsbx.com"))
      .ScriptSources(s => s.Self().CustomSources("https://connect.facebook.net"))
);

app.UseSwagger();
app.UseSwaggerUI();

if(!app.Environment.IsDevelopment())
{
  app.Use(async (context, next) =>{
    context.Response.Headers.Add("Strict-Transport-Security", "max-age=31536000");
    await next.Invoke();
  });
}
  

//app.UseHttpsRedirection();

app.UseCors("CorsPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapControllers();
app.MapHub<ChatHub>("/chat");
app.MapFallbackToController("Index","Fallback");

using var scope = app.Services.CreateScope();
var services =scope.ServiceProvider;

try
{
    var context = services.GetRequiredService<DataContext>();
    var userManager = services.GetRequiredService<UserManager<AppUser>>();
    await context.Database.MigrateAsync();
    await Seed.SeedData(context, userManager);
}
catch (Exception ex)
{
  var logger = services.GetRequiredService<ILogger<Program>>();
  logger.LogError(ex, "An error occured during migration");
}

app.Run();
