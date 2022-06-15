using Microsoft.AspNetCore.Mvc;
using WebStore.Database.Interfaces;
using WebStore.Models;
using WebStore.ViewModels;

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
            var news = await newsRepository.GetAllNews();

            for (int i = 0; i < news.Count; i++)
            {
                news[i].Image = $"{Request.Scheme}://{Request.Host}" +
                    $"{Url.Action("GetImage", "Image", new { imageName = news[i].Image })}";
            }

            return news;
        }
        
        [HttpGet("get/byid/{id}")]
        public async Task<News> GetNewsById([FromRoute] int id)
        {
            return await newsRepository.GetNewsById(id);
        }
        
        [HttpPost("create")]
        public async Task CreateNews([FromForm] NewsViewModel news)
        {
            await newsRepository.CreateNews(news);
            await newsRepository.SaveChangesAsync();
        }

        [HttpPost("delete")]
        public async Task<IActionResult> DeleteNews([FromBody] int id)
        {
            await newsRepository.DeleteNews(id);
            await newsRepository.SaveChangesAsync();

            return Ok();
        }
    }
}
