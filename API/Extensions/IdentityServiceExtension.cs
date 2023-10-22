using System.Text;
using API.Services;
using Domain;
using Infrastructure.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using Persistence;

namespace API.Extensions;

public static class IdentityServiceExtension
{
    public static IServiceCollection AddIdentityServices(this IServiceCollection services, IConfiguration config)
    {
        services.AddIdentityCore<AppUser>(opt =>{
            opt.Password.RequireNonAlphanumeric = false;
            opt.User.RequireUniqueEmail =true;
        })
        .AddEntityFrameworkStores<DataContext>();

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"]));

        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(opt => {
                opt.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = key,
                    ValidateIssuer = false,
                    ValidateAudience = false
                };
            });
        
        services.AddAuthorization(opt => opt.AddPolicy("IsActivityHost", policy =>
        {
            policy.Requirements.Add(new IsHostRequirment());
        }));
        services.AddTransient<IAuthorizationHandler, IsHostRequirmentHandler>();
        services.AddScoped<TokenService>();
        
        return services;
    }
}