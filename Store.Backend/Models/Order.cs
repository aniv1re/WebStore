namespace WebStore.Models
{
    public class Order
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Items { get; set; }
        public float Price { get; set; }
        public StatusType StatusId { get; set; }
        public int MapItemId { get; set; }
        public DateTime Date { get; set; }
        public bool IsGuest { get; set; }
        public int GuestID { get; set; }

        public enum StatusType
        {
            Checking = 2,
            Accepted = 4,
            Received = 8
        }
    }
}
