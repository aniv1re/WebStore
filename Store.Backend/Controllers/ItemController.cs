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

            item.Image = $"{Request.Scheme}://{Request.Host}" + $"{Url.Action("GetImage", "Image", new { imageName = item.Image })}";

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
            var items = await itemRepository.GetAllItems();

            for (int i = 0; i < items.Count; i++)
            {
                items[i].Image = $"{Request.Scheme}://{Request.Host}" + $"{Url.Action("GetImage", "Image", new { imageName = items[i].Image })}";
            }

            return items;
        }

        [HttpGet("get/name/{name}")]
        public async Task<IEnumerable<Item>> GetItemByName([FromRoute] string name)
        {
            var items = await itemRepository.SearchWithName(name);

            for (int i = 0; i < items.Count; i++)
            {
                items[i].Image = $"{Request.Scheme}://{Request.Host}" + $"{Url.Action("GetImage", "Image", new { imageName = items[i].Image })}";
            }

            return items;
        }

        [HttpPost("get/category")]
        public async Task<IEnumerable<Item>> SearchWithCategory([FromUri] ItemQuery query)
        {
            var items = await itemRepository.SearchWithCategory(query);

            for (int i = 0; i < items.Count; i++)
            {
                items[i].Image = $"{Request.Scheme}://{Request.Host}" + $"{Url.Action("GetImage", "Image", new { imageName = items[i].Image })}";
            }

            return items;
        }
        
        [HttpGet("get/popular")]
        public async Task<IEnumerable<Item>> GetPopularItems()
        {
            var items = await itemRepository.GetPopularItems();

            for (int i = 0; i < items.Count; i++)
            {
                items[i].Image = $"{Request.Scheme}://{Request.Host}" + $"{Url.Action("GetImage", "Image", new { imageName = items[i].Image })}";
            }

            return items;
        }

        [HttpGet("get/popularsmall")]
        public async Task<IEnumerable<Item>> GetPopularSmallItems()
        {
            var items = await itemRepository.GetPopularSmallItems();

            for (int i = 0; i < items.Count; i++)
            {
                items[i].Image = $"{Request.Scheme}://{Request.Host}" + $"{Url.Action("GetImage", "Image", new { imageName = items[i].Image })}";
            }

            return items;
        }

        [HttpPost("incVisitCount")]
        public async Task IncVisitCount([Microsoft.AspNetCore.Mvc.FromBody] int itemId)
        {
            await itemRepository.IncVisitCount(itemId);
            await itemRepository.SaveChangesAsync();
        }

        [HttpPost("add")]
        [Authorize]
        public async Task<IActionResult> AddItem([FromForm] ItemViewModel item)
        {
            await itemRepository.CreateItem(item);
            await itemRepository.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("edit")]
        [Authorize]
        public async Task<IActionResult> EditItem([FromForm] EditItemViewModel item)
        {
            await itemRepository.EditItem(item);
            await itemRepository.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("delete")]
        [Authorize]
        public async Task<IActionResult> DeleteItem([Microsoft.AspNetCore.Mvc.FromBody] int id)
        {
            await itemRepository.DeleteItem(id);
            await itemRepository.SaveChangesAsync();

            return Ok();
        }
    }
}
