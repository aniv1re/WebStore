using WebStore.Models;
using WebStore.ViewModels;

namespace WebStore.Database.Interfaces
{
    public interface INewsRepository
    {
        Task<List<News>> GetLastNews();
        Task<List<News>> GetAllNews();
        Task<News> GetNewsById(int id);
        Task CreateNews(NewsViewModel news);
        Task DeleteNews(int id);
        Task<int> SaveChangesAsync();
    }
}
