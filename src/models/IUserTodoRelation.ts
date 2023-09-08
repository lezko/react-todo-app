import {IUser} from 'models/IUser';

export enum Privilege {
    Creator = 'CREATOR',
    Owner = 'OWNER',
    Moderator = 'MODERATOR',
    Reader = 'READER'
}

export interface IUserTodoRelation {
    user: IUser;
    privilege: Privilege;
}