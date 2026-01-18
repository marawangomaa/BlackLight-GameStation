
using Microsoft.EntityFrameworkCore;
using BlackLight.Domain.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace BlackLight.Infrastructure.Persistence
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<Room> Rooms { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Global Soft Delete Filter
            builder.Entity<Booking>().HasQueryFilter(b => !b.IsDeleted);
            builder.Entity<Order>().HasQueryFilter(o => !o.IsDeleted);
            builder.Entity<Room>().HasQueryFilter(r => !r.IsDeleted);

            // Fluent API Configurations
            builder.Entity<Booking>(entity => {
                entity.Property(e => e.TotalPrice).HasPrecision(18, 2);
                entity.Property(e => e.DepositAmount).HasPrecision(18, 2);
            });

            builder.Entity<Order>(entity => {
                entity.Property(e => e.TotalAmount).HasPrecision(18, 2);
            });
        }
    }

    public class ApplicationUser : Microsoft.AspNetCore.Identity.IdentityUser
    {
        public string FullName { get; set; }
        public string Location { get; set; }
        public string ProfileImage { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
