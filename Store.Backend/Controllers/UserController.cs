using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebStore.Database.Interfaces;
using WebStore.Models;
using WebStore.ViewModels;

namespace WebStore.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class UserController : Controller
    {
        private readonly IUserRepository userRepository;

        public UserController(IUserRepository userRepository)
        {
            this.userRepository = userRepository;
        }

        [HttpGet("get/{email}")]
        public async Task<UserViewModel> GetUser([FromRoute] string email)
        {
            return await userRepository.GetUser(email);
        }
        
        [HttpGet("get/id/{id}")]
        public async Task<User> GetUserById([FromRoute] int id)
        {
            return await userRepository.GetUserById(id);
        }
        
        [HttpGet("get/all")]
        public async Task<IEnumerable<User>> GetAllUsers()
        {
            return await userRepository.GetAllUsers();
        }
        
        [HttpGet("get/guest/all")]
        public async Task<IEnumerable<Guest>> GetAllGuests()
        {
            return await userRepository.GetAllGuests();
        }
        
        [HttpGet("get/guest/{id}")]
        public async Task<Guest> GetGuestById([FromRoute] int id)
        {
            return await userRepository.GetGuestById(id);
        }

        [HttpPost("add")]
        public async Task<IActionResult> CreateUser([FromForm] User user)
        {
            await userRepository.CreateUser(user);
            await userRepository.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("edit")]
        public async Task<IActionResult> EditUser([FromForm] EditUserViewModel user)
        {
            await userRepository.EditUser(user);
            await userRepository.SaveChangesAsync();

            return Ok();
        }
        
        [HttpPost("edit/userpass/")]
        public async Task<IActionResult> EditUserPassword([FromForm] EditPassUserViewModel user)
        {
            await userRepository.EditUserPass(user);
            await userRepository.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("delete")]
        public async Task<IActionResult> DeleteUser([FromBody] int id)
        {
            await userRepository.DeleteUser(id);
            await userRepository.SaveChangesAsync();

            return Ok();
        }
    }
}
