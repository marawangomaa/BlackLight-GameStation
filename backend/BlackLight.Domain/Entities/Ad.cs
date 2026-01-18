
using System;

namespace BlackLight.Domain.Entities
{
    public class Ad : BaseEntity
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Image { get; set; } = string.Empty;
        public string? Link { get; set; }
        public bool IsPermanent { get; set; } = true;
        public DateTime? ExpiresAt { get; set; }
    }
}
