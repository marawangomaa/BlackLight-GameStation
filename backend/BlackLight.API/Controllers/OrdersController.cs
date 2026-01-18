
using Microsoft.AspNetCore.Mvc;
using BlackLight.Application.Interfaces;
using BlackLight.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace BlackLight.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly IRepository<Order> _orderRepo;
        public OrdersController(IRepository<Order> orderRepo) => _orderRepo = orderRepo;

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            if (User.IsInRole("Admin")) return Ok(await _orderRepo.GetAllAsync());
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return Ok(await _orderRepo.FindAsync(o => o.UserId == userId));
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Order order)
        {
            order.UserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "Guest";
            await _orderRepo.AddAsync(order);
            await _orderRepo.SaveChangesAsync();
            return Ok(order);
        }

        [HttpPatch("{id}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] string status)
        {
            var order = await _orderRepo.GetByIdAsync(id);
            if (order == null) return NotFound();
            order.Status = status;
            await _orderRepo.SaveChangesAsync();
            return NoContent();
        }
    }
}
