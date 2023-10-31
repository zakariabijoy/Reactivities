using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Comments;

public class Create
{
    public class  Command : IRequest<Result<CommentDto>>
    {
        public string Body { get; set; }
        public Guid ActivityId { get; set; }
    }

    public class CommandValidator : AbstractValidator<Command>
    {
        public CommandValidator()
        {
            RuleFor(x => x.Body).NotEmpty();
        }
    }
    public class Handler : IRequestHandler<Command, Result<CommentDto>>
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IUserAccessor _userAccessor;
        public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
        {
            _userAccessor = userAccessor;
            _mapper = mapper;
            _context = context;
        }

        public async Task<Result<CommentDto>> Handle(Command request, CancellationToken cancellationToken)
        {
            var activity =  await _context.Activities.FindAsync(request.ActivityId);

            if(activity is null) return null;

            var user = await _context.Users.Include(u =>  u.Photos).SingleOrDefaultAsync(u => u.UserName == _userAccessor.GetUsername());

            var comment =  new Comment
            {
                Author = user,
                Activity = activity,
                Body = request.Body
            };

            activity.Comments.Add(comment);

            var success =  await _context.SaveChangesAsync() > 0;

            if(success) return Result<CommentDto>.Success(_mapper.Map<CommentDto>(comment));

            return Result<CommentDto>.Failure("Failed to add comment");
        }
    }
}