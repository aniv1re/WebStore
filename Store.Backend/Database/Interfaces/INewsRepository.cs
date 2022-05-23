using WebStore.Models;

namespace WebStore.Database.Interfaces
{
    public interface INewsRepository
    {
        Task<IEnumerable<News>> GetLastNews();
        Task<IEnumerable<News>> GetAllNews();
    }
}
