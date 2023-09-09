import {IUser} from 'models/IUser';

export enum UserPrivilege {
    Creator = 'CREATOR',
    Owner = 'OWNER',
    Moderator = 'MODERATOR',
    Reader = 'READER'
}

export interface IUserTodoRelation {
    user: IUser;
    privilege: UserPrivilege;
}