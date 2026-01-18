
using System;

namespace BlackLight.Domain.Entities
{
    public class Room : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Image { get; set; }
        public string Type { get; set; } = "Standard"; // VIP, Standard, etc.
        public decimal PricePerHour { get; set; }
        public string PsModel { get; set; } = "PS5";
        public bool IsAvailable { get; set; } = true;
    }
}
