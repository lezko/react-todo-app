import {IUser} from 'models/IUser';

export interface ITodo {
    id: number;
    title: string;
    description: string;
    isCompleted: boolean;
    creator: IUser;
}
