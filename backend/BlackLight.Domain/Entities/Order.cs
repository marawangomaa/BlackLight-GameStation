
using System;
using System.Collections.Generic;

namespace BlackLight.Domain.Entities
{
    public class Order : BaseEntity
    {
        public string UserId { get; set; } = string.Empty;
        public string CustomerName { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = "Pending";
        public string OrderType { get; set; } = "DineIn";
        public string? Location { get; set; }
        public string? PhoneNumber { get; set; }
        public string PaymentStatus { get; set; } = "Unpaid";
        public List<OrderItem> OrderItems { get; set; } = new();
    }
}
