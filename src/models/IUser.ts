export enum UserRole {
    User = 'ROLE_USER',
    Admin = 'ROLE_ADMIN'
}

export interface IUser {
    isInBan: boolean;
    id: number;
    color: string;
    login: string;
    role: UserRole;
}
