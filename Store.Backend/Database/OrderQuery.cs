using static WebStore.Models.Order;

namespace WebStore.Database
{
    public class OrderQuery
    {
        public int Id { get; set; }
        public StatusType Status { get; set; }
    }
}
