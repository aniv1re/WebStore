using Microsoft.AspNetCore.Mvc;
using WebStore.Database.Interfaces;
using WebStore.Models;

namespace WebStore.Controllers
{
    [Route("api/[controller]")]
    public class NewsController : ControllerBase
    {
        private readonly INewsRepository newsRepository;

        public NewsController(INewsRepository newsRepository)
        {
            this.newsRepository = newsRepository;
        }

        [HttpGet("get/last")]
        public async Task<IEnumerable<News>> GetLastNews()
        {
            return await newsRepository.GetLastNews();
        }

        [HttpGet("get/all")]
        public async Task<IEnumerable<News>> GetAllNews()
        {
            return await newsRepository.GetAllNews();
        }
    }
}
