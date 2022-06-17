using AutoMapper;
using Microsoft.EntityFrameworkCore;
using WebStore.Database.Interfaces;
using WebStore.Models;
using WebStore.ViewModels;

namespace WebStore.Database.Repositories
{
    public class NewsRepository : INewsRepository
    {
        private readonly ApplicationDatabaseContext dbContext;
        private readonly IMapper mapper;
        private static string path = string.Empty;

        public NewsRepository(ApplicationDatabaseContext dbContext, IMapper mapper, IWebHostEnvironment appEnvironment)
        {
            this.dbContext = dbContext;
            this.mapper = mapper;

            path = $@"{appEnvironment.ContentRootPath}\Images\";
            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }
        }

        public async Task<List<News>> GetLastNews()
        {
            return await dbContext.News.AsNoTracking().OrderByDescending(x => x.Id).Take(3).ToListAsync();
        }

        public async Task<List<News>> GetAllNews()
        {
            return await dbContext.News.AsNoTracking().ToListAsync();
        }

        public async Task<News> GetNewsById(int id)
        {
            return await dbContext.News.AsNoTracking().SingleOrDefaultAsync(x => x.Id == id);
        }

        public async Task CreateNews(NewsViewModel news)
        {
            var newNews = mapper.Map<News>(news);
            newNews.Date = DateTime.Now;

            var fileName = Guid.NewGuid() + Path.GetExtension(news.ImageFile.FileName);
            var pathFile = path + @$"\{fileName}";
            using var stream = new FileStream(pathFile, FileMode.Create);
            await news.ImageFile.CopyToAsync(stream);

            newNews.Image = fileName;
            var createdNews = await dbContext.News.AddAsync(newNews);
            await dbContext.SaveChangesAsync();
        }

        public async Task DeleteNews(int id)
        {
            News getNews = await dbContext.News.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);

            dbContext.News.Remove(getNews);
            await dbContext.SaveChangesAsync();
        }

        public Task<int> SaveChangesAsync()
        {
            return dbContext.SaveChangesAsync();
        }
    }
}
