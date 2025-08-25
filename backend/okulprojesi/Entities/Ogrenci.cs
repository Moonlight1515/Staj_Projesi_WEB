namespace okulprojesi.Entities
{
    public class Ogrenci
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = null!;
        public string Surname { get; set; } = null!;
        public string TC { get; set; } = null!;
        public string Phone { get; set; } = null!;
        public string Gender { get; set; } = null!;
        public DateTime DateOfBirth { get; set; }
        public int SinifId { get; set; }
        public Sinif? Sinif { get; set; }
    }
}

