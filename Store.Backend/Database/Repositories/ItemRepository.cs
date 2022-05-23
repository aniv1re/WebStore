using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Web.Http;
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
            return await dbContext.Items.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id && x.IsStock == true);
        }
        
        public async Task<Category> GetCategory(int id)
        {
            return await dbContext.Categories.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        }
        
        public async Task<Manufacture> GetManufacture(int id)
        {
            return await dbContext.Manufactures.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        }
        
        public async Task<Substance> GetSubstance(int id)
        {
            return await dbContext.Substances.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<IEnumerable<Item>> GetAllItems()
        {
            return await dbContext.Items.AsNoTracking().Where(x => x.IsStock == true).ToListAsync();
        }

        public async Task<IEnumerable<Item>> SearchWithName(string name)
        { 
            return await dbContext.Items.AsNoTracking().Where(x => x.Name.Contains(name) && x.IsStock == true).ToListAsync();
        }

        public async Task<IEnumerable<Item>> SearchWithCategory([FromUri] ItemQuery query)
        {
            switch (query.SortState)
            {
                case SortState.nameAsc:
                    return await dbContext.Items.AsNoTracking().Where(x => x.CategoryId == query.CategoriesId && x.IsStock == true).OrderBy(x => x.Name).ToListAsync();
                case SortState.nameDesc:
                    return await dbContext.Items.AsNoTracking().Where(x => x.CategoryId == query.CategoriesId && x.IsStock == true).OrderByDescending(x => x.Name).ToListAsync();
                case SortState.priceAsc:
                    return await dbContext.Items.AsNoTracking().Where(x => x.CategoryId == query.CategoriesId && x.IsStock == true).OrderBy(x => x.Price).ToListAsync();
                case SortState.priceDesc:
                    return await dbContext.Items.AsNoTracking().Where(x => x.CategoryId == query.CategoriesId && x.IsStock == true).OrderByDescending(x => x.Price).ToListAsync();
                case SortState.popularAsc:
                    return await dbContext.Items.AsNoTracking().Where(x => x.CategoryId == query.CategoriesId && x.IsStock == true).OrderBy(x => x.VisitCount).ToListAsync();
                case SortState.popularDesc:
                    return await dbContext.Items.AsNoTracking().Where(x => x.CategoryId == query.CategoriesId && x.IsStock == true).OrderByDescending(x => x.VisitCount).ToListAsync();
                default:
                    return await dbContext.Items.AsNoTracking().Where(x => x.CategoryId == query.CategoriesId && x.IsStock == true).OrderBy(x => x.Name).ToListAsync();
            }
        }

        public async Task<IEnumerable<Item>> GetPopularItems()
        {
            return await dbContext.Items.AsNoTracking().Where(x => x.IsStock == true).OrderByDescending(x => x.VisitCount).Take(8).ToListAsync();
        }
        
        public async Task<IEnumerable<Item>> GetPopularSmallItems()
        {
            return await dbContext.Items.AsNoTracking().Where(x => x.IsStock == true).OrderByDescending(x => x.VisitCount).Take(4).ToListAsync();
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
