
using System;

namespace BlackLight.Domain.Entities
{
    public class Product : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Category { get; set; } = "Drink";
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public string? Image { get; set; }
    }
}
