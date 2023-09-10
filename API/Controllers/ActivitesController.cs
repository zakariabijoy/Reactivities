using Application.Activities;
using Domain;
using Microsoft.AspNetCore.Mvc;

namespace API;

public class ActivitiesController : BaseApiController
{

    [HttpGet] //api/activities
    public async Task<ActionResult<List<Activity>>> GetActivities()
    {
        return Ok(await Mediator.Send(new List.Query()));
    }

    [HttpGet("{id}")] //api/activities/id
    public async Task<ActionResult<Activity>> GetActivity(Guid id)
    {
        return Ok(await Mediator.Send(new Details.Query{Id = id})); 
    }

    [HttpPost]
    public async Task<IActionResult> CreateActivity(Activity activity)
    {
        await Mediator.Send(new Create.Command{Activity = activity});
        return Ok();
    }
}
