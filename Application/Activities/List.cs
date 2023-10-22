using Application.Core;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities;

public class List
{
    public class Query : IRequest<Result<List<Activity>>>{}

    public class Handler : IRequestHandler<Query, Result<List<Activity>>>
    {
        private readonly DataContext _context;

        public Handler(DataContext context)
        {
            _context = context;
        }

        public async Task<Result<List<Activity>>> Handle(Query request, CancellationToken cancellationToken)
        {
            var activities = await _context.Activities
                .Include(a => a.Attendees)
                .ThenInclude(aa => aa.AppUser)
                .ToListAsync(cancellationToken);
                
            return Result<List<Activity>>.Successs(activities);
        }
    }
}