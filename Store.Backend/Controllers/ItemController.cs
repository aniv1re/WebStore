using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Web.Http;
using WebStore.Database;
using WebStore.Database.Interfaces;
using WebStore.Models;
using WebStore.ViewModels;
using AuthorizeAttribute = Microsoft.AspNetCore.Authorization.AuthorizeAttribute;
using HttpGetAttribute = Microsoft.AspNetCore.Mvc.HttpGetAttribute;
using HttpPostAttribute = Microsoft.AspNetCore.Mvc.HttpPostAttribute;
using RouteAttribute = Microsoft.AspNetCore.Mvc.RouteAttribute;

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
        public async Task<ActionResult<Item>> GetItem([FromRoute] int itemId)
        {
            var item = await itemRepository.GetItem(itemId);

            if (item == null) { return NotFound(); } else { return item; }
        }
        
        [HttpGet("get/categorytitle/{id}")]
        public async Task<Category> GetCategory([FromRoute] int id)
        {
            return await itemRepository.GetCategory(id);
        }

        [HttpGet("get/manufacturetitle/{id}")]
        public async Task<Manufacture> GetManufacture([FromRoute] int id)
        {
            return await itemRepository.GetManufacture(id);
        }

        [HttpGet("get/substancetitle/{id}")]
        public async Task<Substance> GetSubstance([FromRoute] int id)
        {
            return await itemRepository.GetSubstance(id);
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

        [HttpPost("get/category")]
        public async Task<IEnumerable<Item>> SearchWithCategory([FromUri] ItemQuery query)
        {
            return await itemRepository.SearchWithCategory(query);
        }
        
        [HttpGet("get/popular")]
        public async Task<IEnumerable<Item>> GetPopularItems()
        {
            return await itemRepository.GetPopularItems();
        }

        [HttpGet("get/popularsmall")]
        public async Task<IEnumerable<Item>> GetPopularSmallItems()
        {
            return await itemRepository.GetPopularSmallItems();
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
