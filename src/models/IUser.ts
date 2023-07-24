export enum UserRole {
    User = 'ROLE_USER',
    Admin = 'ROLE_ADMIN'
}

export interface IUser {
    id: number;
    color: string;
    login: string;
    role: UserRole;
}
