export class UserExt {
    constructor(
        public id: number,
        public email: string,
        public name: string,
        public surname: string,
        public phone: string,
        public role: RoleType,
        public regDate: Date
    ) {}
}

enum RoleType {
    User,
    Admin
}