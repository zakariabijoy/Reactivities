using System.Diagnostics;
using Application.Activities;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API;

public class ActivitiesController : BaseApiController
{
    private readonly IMediator _mediator;

    public ActivitiesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet] //api/activities
    public async Task<ActionResult<List<Activity>>> GetActivities()
    {
        return Ok(await _mediator.Send(new List.Query()));
    }

    [HttpGet("{id}")] //api/activities/id
    public async Task<ActionResult<Activity>> GetActivity(Guid id)
    {
        return Ok(); 
    }
}
