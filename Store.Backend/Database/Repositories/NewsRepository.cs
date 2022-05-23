using AutoMapper;
using Microsoft.EntityFrameworkCore;
using WebStore.Database.Interfaces;
using WebStore.Models;

namespace WebStore.Database.Repositories
{
    public class NewsRepository : INewsRepository
    {
        private readonly ApplicationDatabaseContext dbContext;
        private readonly IMapper mapper;

        public NewsRepository(ApplicationDatabaseContext dbContext, IMapper mapper)
        {
            this.dbContext = dbContext;
            this.mapper = mapper;
        }

        public async Task<IEnumerable<News>> GetLastNews()
        {
            return await dbContext.News.AsNoTracking().OrderByDescending(x => x.Id).Take(3).ToListAsync();
        }

        public async Task<IEnumerable<News>> GetAllNews()
        {
            return await dbContext.News.AsNoTracking().ToListAsync();
        }
    }
}
