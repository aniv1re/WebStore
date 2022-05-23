export class News {
    constructor(
        public id: number,
        public title: string,
        public content: string,
        public image: string,
        public date: Date,
    ) {}
}