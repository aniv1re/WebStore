namespace WebStore.Models
{
    public class Order
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int ItemId { get; set; }
        public int Count { get; set; }
        public int StatusId { get; set; }
        public int MapItemId { get; set; }
        public DateTime Date { get; set; }

        public enum StatusType
        {
            Checking,
            Accepted,
            Received
        }
    }
}
