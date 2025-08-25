using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using okulprojesi.Models;

namespace okulprojesi.Data
{
    public class OkulDbContextFactory : IDesignTimeDbContextFactory<OkulDB>
    {
        public OkulDB CreateDbContext(string[] args)
        {
            var builder = new DbContextOptionsBuilder<OkulDB>();

            
            builder.UseSqlServer(
                "Server=(localdb)\\mssqllocaldb;Database=OkulDb;Trusted_Connection=True;MultipleActiveResultSets=true");

            return new OkulDB(builder.Options);
            

    }
      

    }
}



