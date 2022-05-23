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
            CreateMap<User, LogUserViewModel>().ReverseMap();
            CreateMap<User, UserViewModel>().ReverseMap();
            CreateMap<User, EditUserViewModel>().ReverseMap();
            CreateMap<User, EditPassUserViewModel>().ReverseMap();
            CreateMap<Item, ItemViewModel>().ReverseMap();
            CreateMap<Order, OrderViewModel>().ReverseMap();
            CreateMap<Guest, GuestViewModel>().ReverseMap();
        }
    }
}
