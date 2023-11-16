using Application.Followers;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class FollowController : BaseApiController
{
    [HttpPost("{username}")]
    public async Task<IActionResult> Follow(string username) => HandleResult(await Mediator.Send(new FollowToggle.Command { TargetUsername = username }));

    [HttpGet("{username}")]
    public async Task<IActionResult> GetFollowings(string username, string predicate) => 
                                            HandleResult(await Mediator.Send(new List.Query { Username = username, Predicate = predicate }));
}
