using Microsoft.EntityFrameworkCore;
using WebStore.Models;

namespace WebStore.Database
{
    public class ApplicationDatabaseContext : DbContext
    {
        public ApplicationDatabaseContext(DbContextOptions options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<Item> Items { get; set; }
        public DbSet<Guest> Guests { get; set; }
        public DbSet<News> News { get; set; }
        public DbSet<MapItem> MapItems { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Manufacture> Manufactures { get; set; }
        public DbSet<Substance> Substances { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) { }
    }
}
