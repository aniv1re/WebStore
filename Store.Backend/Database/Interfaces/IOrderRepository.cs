using WebStore.Models;
using WebStore.ViewModels;

namespace WebStore.Database.Interfaces
{
    public interface IOrderRepository
    {
        Task<Order> GetOrder(int id);
        Task<IEnumerable<Order>> GetAllOrders();
        Task<IEnumerable<Order>> GetUserOrders(int userId);
        Task CreateOrder(Order order);
        Task EditOrder(Order order);
        Task DeleteOrder(Order order);
        Task<int> SaveChangesAsync();
    }
}
