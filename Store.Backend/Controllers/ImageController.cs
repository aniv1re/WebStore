using Microsoft.AspNetCore.Mvc;

namespace WebStore.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class ImageController : ControllerBase
    {
        public readonly string path = string.Empty;

        public ImageController(IWebHostEnvironment appEnvironment)
        {
            path = $@"{appEnvironment.ContentRootPath}\Images\";
            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }
        }


        [HttpGet]
        public async Task<IActionResult> GetImage(string imageName)
        {
            var image = new FileInfo($@"{path}\{imageName}");

            if (image.Exists)
            {
                return PhysicalFile($@"{path}\{imageName}", "image/jpeg");
            }

            //фото заглушка 
            return null;
        }
    }
}
