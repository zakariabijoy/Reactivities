using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Persistence;

namespace Infrastructure.Security;

public class IsHostRequirment : IAuthorizationRequirement
{    
}

public class IsHostRequirmentHandler : AuthorizationHandler<IsHostRequirment>
{
    private readonly DataContext _dbContext;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public IsHostRequirmentHandler(DataContext dbContext, IHttpContextAccessor httpContextAccessor)
    {
        _dbContext = dbContext;
        _httpContextAccessor = httpContextAccessor;
    }

    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IsHostRequirment requirement)
    {
       var useId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);

       if(useId == null) return Task.CompletedTask;

       var activityId = Guid.Parse(_httpContextAccessor.HttpContext?.Request.RouteValues.SingleOrDefault(x =>x.Key == "id").Value?.ToString());

       var attendee = _dbContext.ActivityAttendees.FindAsync(useId, activityId).Result;

       if(attendee == null) return Task.CompletedTask;

       if(attendee.IsHost) context.Succeed(requirement);

       return Task.CompletedTask;
    }
}