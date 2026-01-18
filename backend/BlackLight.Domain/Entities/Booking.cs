
using System;

namespace BlackLight.Domain.Entities
{
    public class Booking : BaseEntity
    {
        public Guid RoomId { get; set; }
        public Room Room { get; set; }
        public string UserId { get; set; }
        public DateTime StartTime { get; set; }
        public int DurationHours { get; set; }
        public decimal TotalPrice { get; set; }
        public decimal DepositAmount { get; set; }
        public BookingStatus Status { get; set; } = BookingStatus.Pending;
        public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Unpaid;
    }

    public enum BookingStatus { Pending, Confirmed, Completed, Rejected }
    public enum PaymentStatus { Unpaid, Paid }
}
