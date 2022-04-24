using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebStore.Database.Interfaces;
using WebStore.Models;

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


        [HttpGet("get/item/{itemId}")]
        public async Task<Item> GetItem([FromRoute] int itemId)
        {
            return await itemRepository.GetItem(itemId);
        }

        [HttpGet("get/item/all")]
        public async Task<IEnumerable<Item>> GetAllItems()
        {
            return await itemRepository.GetAllItems();
        }

        [HttpGet("get/item/name/{name}")]
        public async Task<IEnumerable<Item>> GetItemByName([FromRoute] string name)
        {
            return await itemRepository.SearchWithName(name);
        }

        [HttpGet("get/item/category/{categoryId}")]
        public async Task<IEnumerable<Item>> GetItemByCategory([FromRoute] int categoryId)
        {
            return await itemRepository.SearchWithCategory(categoryId);
        }

        [HttpPost("add/item")]
        [Authorize]
        public async Task<IActionResult> AddItem([FromForm] Item item)
        {
            await itemRepository.CreateItem(item);
            await itemRepository.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("edit/item")]
        [Authorize]
        public async Task<IActionResult> EditItem([FromForm] Item item)
        {
            await itemRepository.EditItem(item);
            await itemRepository.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("delete/item")]
        [Authorize]
        public async Task<IActionResult> DeleteItem([FromForm] Item item)
        {
            await itemRepository.DeleteItem(item);
            await itemRepository.SaveChangesAsync();

            return NoContent();
        }
    }
}
