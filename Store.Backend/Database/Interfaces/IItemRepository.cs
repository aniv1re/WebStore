using System.Web.Http;
using WebStore.Models;
using WebStore.ViewModels;

namespace WebStore.Database.Interfaces
{
    public interface IItemRepository
    {
        Task<Item> GetItem(int id);
        Task IncVisitCount(int itemId);
        Task<Category> GetCategory(int id);
        Task<Manufacture> GetManufacture(int id);
        Task<Substance> GetSubstance(int id);
        Task<List<Item>> GetAllItems();
        Task<List<Item>> SearchWithName(string name);
        Task<List<Item>> SearchWithCategory([FromUri] ItemQuery query);
        Task<List<Item>> GetPopularItems();
        Task<List<Item>> GetPopularSmallItems();
        Task CreateItem(ItemViewModel item);
        Task EditItem(EditItemViewModel item);
        Task DeleteItem(int id);
        Task<int> SaveChangesAsync();
    }
}
