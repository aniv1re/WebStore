using AutoMapper;
using WebStore.Models;
using WebStore.ViewModels;

namespace WebMessenger.Mapper
{
    public class Mapper : Profile
    {
        public Mapper()
        {
            CreateMap<User, RegUserViewModel>().ReverseMap();
        }
    }
}
