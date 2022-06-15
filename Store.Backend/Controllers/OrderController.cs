using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebStore.Database;
using WebStore.Database.Interfaces;
using WebStore.Models;
using WebStore.ViewModels;

namespace WebStore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IOrderRepository orderRepository;

        public OrderController(IOrderRepository orderRepository)
        {
            this.orderRepository = orderRepository;
        }

        [Authorize]
        [HttpGet("get/{orderId}")]
        public async Task<Order> GetOrder([FromRoute] int orderId)
        {
            return await orderRepository.GetOrder(orderId);
        }

        [Authorize]
        [HttpGet("get/all")]
        public async Task<IEnumerable<Order>> GetAllOrders()
        {
            return await orderRepository.GetAllOrders();
        }

        [Authorize]
        [HttpGet("get/user/{userId}")]
        public async Task<IEnumerable<Order>> GetUserOrders([FromRoute] int userId)
        {
            return await orderRepository.GetUserOrders(userId);
        }

        [HttpGet("get/locations/{city}")]
        public async Task<IEnumerable<MapItem>> GetItemsLocationPoints([FromRoute] string city)
        {
            return await orderRepository.GetItemsLocationPoints(city);
        }

        [HttpGet("get/locationbyid/{id}")]
        public async Task<MapItem> GetItemLocationPoint([FromRoute] int id)
        {
            return await orderRepository.GetItemLocationPoint(id);
        }
        
        [HttpGet("get/locations/all")]
        public async Task<IEnumerable<MapItem>> GetAllLocationPoints()
        {
            return await orderRepository.GetAllLocationPoints();
        }

        [HttpPost("add")]
        public async Task<int> CreateOrder([FromBody] OrderViewModel order)
        {
            return await orderRepository.CreateOrder(order);
        }

        [Authorize]
        [HttpPost("add/location")]
        public async Task<IActionResult> AddLocation([FromForm] MapItemViewModel location)
        {
            await orderRepository.AddLocation(location);
            
            return Ok();
        }

        [Authorize]
        [HttpPost("edit")]
        public async Task<IActionResult> EditOrder([FromForm] Order order)
        {
            await orderRepository.EditOrder(order);
            await orderRepository.SaveChangesAsync();

            return Ok();
        }
        
        [Authorize]
        [HttpPost("edit/status")]
        public async Task<IActionResult> EditOrderStatus([System.Web.Http.FromUri] OrderQuery order)
        {
            await orderRepository.EditOrderStatus(order);
            await orderRepository.SaveChangesAsync();

            return Ok();
        }
        
        [Authorize]
        [HttpPost("edit/location")]
        public async Task<IActionResult> EditLocation([FromForm] MapItem location)
        {
            await orderRepository.EditLocation(location);
            await orderRepository.SaveChangesAsync();

            return Ok();
        }

        [Authorize]
        [HttpPost("delete")]
        public async Task<IActionResult> DeleteOrder([FromBody] int orderId)
        {
            await orderRepository.DeleteOrder(orderId);
            await orderRepository.SaveChangesAsync();

            return Ok();
        }

        [Authorize]
        [HttpPost("delete/location")]
        public async Task<IActionResult> DeleteLocation([FromBody] int id)
        {
            await orderRepository.DeleteLocation(id);
            await orderRepository.SaveChangesAsync();

            return Ok();
        }
    }
}
