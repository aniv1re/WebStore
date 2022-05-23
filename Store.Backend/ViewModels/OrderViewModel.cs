using static WebStore.Models.Order;

namespace WebStore.ViewModels
{
    public class OrderViewModel
    {
        public int UserId { get; set; }
        public string Items { get; set; }
        public float Price { get; set; }
        public StatusType StatusId { get; set; }
        public int MapItemId { get; set; }
        public DateTime Date { get; set; }
        public bool IsGuest { get; set; }
        public int GuestID { get; set; }
    }
}
