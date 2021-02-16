using System.Threading.Tasks;
using Application.profiles;
using Microsoft.AspNetCore.Mvc;

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
    }
}