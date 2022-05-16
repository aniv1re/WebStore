using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebStore.Database.Interfaces;
using WebStore.Models;

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

        [Authorize]
        [HttpPost("add")]
        public async Task<IActionResult> CreateOrder([FromForm] Order order)
        {
            await orderRepository.CreateOrder(order);
            await orderRepository.SaveChangesAsync();

            return NoContent();
        }

        [Authorize]
        [HttpPost("edit")]
        public async Task<IActionResult> EditOrder([FromForm] Order order)
        {
            await orderRepository.EditOrder(order);
            await orderRepository.SaveChangesAsync();

            return NoContent();
        }
        
        [HttpPost("delete")]
        public async Task<IActionResult> DeleteOrder([FromForm] Order order)
        {
            await orderRepository.DeleteOrder(order);
            await orderRepository.SaveChangesAsync();

            return NoContent();
        }
    }
}
