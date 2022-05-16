namespace WebStore.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Phone { get; set; }
        public string Password { get; set; }
        public RoleType Role { get; set; }
        public DateTime RegDate { get; set; }
        public bool IsGuest { get; set; }

        public enum RoleType
        {
            User,
            Admin
        }
    }
}
