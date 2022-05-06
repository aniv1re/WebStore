using AutoMapper;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Buffers;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using WebStore.Database;
using WebStore.Models;
using WebStore.ViewModels;
using static WebStore.Models.User;

namespace WebStore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration configuration;
        private readonly ApplicationDatabaseContext dbContext;
        private readonly IMapper mapper;

        public AuthController(ApplicationDatabaseContext dbContext, IConfiguration configuration, IMapper mapper)
        {
            this.configuration = configuration;
            this.dbContext = dbContext;
            this.mapper = mapper;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromForm] RegUserViewModel regModel)
        {
            var isUserExists = await dbContext.Users
                .AsNoTracking()
                .AnyAsync(e => e.Email == regModel.Email);

            if (isUserExists) { return BadRequest(error: "Пользователь уже существует."); }

            var salt = configuration.GetValue<string>("Secrets:PasswordSalt");
            var newUser = mapper.Map<User>(regModel);

            newUser.Password = HashPassword(regModel.Password, salt);
            newUser.Role = RoleType.User;
            newUser.RegDate = DateTime.Now;
            newUser.Phone = "+7" + newUser.Phone;

            await dbContext.Users.AddAsync(newUser);
            await dbContext.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromForm] LogUserViewModel logModel)
        {
            string salt = configuration.GetValue<string>("Secrets:PasswordSalt");
            string passwordHash = HashPassword(logModel.Password, salt);

            var user = await dbContext.Users
                .AsNoTracking()
                .Select(x => new
                {
                    x.Id,
                    x.Email,
                    x.Password,
                    x.Role,
                    // Новый снизу
                    x.Name
                })
                .FirstOrDefaultAsync(e => e.Email == logModel.Email);

            if (user == null || user.Password != passwordHash) { return BadRequest(error: "Неверный email или пароль."); }

            #region JWT auth

            var shared = ArrayPool<Claim>.Shared;
            var claims = shared.Rent(4);
            claims[0] = new Claim("email", user.Email);
            claims[1] = new Claim("role", user.Role.ToString());
            claims[2] = new Claim(JwtRegisteredClaimNames.UniqueName, user.Id.ToString());
            // И тут
            claims[3] = new Claim("name", user.Name);

            var secret = configuration.GetValue<string>("Secrets:JwtSecret");
            var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(secret));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var jwt = new JwtSecurityToken(
                    claims: claims,
                    expires: DateTime.Now.AddDays(7),
                    signingCredentials: credentials);

            var token = new JwtSecurityTokenHandler().WriteToken(jwt);

            shared.Return(claims);

            #endregion

            return Ok(new { token });
        }

        public static string HashPassword(string password, string salt)
        {
            byte[] saltArr = Encoding.ASCII.GetBytes(salt);

            return Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: password,
                salt: saltArr,
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: 10000,
                numBytesRequested: 256 / 8));
        }
    }
}
