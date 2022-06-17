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
            return await dbContext.Orders.AsNoTracking().OrderByDescending(x => x.StatusId == Order.StatusType.Checking).ToListAsync();
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
        
        public async Task AddLocation(MapItemViewModel location)
        {
            var newLocation = mapper.Map<MapItem>(location);

            await dbContext.MapItems.AddAsync(newLocation);
            await dbContext.SaveChangesAsync();
        }

        public async Task EditOrder(Order order)
        {
            Order getOrder = await dbContext.Orders.FirstOrDefaultAsync(x => x.Id == order.Id);

            getOrder = order;

            await dbContext.SaveChangesAsync();
        }
        
        public async Task EditLocation(MapItem location)
        {
            MapItem getLocation = await dbContext.MapItems.FirstOrDefaultAsync(x => x.Id == location.Id);

            getLocation = location;

            await dbContext.SaveChangesAsync();
        }

        public async Task EditOrderStatus(OrderQuery order)
        {
            Order selectedOrder = await dbContext.Orders.FirstOrDefaultAsync(x => x.Id == order.Id);
            selectedOrder.StatusId = order.Status;
            await dbContext.SaveChangesAsync();
        }

        public async Task DeleteOrder(int orderId)
        {
            Order selectedOrder = await dbContext.Orders.FirstOrDefaultAsync(x => x.Id == orderId);
            dbContext.Orders.Remove(selectedOrder);
            await dbContext.SaveChangesAsync();
        }
        
        public async Task DeleteLocation(int id)
        {
            MapItem selectedLcoation = await dbContext.MapItems.FirstOrDefaultAsync(x => x.Id == id);
            dbContext.MapItems.Remove(selectedLcoation);
            await dbContext.SaveChangesAsync();
        }

        public Task<int> SaveChangesAsync()
        {
            return dbContext.SaveChangesAsync();
        }
    }
}
