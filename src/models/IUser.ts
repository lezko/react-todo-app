export enum UserRole {
    User = 'USER',
    Admin = 'ADMIN'
}

export interface IUser {
    isInBan: boolean;
    id: number;
    color: string;
    login: string;
    role: UserRole;
}
