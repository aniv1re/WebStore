using WebStore.Models;
using WebStore.ViewModels;

namespace WebStore.Database.Interfaces
{
    public interface IOrderRepository
    {
        Task<Order> GetOrder(int id);
        Task<IEnumerable<Order>> GetAllOrders();
        Task<IEnumerable<Order>> GetUserOrders(int userId);
        Task<IEnumerable<MapItem>> GetItemsLocationPoints(string city);
        Task<MapItem> GetItemLocationPoint(int id);
        Task<IEnumerable<MapItem>> GetAllLocationPoints();
        Task<int> CreateOrder(OrderViewModel order);
        Task EditOrder(Order order);
        Task DeleteOrder(Order order);
        Task<int> SaveChangesAsync();
    }
}
