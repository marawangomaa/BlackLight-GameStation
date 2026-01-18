using Microsoft.AspNetCore.Identity;
using System;

namespace BlackLight.Domain.Entities
{
    public class ApplicationUser : IdentityUser
    {
        public string FullName { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string ProfileImage { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}