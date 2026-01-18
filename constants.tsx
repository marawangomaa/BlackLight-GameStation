
import React from 'react';

export const COLORS = {
  primary: '#FFD700', // Neon Yellow
  secondary: '#1A1A1A',
  accent: '#00D1FF', // Neon Blue
  background: '#000000',
};

export const BACKEND_ARCHITECTURE_MD = `
### Onion Architecture (.NET 8)

1. **Domain Layer**: 
   - Entities (BaseEntity, User, Booking, etc.)
   - Enums
   - Domain Exceptions
   - Value Objects

2. **Application Layer**:
   - Interfaces (IRepository, IEmailService)
   - DTOs (Data Transfer Objects)
   - Mappers (AutoMapper)
   - Use Cases / Services (BookingService, OrderService)
   - Validators (FluentValidation)

3. **Infrastructure Layer**:
   - Persistence (EF Core, SQL Server)
   - Identity (JWT Implementation)
   - External Services (Email, Payment Gateways)
   - Migrations

4. **Web API**:
   - Controllers
   - Middlewares (Error handling, Logging)
   - Configurations (Swagger, CORS)
   - Background Tasks
`;

export const DATABASE_ENTITY_SNIPPET = `
// Domain/Entities/Booking.cs
public class Booking : BaseEntity
{
    public int RoomId { get; set; }
    public Room Room { get; set; }
    
    public string UserId { get; set; }
    public ApplicationUser User { get; set; }
    
    public DateTime StartTime { get; set; }
    public int DurationHours { get; set; }
    public decimal TotalPrice { get; set; }
    
    public BookingStatus Status { get; set; }
    
    // Soft Delete Implementation
    public bool IsDeleted { get; set; }
    
    // Audit Fields
    public DateTime CreatedAt { get; set; }
    public string CreatedBy { get; set; }
}
`;

export const DB_CONTEXT_SNIPPET = `
// Infrastructure/Persistence/ApplicationDbContext.cs
public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions options) : base(options) {}

    public DbSet<Room> Rooms { get; set; }
    public DbSet<Booking> Bookings { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<Order> Orders { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        
        // Fluent API Configuration
        builder.Entity<Booking>(entity => {
            entity.Property(e => e.TotalPrice).HasPrecision(18, 2);
            entity.HasQueryFilter(e => !e.IsDeleted); // Global Soft Delete
            entity.HasIndex(e => e.StartTime);
        });
        
        // Relationship mapping
        builder.Entity<Order>()
               .HasMany(o => o.OrderItems)
               .WithOne(i => i.Order)
               .HasForeignKey(i => i.OrderId);
    }
}
`;

export const ANGULAR_STRUCTURE_SNIPPET = `
// Angular 19 Standalone Structure
src/
├── app/
│   ├── core/           # Guards, Interceptors, Singleton Services
│   ├── shared/         # Reusable Components, Directives, Pipes
│   ├── features/       # Feature-based lazy-loaded modules
│   │   ├── auth/
│   │   ├── admin/      # Admin Dashboard (Signals based)
│   │   ├── booking/    # Booking Flow
│   │   └── menu/       # POS & Menu
│   ├── app.routes.ts   # Lazy loading definition
│   └── app.config.ts   # Provider configs (i18n, provideRouter)
└── assets/
    └── i18n/
        ├── en.json     # English translations
        └── ar.json     # Arabic (RTL support)
`;
