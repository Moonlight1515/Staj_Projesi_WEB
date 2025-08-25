using okulprojesi.Entities;


public class Ogretmen
{
    
    
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Surname { get; set; } = null!;
        public string Tc { get; set; } = null!;          // TC Kimlik No
        public string Phone { get; set; } = null!;       // Telefon
        public string Email { get; set; } = null!;
        public DateTime DateOfBirth { get; set; }
        public int BransId { get; set; }

    
    




    
}

