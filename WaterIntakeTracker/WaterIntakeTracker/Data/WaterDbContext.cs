using Microsoft.EntityFrameworkCore;
using WaterIntakeTracker.Models;

namespace WaterIntakeTracker.Data
{
    public class WaterDbContext : DbContext
    {
        public WaterDbContext(DbContextOptions<WaterDbContext> options) : base(options)
        {
        }

        public DbSet<WaterLog> WaterLogs => Set<WaterLog>();
    }
}