using Microsoft.EntityFrameworkCore;
using WebStore.Database.Interfaces;
using WebStore.Models;

namespace WebStore.Database.Repositories
{
    public class OrderRepository : IOrderRepository
    {
        private readonly ApplicationDatabaseContext dbContext;

        public OrderRepository(ApplicationDatabaseContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<Order> GetOrder(int id)
        {
            return await dbContext.Orders.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<IEnumerable<Order>> GetAllOrders()
        {
            return await dbContext.Orders.AsNoTracking().ToListAsync();
        }

        public async Task<IEnumerable<Order>> GetUserOrders(int userId)
        {
            return await dbContext.Orders.AsNoTracking().Where(x => x.UserId == userId).ToListAsync();
        }

        public async Task CreateOrder(Order order)
        {
            await dbContext.Orders.AddAsync(order);
            await dbContext.SaveChangesAsync();
        }

        public async Task EditOrder(Order order)
        {
            Order getOrder = await dbContext.Orders.FirstOrDefaultAsync(x => x.Id == order.Id);

            getOrder = order;

            await dbContext.SaveChangesAsync();
        }
        
        public async Task DeleteOrder(Order order)
        {
            dbContext.Orders.Remove(order);
            await dbContext.SaveChangesAsync();
        }

        public Task<int> SaveChangesAsync()
        {
            return dbContext.SaveChangesAsync();
        }
    }
}
