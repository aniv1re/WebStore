using static WebStore.Models.User;

namespace WebStore.ViewModels
{
    public class UserViewModel
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Phone { get; set; }
        public RoleType RoleId { get; set; }
        public DateTime RegDate { get; set; }

    }
}
