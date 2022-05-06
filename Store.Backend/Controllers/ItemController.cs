using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebStore.Database.Interfaces;
using WebStore.Models;
using WebStore.ViewModels;

namespace WebStore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ItemController : ControllerBase
    {
        private readonly IItemRepository itemRepository;

        public ItemController(IItemRepository itemRepository)
        {
            this.itemRepository = itemRepository;
        }


        [HttpGet("get/{itemId}")]
        public async Task<Item> GetItem([FromRoute] int itemId)
        {
            return await itemRepository.GetItem(itemId);
        }
        
        [HttpGet("get/categorytitle/{id}")]
        public async Task<Category> GetCategory([FromRoute] int id)
        {
            return await itemRepository.GetCategory(id);
        }

        [HttpGet("get/all")]
        public async Task<IEnumerable<Item>> GetAllItems()
        {
            return await itemRepository.GetAllItems();
        }

        [HttpGet("get/name/{name}")]
        public async Task<IEnumerable<Item>> GetItemByName([FromRoute] string name)
        {
            return await itemRepository.SearchWithName(name);
        }

        [HttpGet("get/category/{categoryId}")]
        public async Task<IEnumerable<Item>> GetItemByCategory([FromRoute] int categoryId)
        {
            return await itemRepository.SearchWithCategory(categoryId);
        }
        
        [HttpGet("get/popular")]
        public async Task<IEnumerable<Item>> GetPopularItems()
        {
            return await itemRepository.GetPopularItems();
        }

        [HttpPost("add")]
        [Authorize]
        public async Task<IActionResult> AddItem([FromForm] ItemViewModel item)
        {
            await itemRepository.CreateItem(item);
            await itemRepository.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("edit")]
        [Authorize]
        public async Task<IActionResult> EditItem([FromForm] Item item)
        {
            await itemRepository.EditItem(item);
            await itemRepository.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("delete")]
        [Authorize]
        public async Task<IActionResult> DeleteItem([FromForm] Item item)
        {
            await itemRepository.DeleteItem(item);
            await itemRepository.SaveChangesAsync();

            return NoContent();
        }
    }
}
