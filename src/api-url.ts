import {getApiUrl} from 'config';

const url = getApiUrl();

export class ApiUrl {
    static me = url + '/me';

    static login() {
        return url + '/login';
    }

    static register() {
        return url + '/register';
    }

    static getUsers() {
        return url + '/users';
    }

    static getTodos() {
        return url + '/todos';
    }

    private static todoWithId(id: number) {
        return url + '/todos/' + id;
    }

    static updateTodo(id: number) {
        return this.todoWithId(id);
    }

    static deleteTodo(id: number) {
        return this.todoWithId(id);
    }

    static createTodo() {
        return url + '/todos'
    }

    private static userWithId(id: number) {
        return url + '/user/' + id;
    }

    static updateUser(id: number) {
        return this.userWithId(id);
    }

    static banUser(id: number) {
        return url + '/ban/' + id;
    }

    static resetLogin(id: number) {
        return this.userWithId(id);
    }

    static resetPassword(id: number) {
        return this.userWithId(id);
    }
}

