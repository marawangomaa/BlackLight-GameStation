
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BlackLight.Application.Interfaces;
using BlackLight.Domain.Entities;
using System.Security.Claims;

namespace BlackLight.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class BookingsController : ControllerBase
    {
        private readonly IRepository<Booking> _bookingRepo;

        public BookingsController(IRepository<Booking> bookingRepo)
        {
            _bookingRepo = bookingRepo;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            if (User.IsInRole("Admin"))
                return Ok(await _bookingRepo.GetAllAsync());

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return Ok(await _bookingRepo.FindAsync(b => b.UserId == userId));
        }

        [HttpPost]
        public async Task<IActionResult> Create(Booking booking)
        {
            booking.UserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            await _bookingRepo.AddAsync(booking);
            await _bookingRepo.SaveChangesAsync();
            return CreatedAtAction(nameof(GetAll), new { id = booking.Id }, booking);
        }

        [HttpPatch("{id}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] BookingStatus status)
        {
            var booking = await _bookingRepo.GetByIdAsync(id);
            if (booking == null) return NotFound();

            booking.Status = status;
            await _bookingRepo.SaveChangesAsync();
            return NoContent();
        }
    }
}
