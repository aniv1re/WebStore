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
                                            RoleId = x.Role,
                                            RegDate = x.RegDate 
                                        })
                                        .FirstOrDefaultAsync(x => x.Email == email);
        }

        public async Task<User> GetUserById(int id)
        {
            return await dbContext.Users.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<IEnumerable<User>> GetAllUsers()
        {
            return await dbContext.Users.AsNoTracking().ToListAsync();
        }
        
        public async Task<IEnumerable<Guest>> GetAllGuests()
        {
            return await dbContext.Guests.AsNoTracking().ToListAsync();
        }

        public async Task<Guest> GetGuestById(int id)
        {
            return await dbContext.Guests.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task CreateUser(User user)
        {
            await dbContext.Users.AddAsync(user);
            await dbContext.SaveChangesAsync();
        }

        public async Task EditUser(EditUserViewModel user)
        {
            User getUser = await dbContext.Users.AsNoTracking().FirstOrDefaultAsync(x => x.Email == user.Email);

            if (getUser != null)
            {
                getUser = new User
                {
                    Id = getUser.Id,
                    Email = getUser.Email,
                    Name = user.Name == getUser.Name ? getUser.Name : user.Name,
                    Surname = user.Surname == getUser.Surname ? getUser.Surname : user.Surname,
                    Password = getUser.Password,
                    Phone = user.Phone == getUser.Phone ? getUser.Phone : user.Phone,
                    RegDate = getUser.RegDate,
                    Role = getUser.Role
                };

                dbContext.Users.Update(getUser);
                await dbContext.SaveChangesAsync();
            }          
        }

        public async Task EditUserPass(EditPassUserViewModel user)
        {
            User getUser = await dbContext.Users.AsNoTracking().FirstOrDefaultAsync(x => x.Email == user.Email);

            var salt = configuration.GetValue<string>("Secrets:PasswordSalt");

            if (getUser != null)
            {
                getUser = new User
                {
                    Id = getUser.Id,
                    Email = getUser.Email,
                    Name = getUser.Name,
                    Surname = getUser.Surname,
                    Password = HashPassword(user.Password, salt),
                    Phone = getUser.Phone,
                    RegDate = getUser.RegDate,
                    Role = getUser.Role
                };

                dbContext.Users.Update(getUser);
                await dbContext.SaveChangesAsync();
            }
        }

        public async Task DeleteUser(int id)
        {
            User getUser = await dbContext.Users.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);

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
