using Application.Followers;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class FollowController : BaseApiController
{
    [HttpPost("{username}")]
    public async Task<IActionResult> Follow(string username) => HandleResult(await Mediator.Send(new FollowToggle.Command { TargetUsername = username }));
}
