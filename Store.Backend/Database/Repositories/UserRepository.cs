using AutoMapper;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.EntityFrameworkCore;
using System.Text;
using WebStore.Database.Interfaces;
using WebStore.Models;
using WebStore.ViewModels;

namespace WebStore.Database.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDatabaseContext dbContext;
        private readonly IConfiguration configuration;
        private readonly IMapper mapper;

        public UserRepository(ApplicationDatabaseContext dbContext, IConfiguration configuration, IMapper mapper)
        {
            this.dbContext = dbContext;
            this.configuration = configuration;
            this.mapper = mapper;
        }

        public async Task<UserViewModel> GetUser(string email)
        {
            return await dbContext.Users.AsNoTracking()
                                        .Select(x => new UserViewModel { 
                                            Id = x.Id,
                                            Name = x.Name,
                                            Surname = x.Surname,
                                            Email = x.Email,
                                            Phone = x.Phone,
                                            RegDate = x.RegDate 
                                        })
                                        .FirstOrDefaultAsync(x => x.Email == email);
        }

        public async Task CreateUser(User user)
        {
            await dbContext.Users.AddAsync(user);
            await dbContext.SaveChangesAsync();
        }

        public async Task EditUser(EditUserViewModel user)
        {
            User getUser = await dbContext.Users.FirstOrDefaultAsync(x => x.Email == user.Email);

            /*getUser = new User
            {
                Id = getUser.Id,
                Email = getUser.Email,
                Name = user.Name == "" ? getUser.Name : user.Name,
                Surname = user.Surname == "" ? getUser.Surname : user.Surname,
                Password = user.Password == "" ? getUser.Password : user.Password,
                Phone = user.Phone == "" ? getUser.Phone : user.Phone,
                RegDate = getUser.RegDate,
                Role = getUser.Role
            };
            */

            var salt = configuration.GetValue<string>("Secrets:PasswordSalt");
            getUser = mapper.Map<User>(user);

            getUser.Password = HashPassword(user.Password, salt);

            dbContext.Users.Update(getUser);
            await dbContext.SaveChangesAsync();
        }

        public async Task DeleteUser(string email)
        {
            User getUser = await dbContext.Users.AsNoTracking().FirstOrDefaultAsync(x => x.Email == email);

            dbContext.Users.Remove(getUser);
            await dbContext.SaveChangesAsync();
        }

        public Task<int> SaveChangesAsync()
        {
            return dbContext.SaveChangesAsync();
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
