using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Globalization;
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
        private static string path = string.Empty;

        public ItemRepository(ApplicationDatabaseContext dbContext, IMapper mapper, IWebHostEnvironment appEnvironment)
        {
            this.dbContext = dbContext;
            this.mapper = mapper;

            path = $@"{appEnvironment.ContentRootPath}\Images\";
            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }
        }

        public async Task<Item> GetItem(int id)
        {
            return await dbContext.Items.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id && x.IsStock == true);
        }

        public async Task IncVisitCount(int itemId)
        {
            var item = await dbContext.Items.AsNoTracking().FirstOrDefaultAsync(x => x.Id == itemId);
            item.VisitCount++;
            dbContext.Update(item);
            await dbContext.SaveChangesAsync();
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

        public async Task<List<Item>> GetAllItems()
        {
            return await dbContext.Items.AsNoTracking().Where(x => x.IsStock == true).ToListAsync();
        }

        public async Task<List<Item>> SearchWithName(string name)
        { 
            return await dbContext.Items.AsNoTracking().Where(x => x.Name.Contains(name) && x.IsStock == true).ToListAsync();
        }

        public async Task<List<Item>> SearchWithCategory([FromUri] ItemQuery query)
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

        public async Task<List<Item>> GetPopularItems()
        {
            return await dbContext.Items.AsNoTracking().Where(x => x.IsStock == true).OrderByDescending(x => x.VisitCount).Take(8).ToListAsync();
        }
        
        public async Task<List<Item>> GetPopularSmallItems()
        {
            return await dbContext.Items.AsNoTracking().Where(x => x.IsStock == true).OrderByDescending(x => x.VisitCount).Take(4).ToListAsync();
        }

        public async Task CreateItem(ItemViewModel item)
        {
            var newItem = mapper.Map<Item>(item);

            var fileName = Guid.NewGuid() + Path.GetExtension(item.Image.FileName);
            var pathFile = path + @$"\{fileName}";
            using var stream = new FileStream(pathFile, FileMode.Create);
            await item.Image.CopyToAsync(stream);
            newItem.Image = fileName;

            newItem.IsStock = true;
            newItem.VisitCount = 0;
            newItem.IsDiscount = false;

            await dbContext.Items.AddAsync(newItem);
            await dbContext.SaveChangesAsync();
        }

        public async Task EditItem(EditItemViewModel item)
        {
            Item getItem = await dbContext.Items.AsNoTracking().FirstOrDefaultAsync(x => x.Name == item.Name);

            Item newItem = new Item { 
                Id = getItem.Id,
                Name = item.Name,
                CategoryId = item.CategoryId,
                Contraindications = item.Contraindications,
                Description = item.Description,
                DosageDescription = getItem.DosageDescription,
                ExpiryDate = item.ExpiryDate,
                Image = getItem.Image,
                Indications = item.Indications,
                IsStock = getItem.IsStock,
                ItemContent = item.ItemContent,
                Manufacture = item.Manufacture,
                SideEffect = item.SideEffect,
                Usage = item.Usage,
                Substance = item.Substance,
                StockCount = item.StockCount,
                Price = float.Parse(item.Price, CultureInfo.InvariantCulture.NumberFormat),
                StorageCondition = item.StorageCondition,
                DiscountPrice = getItem.DiscountPrice,
                IsDiscount = getItem.IsDiscount,
                VisitCount = getItem.VisitCount
            };

            getItem = newItem;
            dbContext.Items.Update(getItem);

            await dbContext.SaveChangesAsync();
        }

        public async Task DeleteItem(int id)
        {
            Item getItem = await dbContext.Items.FirstOrDefaultAsync(x => x.Id == id);

            dbContext.Items.Remove(getItem);
            await dbContext.SaveChangesAsync();
        }

        public Task<int> SaveChangesAsync()
        {
            return dbContext.SaveChangesAsync();
        }
    }
}
