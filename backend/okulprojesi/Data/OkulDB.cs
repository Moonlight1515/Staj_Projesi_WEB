using Microsoft.EntityFrameworkCore;
using okulprojesi.Entities; // Brans burada
                            // Brans ve diğer entityler burada

namespace okulprojesi.Data
{
    public class OkulDB : DbContext
    {
        public OkulDB(DbContextOptions<OkulDB> options) : base(options) { }

        public DbSet<Ogrenci> Ogrenciler { get; set; }
        public DbSet<Ogretmen> Ogretmenler { get; set; }
        public DbSet<Sinif> Siniflar { get; set; }
        public DbSet<Brans> Branslar { get; set; }  // <-- Buraya ekle

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Öğrenci-Sınıf ilişkisi
            modelBuilder.Entity<Ogrenci>()
                .HasOne(o => o.Sinif)
                .WithMany(s => s.Ogrenciler)
                .HasForeignKey(o => o.SinifId)
                .OnDelete(DeleteBehavior.Cascade);

            // Branşlar ile ilgili ilişkiler varsa buraya ekle (örneğin Öğretmen ile branş ilişkisi)
            // modelBuilder.Entity<Ogretmen>()
            //     .HasOne(o => o.Brans)
            //     .WithMany()
            //     .HasForeignKey(o => o.BransId);
        }
    }
}
