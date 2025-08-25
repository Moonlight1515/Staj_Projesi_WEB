namespace okulprojesi.Entities
{
    public class Sinif
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;  // ya da string? Name { get; set; }
        public int OgrenciSayisi { get; set; }

        public List<Ogrenci> Ogrenciler { get; set; } = new List<Ogrenci>(); // constructor içinde başlatılmış hali
    }


}
