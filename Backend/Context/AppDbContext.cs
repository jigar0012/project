using AngularAuthAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace formAuth.Context
{
    public class AppDbContext : DbContext
    {
        public AppDbContext()
        {
        }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {

        }  
        public DbSet<User> Users { get; set; }
        public IEnumerable<object> UserRegistrations { get; internal set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().ToTable("Users");
        }
    }
}
