using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Activities;
using Application.profiles;
using Application.Profiles;
using Microsoft.AspNetCore.Mvc;
using Details = Application.profiles.Details;
using Edit = Application.profiles.Edit;

namespace API.Controllers
{
    public class ProfilesController : BaseController
    {
        [HttpGet("{username}")]
        public async Task<ActionResult<Profile>> Get(string username)
        {
            return await Mediator.Send(new Details.Query {Username = username});
        }

        [HttpPut]
        public async Task<ActionResult<Profile>> Update(Edit.Command command)
        {
            return await Mediator.Send(command);
        }
        
        [HttpGet("{username}/activities")]
        public async Task<List<UserActivityDto>> GetUserActivities(string username, string predicate)
        {
            return await Mediator.Send(new ListActivities.Query{Username = username, Predicate = predicate});
        }
    }
}