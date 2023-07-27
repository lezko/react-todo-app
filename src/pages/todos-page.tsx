import TodoList from 'components/TodoList';
import {createContext, useEffect, useState} from 'react';
import {getApiUrl} from 'config';
import NewTodo from 'components/NewTodo';
import axios from 'axios';
import {ITodo} from 'models/ITodo';

export type TodosContextType = { todos: ITodo[], setTodos: (todos: ITodo[]) => void };
export const TodosContext = createContext<TodosContextType | null>(null);

const TodosPage = () => {
    const [todos, setTodos] = useState<ITodo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    useEffect(() => {
        let ignore = false;
        axios.get(getApiUrl() + '/todos')
            .then(res => {
                if (!ignore) {
                    setTodos(res.data);
                }
            })
            .catch(e => {
                if (!ignore) {
                    setError(e.message);
                }
            })
            .finally(() => setLoading(false));

        return () => {
            ignore = true;
        };
    }, []);

    return (
        <div className="main">
            {loading ?
                'loading...' :
                error
                    ? <div style={{color: 'red'}}>{error}</div> :
                    <TodosContext.Provider value={{todos, setTodos}}>
                        <NewTodo />
                        <TodoList />
                    </TodosContext.Provider>
            }
        </div>
    );
};

export default TodosPage;