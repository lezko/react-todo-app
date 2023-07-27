import {IUser} from 'models/IUser';

export interface IAuthUser extends IUser {
    token: string;
}