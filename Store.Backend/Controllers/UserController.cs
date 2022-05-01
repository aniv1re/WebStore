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

        [HttpGet("get/user/{email}")]
        public async Task<UserViewModel> GetUser([FromRoute] string email)
        {
            return await userRepository.GetUser(email);
        }

        [HttpPost("add/user")]
        public async Task<IActionResult> CreateUser([FromForm] User user)
        {
            await userRepository.CreateUser(user);
            await userRepository.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("edit/user")]
        public async Task<IActionResult> EditUser([FromForm] EditUserViewModel user)
        {
            await userRepository.EditUser(user);
            await userRepository.SaveChangesAsync();

            return NoContent();
        }
        
        [HttpPost("edit/userpass/")]
        public async Task<IActionResult> EditUserPassword([FromForm] EditPassUserViewModel user)
        {
            await userRepository.EditUserPass(user);
            await userRepository.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("delete/user/{userEmail}")]
        public async Task<IActionResult> DeleteUser([FromRoute] string userEmail)
        {
            await userRepository.DeleteUser(userEmail);
            await userRepository.SaveChangesAsync();

            return NoContent();
        }
    }
}
