
using Microsoft.AspNetCore.Mvc;
using BlackLight.Application.Interfaces;
using BlackLight.Domain.Entities;

namespace BlackLight.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoomsController : ControllerBase
    {
        private readonly IRepository<Room> _roomRepo;
        public RoomsController(IRepository<Room> roomRepo) => _roomRepo = roomRepo;

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _roomRepo.GetAllAsync());

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Room room)
        {
            await _roomRepo.AddAsync(room);
            await _roomRepo.SaveChangesAsync();
            return Ok(room);
        }
    }
}
