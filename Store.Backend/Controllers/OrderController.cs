﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebStore.Database.Interfaces;
using WebStore.Models;

namespace WebStore.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IOrderRepository orderRepository;

        public OrderController(IOrderRepository orderRepository)
        {
            this.orderRepository = orderRepository;
        }

        [HttpGet("get/{orderId}")]
        public async Task<Order> GetOrder([FromRoute] int orderId)
        {
            return await orderRepository.GetOrder(orderId);
        }

        [HttpGet("get/all")]
        public async Task<IEnumerable<Order>> GetAllOrders()
        {
            return await orderRepository.GetAllOrders();
        }
        
        [HttpGet("get/user/{userId}")]
        public async Task<IEnumerable<Order>> GetUserOrders([FromRoute] int userId)
        {
            return await orderRepository.GetUserOrders(userId);
        }
        
        [HttpPost("add")]
        public async Task<IActionResult> CreateOrder([FromForm] Order order)
        {
            await orderRepository.CreateOrder(order);
            await orderRepository.SaveChangesAsync();

            return NoContent();
        }
        
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
