namespace WebStore.Models
{
    public class Item
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? Image { get; set; }
        public string? Description { get; set; }
        public float Price { get; set; }
        public bool IsStock { get; set; }
        public int StockCount { get; set; }
        public int? CategoryId { get; set; }
        public string? Manufacture { get; set; }
        public string? Substance { get; set; }
        public string? DosageDescription { get; set; }
        public bool IsDiscount { get; set; }
        public float? DiscountPrice { get; set; }
        public string? ExpiryDate { get; set; }
        public string? StorageCondition { get; set; }
        public string? Indications { get; set; }
        public string? Contraindications { get; set; }
        public string? Usage { get; set; }
        public string ItemContent { get; set; }
        public string? SideEffect { get; set; }
        public int VisitCount { get; set; }
    }
}
