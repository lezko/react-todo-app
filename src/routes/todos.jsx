import TodoList from 'components/TodoList';
import {createContext, useEffect, useState} from 'react';
import {getApiUrl} from 'config';
import NewTodo from 'components/NewTodo';
import {getTokenFromLocalStorage} from 'utils/tokenStorage';

export const TodosContext = createContext(null);

const Todos = () => {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    useEffect(() => {
        let ignore = false;
        let ok = true;
        fetch(getApiUrl() + '/todos', {
            headers: {
                'ngrok-skip-browser-warning': '69420',
                'authorization': getTokenFromLocalStorage(),
            }
        })
            .then(res => {
                ok = res.ok;
                return res.json();
            })
            .then(data => {
                if (ignore) {
                    return;
                }
                if (ok) {
                    setTodos(data);
                    setError('');
                } else {
                    setError(data.message);
                }
            })
            .catch(e => {
                if (!ignore) {
                    setError(e.message);
                }
            })
            .finally(() => {
                if (!ignore) {
                    setLoading(false);
                }
            });

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

export default Todos;