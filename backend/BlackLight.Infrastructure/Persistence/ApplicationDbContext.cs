
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
        public DbSet<Ad> Ads { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Booking>(entity => {
                entity.Property(e => e.TotalPrice).HasPrecision(18, 2);
                entity.Property(e => e.DepositAmount).HasPrecision(18, 2);
            });

            builder.Entity<Order>(entity => {
                entity.Property(e => e.TotalAmount).HasPrecision(18, 2);
            });
            
            builder.Entity<Product>(entity => {
                entity.Property(e => e.Price).HasPrecision(18, 2);
            });
            
            builder.Entity<OrderItem>(entity => {
                entity.HasOne(oi => oi.Product).WithMany().HasForeignKey(oi => oi.ProductId);
                entity.Property(oi => oi.Id).ValueGeneratedOnAdd();
            });
        }
    }
}
