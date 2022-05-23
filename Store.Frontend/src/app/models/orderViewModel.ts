export class OrderViewModel {
    constructor(
        public userId: number,
        public items: string,
        public price: number,
        public statusId: StatusId,
        public mapItemId: number,
        public date: Date,
        public isGuest: boolean,
        public guestId: number
    ) {}
}

export enum StatusId {
    checking = 2,
    accepted = 4,
    received = 8
}