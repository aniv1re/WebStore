using WebStore.Models;
using WebStore.ViewModels;

namespace WebStore.Database.Interfaces
{
    public interface IItemRepository
    {
        Task<Item> GetItem(int id);
        Task<Category> GetCategory(int id);
        Task<IEnumerable<Item>> GetAllItems();
        Task<IEnumerable<Item>> SearchWithName(string name);
        Task<IEnumerable<Item>> SearchWithCategory(int categoryId);
        Task<IEnumerable<Item>> GetPopularItems();
        Task CreateItem(ItemViewModel item);
        Task EditItem(Item item);
        Task DeleteItem(Item item);
        Task<int> SaveChangesAsync();
    }
}
