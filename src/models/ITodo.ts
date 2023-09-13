import {IUserTodoRelation} from 'models/IUserTodoRelation';

export interface ITodo {
    id: number;
    title: string;
    description: string;
    isCompleted: boolean;
    users: IUserTodoRelation[];
}
