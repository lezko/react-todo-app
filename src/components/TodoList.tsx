import Todo from 'components/Todo';
import {FC} from 'react';
import {ITodo} from 'models/ITodo';

interface TodoListProps {
    todos: ITodo[];
}

const TodoList: FC<TodoListProps> = ({todos}) => {
    if (todos.length === 0) {
        return <h3 style={{textAlign: 'center', marginTop: 40}}>No todos found</h3>;
    }

    return (
        <ul className="todo-list">
            {todos.map(t =>
                <li key={t.id}>
                    <Todo todo={t} />
                </li>
            )}
        </ul>
    );
};

export default TodoList;