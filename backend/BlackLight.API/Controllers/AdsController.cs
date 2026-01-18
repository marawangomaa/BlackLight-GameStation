
using Microsoft.AspNetCore.Mvc;
using BlackLight.Application.Interfaces;
using BlackLight.Domain.Entities;
using Microsoft.AspNetCore.Authorization;

namespace BlackLight.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdsController : ControllerBase
    {
        private readonly IRepository<Ad> _adRepo;
        public AdsController(IRepository<Ad> adRepo) => _adRepo = adRepo;

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _adRepo.GetAllAsync());

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] Ad ad)
        {
            await _adRepo.AddAsync(ad);
            await _adRepo.SaveChangesAsync();
            return Ok(ad);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var ad = await _adRepo.GetByIdAsync(id);
            if (ad == null) return NotFound();
            _adRepo.Delete(ad);
            await _adRepo.SaveChangesAsync();
            return NoContent();
        }
    }
}
