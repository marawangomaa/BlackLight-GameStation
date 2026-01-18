
using Microsoft.AspNetCore.Mvc;
using BlackLight.Application.Interfaces;
using BlackLight.Domain.Entities;
using Microsoft.AspNetCore.Authorization;

namespace BlackLight.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PaymentsController : ControllerBase
    {
        private readonly IRepository<Order> _orderRepo;
        private readonly IRepository<Booking> _bookingRepo;

        public PaymentsController(IRepository<Order> orderRepo, IRepository<Booking> bookingRepo)
        {
            _orderRepo = orderRepo;
            _bookingRepo = bookingRepo;
        }

        [HttpPost("{type}/{id}/mark-paid")]
        public async Task<IActionResult> MarkPaid(string type, Guid id)
        {
            if (type.ToLower() == "order")
            {
                var order = await _orderRepo.GetByIdAsync(id);
                if (order == null) return NotFound();
                order.PaymentStatus = "Paid";
                await _orderRepo.SaveChangesAsync();
            }
            else
            {
                var booking = await _bookingRepo.GetByIdAsync(id);
                if (booking == null) return NotFound();
                booking.PaymentStatus = PaymentStatus.Paid;
                await _bookingRepo.SaveChangesAsync();
            }
            return Ok();
        }
    }
}
