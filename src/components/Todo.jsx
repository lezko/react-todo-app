import {useContext, useState} from 'react';
import {getApiUrl} from 'config';
import {TodosContext} from 'pages/TodosPage';
import {UserContext} from 'App';
import {getTokenFromLocalStorage} from 'utils/tokenStorage';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faStar} from '@fortawesome/free-solid-svg-icons';

const Todo = ({todo}) => {
    const {todos, setTodos} = useContext(TodosContext);
    const {user} = useContext(UserContext);
    const [status, setStatus] = useState('default');
    const [pending, setPending] = useState(false);
    const [editData, setEditData] = useState({title: todo.title, description: todo.description});
    const [error, setError] = useState('');

    const deleteTodo = () => {
        setPending(true);
        fetch(getApiUrl() + '/todos/' + todo.id, {
            method: 'delete',
            headers: {
                'ngrok-skip-browser-warning': '69420',
                'authorization': getTokenFromLocalStorage()
            }
        })
            .then(res => {
                if (res.ok) {
                    setTodos(todos.filter(t => t.id !== todo.id));
                } else {
                    console.error('Error while deleting todo: ' + JSON.stringify(res));
                }
            })
            .catch(e => {
                setError(e.message);
            })
            .finally(() => {
                setPending(false);
            });
    };

    const startUpdate = () => {
        setStatus('edit');
    };

    const updateCurrentTodo = () => {
        setTodos(todos.map(t => {
            if (t.id === todo.id) {
                return {
                    ...t,
                    title: editData.title,
                    description: editData.description,
                };
            }
            return t;
        }));
    };

    const confirmUpdate = () => {
        setPending(true);
        fetch(getApiUrl() + '/todos/' + todo.id, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': '69420',
                'authorization': getTokenFromLocalStorage()
            },
            body: JSON.stringify(editData),
        })
            .then(res => {
                if (res.ok) {
                    setError('');
                    updateCurrentTodo();
                    setStatus('default');
                } else if (res.status === 400) {
                    return res.json();
                } else {
                    setError(`Request failed: ${res.status}`);
                }
            })
            .then(data => {
                if (data) {
                    setError(data.message);
                }
            })
            .catch(e => {
                setError(e.message);
            })
            .finally(() => setPending(false));
    };

    const cancelUpdate = () => {
        setEditData({title: todo.title, description: todo.description});
        setError('');
        setStatus('default');
    };

    const handleChange = e => {
        setEditData({
            ...editData,
            [e.target.name]: e.target.value
        });
    };

    const getTodoInfoHtml = () => {
        if (status === 'default') {
            return (<>
                <div className="todo__title">{todo.title}</div>
                <div className="todo__description">{todo.description}</div>
            </>);
        }
        return (
            <form>
                <input value={editData.title} onChange={handleChange} type="text" name="title" />
                <input value={editData.description} onChange={handleChange} type="text" name="description" />
            </form>
        );
    };

    const getButtonsHtml = () => {
        if (status === 'default') {
            if (user.role === 'ROLE_ADMIN' || +user.id === +todo.creator.id) {
                return (
                    <div className="todo_buttons">
                        <button disabled={pending} onClick={deleteTodo}>Delete</button>
                        <button disabled={pending} onClick={startUpdate}>Edit</button>
                    </div>
                );
            }
            return null;
        }

        return (
            <div className="todo__buttons">
                <button disabled={pending} onClick={cancelUpdate}>Cancel</button>
                <button disabled={pending} onClick={confirmUpdate}>Save</button>
            </div>
        );
    };

    return (
        <div className="todo">
            {getTodoInfoHtml()}
            <div className="todo__author">{todo.creator.login} {todo.creator.role === 'ROLE_ADMIN' && <FontAwesomeIcon icon={faStar} />}</div>
            {getButtonsHtml()}
            <div style={{color: 'red'}}>{error}</div>
        </div>
    );
};

export default Todo;