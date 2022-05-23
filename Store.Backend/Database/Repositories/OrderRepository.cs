using AutoMapper;
using Microsoft.EntityFrameworkCore;
using WebStore.Database.Interfaces;
using WebStore.Models;
using WebStore.ViewModels;

namespace WebStore.Database.Repositories
{
    public class OrderRepository : IOrderRepository
    {
        private readonly ApplicationDatabaseContext dbContext;
        private readonly IMapper mapper;

        public OrderRepository(ApplicationDatabaseContext dbContext, IMapper mapper)
        {
            this.dbContext = dbContext;
            this.mapper = mapper;
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
        
        public async Task<IEnumerable<MapItem>> GetItemsLocationPoints(string city)
        {
            return await dbContext.MapItems.AsNoTracking().Where(x => x.City == city).ToListAsync();
        }

        public async Task<IEnumerable<MapItem>> GetAllLocationPoints()
        {
            return await dbContext.MapItems.AsNoTracking().ToListAsync();
        }

        public async Task<MapItem> GetItemLocationPoint(int id)
        {
            return await dbContext.MapItems.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<int> CreateOrder(OrderViewModel order)
        {
            var newOrder = mapper.Map<Order>(order);

            var createdOrder = await dbContext.Orders.AddAsync(newOrder);
            await dbContext.SaveChangesAsync();

            return createdOrder.Entity.Id;
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
