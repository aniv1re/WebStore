export class Item {
    constructor(
        public id: number,
        public name: string,
        public image: string | null,
        public description: string  | null,
        public price: number,
        public isStock: boolean,
        public stockCount: number,
        public categoryId: number  | null,
        public manufacture: string  | null,
        public substance: string  | null,
        public dosageDescription: string  | null,
        public isDiscount: boolean,
        public discountPrice: number  | null,
        public expiryDate: Date  | null,
        public storageCondition: string  | null,
        public indications: string  | null,
        public contraindications: string  | null,
        public usage: string  | null,
        public itemContent: string,
        public sideEffect: string  | null,
        public visitCount: number
    ) {}
}