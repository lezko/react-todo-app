import {ITodo} from 'models/ITodo';
import {UserPrivilege} from 'models/IUserTodoRelation';
import {IUser} from 'models/IUser';

export function getTodoCreator(todo: ITodo): IUser {
    for (const r of todo.users) {
        if (r.privilege === UserPrivilege.Creator) {
            return r.user;
        }
    }
    throw new Error('Got todo without creator');
}