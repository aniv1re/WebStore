namespace WebStore.ViewModels
{
    public class EditItemViewModel
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string Price { get; set; }
        public int StockCount { get; set; }
        public int CategoryId { get; set; }
        public string Manufacture { get; set; }
        public string Substance { get; set; }
        public string ExpiryDate { get; set; }
        public string StorageCondition { get; set; }
        public string Indications { get; set; }
        public string Contraindications { get; set; }
        public string Usage { get; set; }
        public string ItemContent { get; set; }
        public string SideEffect { get; set; }
    }
}
