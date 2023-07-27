import Todo from 'components/Todo';
import {useContext} from 'react';
import {TodosContext, TodosContextType} from 'pages/todos-page';

const TodoList = () => {
    const {todos} = useContext(TodosContext) as TodosContextType;
    if (todos.length === 0) {
        return <h3 style={{textAlign: 'center', marginTop: 40}}>No todos added yet</h3>
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