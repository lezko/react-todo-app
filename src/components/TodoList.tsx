import Todo from 'components/Todo';
import {FC, useMemo} from 'react';
import {ITodo} from 'models/ITodo';
import {IUserTodoRelation} from 'models/IUserTodoRelation';

interface TodoListProps {
    todos: ITodo[];
    q: string;
}

const TodoList: FC<TodoListProps> = ({todos, q}) => {
    if (todos.length === 0) {
        return <h3 style={{textAlign: 'center', marginTop: 40}}>No todos added yet</h3>;
    }

    function checkUsersMatchQuery(relations: IUserTodoRelation[], qStr: string) {
        return relations.some(r => r.user.login.toLowerCase().includes(qStr));
    }

    const filteredTodos = useMemo(() => {
        return todos.filter(t => (
            t.title.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q) ||
            checkUsersMatchQuery(t.users, q)
        ));
    }, [todos, q]);
    return (
        <ul className="todo-list">
            {filteredTodos.map(t =>
                <li key={t.id}>
                    <Todo todo={t} />
                </li>
            )}
        </ul>
    );
};

export default TodoList;