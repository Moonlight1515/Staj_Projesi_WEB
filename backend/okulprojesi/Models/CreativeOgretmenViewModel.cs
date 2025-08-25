namespace okulprojesi.Models
{
    public class CreativeOgretmenViewModel
    {
        public string Name { get; set; } = null!;
        public string Surname { get; set; } = null!;
        public string Tc { get; set; } = null!;
        public string Phone { get; set; } = null!;
        public string Email { get; set; } = null!;
        public DateTime DateOfBirth { get; set; }

        public int BransId { get; set; }
    }
}

