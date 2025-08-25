using AutoMapper;
using okulprojesi.Entities;
using okulprojesi.Models;

namespace okulprojesi
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles() 
        { 
            CreateMap<Ogrenci, CreativeOgrenciViewModel>();
            
        }
    }
}
