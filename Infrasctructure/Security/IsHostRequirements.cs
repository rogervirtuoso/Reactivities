using System;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;
using Application.Errors;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Persistence;

namespace Infrasctructure.Security
{
    public class IsHostRequirements : IAuthorizationRequirement
    {
    }

    public class IsHostRequirimentHandler : AuthorizationHandler<IsHostRequirements>
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly DataContext _dataContext;

        public IsHostRequirimentHandler(IHttpContextAccessor httpContextAccessor, DataContext dataContext)
        {
            _httpContextAccessor = httpContextAccessor;
            _dataContext = dataContext;
        }

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context,
            IsHostRequirements requirement)
        {
            var currentUserName = _httpContextAccessor.HttpContext.User?.Claims
                ?.SingleOrDefault(x => x.Type == ClaimTypes.NameIdentifier)
                ?.Value;

            var activityId = Guid.Parse(_httpContextAccessor.HttpContext.Request.RouteValues
                .SingleOrDefault(x => x.Key == "id").Value.ToString() ?? string.Empty);

            var activity = _dataContext.Activities.FindAsync(activityId).Result;

            if (activity == null)
                throw new RestException(HttpStatusCode.NotFound, new {activity = "Activity not found"});

            var host = activity.UserActivities.FirstOrDefault(x => x.IsHost);

            if (host?.AppUser?.UserName == currentUserName)
                context.Succeed(requirement);

            return Task.CompletedTask;
        }
    }
}