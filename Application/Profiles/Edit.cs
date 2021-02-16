using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.profiles
{
    public class Edit
    {
        public class Command : IRequest<Profile>
        {
            public string DisplayName { get; set; }
            public string Bio { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            // public CommandValidator()
            // {
            //     RuleFor(x => x.DisplayName).NotEmpty();
            //     RuleFor(x => x.Bio).NotEmpty();
            // }
        }

        public class Handler : IRequestHandler<Command, Profile>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;
            }

            public async Task<Profile> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.SingleOrDefaultAsync(x =>
                    x.UserName == _userAccessor.GetCurrentUsername());

                if (user == null) throw new RestException(HttpStatusCode.NotFound, "User not found");

                user.DisplayName = request.DisplayName ?? user.DisplayName;
                user.Bio = request.Bio ?? user.Bio;

                _context.Users.Update(user);
                var success = await _context.SaveChangesAsync() > 0;

                if (success)
                    return new Profile
                    {
                        DisplayName = user.DisplayName,
                        UserName = user.UserName,
                        Image = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
                        Photos = user.Photos,
                        Bio = user.Bio
                    };

                throw new Exception("Problem saving changes.");
            }
        }
    }
}