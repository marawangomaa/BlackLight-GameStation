
using Microsoft.AspNetCore.Mvc;
using BlackLight.Application.Interfaces;
using BlackLight.Domain.Entities;

namespace BlackLight.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IRepository<Product> _productRepo;
        public ProductsController(IRepository<Product> productRepo) => _productRepo = productRepo;

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _productRepo.GetAllAsync());

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Product product)
        {
            await _productRepo.AddAsync(product);
            await _productRepo.SaveChangesAsync();
            return Ok(product);
        }
    }
}
