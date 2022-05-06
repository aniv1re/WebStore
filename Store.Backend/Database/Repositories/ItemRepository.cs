using AutoMapper;
using Microsoft.EntityFrameworkCore;
using WebStore.Database.Interfaces;
using WebStore.Models;
using WebStore.ViewModels;

namespace WebStore.Database.Repositories
{
    public class ItemRepository : IItemRepository
    {
        private readonly ApplicationDatabaseContext dbContext;
        private readonly IMapper mapper;

        public ItemRepository(ApplicationDatabaseContext dbContext, IMapper mapper)
        {
            this.dbContext = dbContext;
            this.mapper = mapper;
        }

        public async Task<Item> GetItem(int id)
        {
            return await dbContext.Items.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        }
        
        public async Task<Category> GetCategory(int id)
        {
            return await dbContext.Categories.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<IEnumerable<Item>> GetAllItems()
        {
            return await dbContext.Items.AsNoTracking().ToListAsync();
        }

        public async Task<IEnumerable<Item>> SearchWithName(string name)
        { 
            return await dbContext.Items.AsNoTracking().Where(x => x.Name.StartsWith(name)).ToListAsync(); ;
        }

        public async Task<IEnumerable<Item>> SearchWithCategory(int categoryId)
        {
            return await dbContext.Items.AsNoTracking().Where(x => x.CategoryId == categoryId).ToListAsync(); ;
        }

        public async Task<IEnumerable<Item>> GetPopularItems()
        {
            return await dbContext.Items.AsNoTracking().OrderByDescending(x => x.VisitCount).Take(8).ToListAsync();
        }

        public async Task CreateItem(ItemViewModel item)
        {
            var newItem = mapper.Map<Item>(item);

            await dbContext.Items.AddAsync(newItem);
            await dbContext.SaveChangesAsync();
        }

        public async Task EditItem(Item item)
        {
            Item getItem = await dbContext.Items.FirstOrDefaultAsync(x => x.Id == item.Id);

            getItem = item;

            await dbContext.SaveChangesAsync();
        }

        public async Task DeleteItem(Item item)
        {
            dbContext.Items.Remove(item);
            await dbContext.SaveChangesAsync();
        }

        public Task<int> SaveChangesAsync()
        {
            return dbContext.SaveChangesAsync();
        }
    }
}
