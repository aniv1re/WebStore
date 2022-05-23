import { Item } from "./item";

export class ItemCount {
    constructor(
        public id: number,
        public items: Item,
        public counts: number
    ) {}
}