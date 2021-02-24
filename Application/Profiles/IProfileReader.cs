using System.Threading.Tasks;

namespace Application.profiles
{
    public interface IProfileReader
    {
        Task<Profile> ReadProfile(string username);
        
    }
}