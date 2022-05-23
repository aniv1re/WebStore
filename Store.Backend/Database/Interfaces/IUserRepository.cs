using WebStore.Models;
using WebStore.ViewModels;

namespace WebStore.Database.Interfaces
{
    public interface IUserRepository
    {
        Task<UserViewModel> GetUser(string email);
        Task<User> GetUserById(int id);
        Task<IEnumerable<User>> GetAllUsers();
        Task CreateUser(User user);
        Task EditUser(EditUserViewModel user);
        Task EditUserPass(EditPassUserViewModel user);
        Task DeleteUser(string email);
        Task<int> SaveChangesAsync();
    }
}
