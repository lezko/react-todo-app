import {useContext, useRef, useState} from 'react';
import {getApiUrl} from 'config';
import {TodosContext} from 'pages/todos-page';
import {getTokenFromLocalStorage} from 'utils/tokenStorage';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCheck, faEdit, faStar, faTrash, faXmark} from '@fortawesome/free-solid-svg-icons';
import {UserContext} from 'hooks/user';
import useModal from 'antd/es/modal/useModal';
import {getSettingsFromLocalStorage} from 'utils/settingsStorage';
import Toggle from 'components/Toggle';

const Todo = ({todo}) => {
    const {todos, setTodos} = useContext(TodosContext);
    const {user} = useContext(UserContext);
    const [status, setStatus] = useState('default');
    const [hasDesc, setHasDesc] = useState(Boolean(todo.description));
    const [pending, setPending] = useState(false);
    const [editData, setEditData] = useState({title: todo.title, description: todo.description});
    const [error, setError] = useState('');
    const inputRef = useRef();

    const [{confirm}, contextHolder] = useModal();
    const settings = getSettingsFromLocalStorage();

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

    const updateCurrentTodo = (newData) => {
        setTodos(todos.map(t => {
            if (t.id === todo.id) {
                return {
                    ...t,
                    ...newData
                };
            }
            return t;
        }));
    };

    const confirmUpdate = () => {
        if (!editData.title) {
            setError('Title must not be empty');
            return;
        }
        if (hasDesc && !editData.description) {
            setError('Description must not be empty');
            return;
        }
        setError('');

        const updatedData = {...editData, description: hasDesc ? editData.description : ''};
        setEditData(updatedData);

        setPending(true);
        fetch(getApiUrl() + '/todos/' + todo.id, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': '69420',
                'authorization': getTokenFromLocalStorage()
            },
            body: JSON.stringify(updatedData),
        })
            .then(res => {
                if (res.ok) {
                    setError('');
                    updateCurrentTodo(updatedData);
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
                <div className="input-holder">
                    <input ref={inputRef} autoFocus value={editData.title} onChange={handleChange} type="text"
                           name="title" />
                    {/*<FontAwesomeIcon onClick={() => inputRef.current.focus()} className="icon" icon={faEdit} />*/}
                </div>
                <div className="desc-toggle">
                    <span>Description</span>
                    <Toggle title={hasDesc ? 'remove description' : 'add description'} active={hasDesc}
                            setActive={setHasDesc} />
                </div>
                {hasDesc &&
                    <textarea rows={5} value={editData.description} onChange={handleChange} name="description" />}
            </form>
        );
    };

    const getButtonsHtml = () => {
        if (status === 'default') {
            if (+user.id === +todo.creator.id) {
                return (
                    <div className="todo__buttons">
                        <button disabled={pending} onClick={() => {
                            if (!settings.confirmDeleteTodo) {
                                deleteTodo();
                                return;
                            }
                            confirm({
                                title: 'Confirmation',
                                content: 'Sure you want to delete this todo?',
                                okType: 'default',
                                onOk: () => {
                                    deleteTodo();
                                },
                                closable: true,
                            });
                        }}><FontAwesomeIcon icon={faTrash} />
                        </button>
                        <button disabled={pending} onClick={startUpdate}><FontAwesomeIcon icon={faEdit} /></button>
                    </div>
                );
            }
            return null;
        }

        return (
            <div className="todo__buttons">
                <button disabled={pending} onClick={cancelUpdate}><FontAwesomeIcon icon={faXmark} /></button>
                {(todo.title !== editData.title ||
                    todo.description !== (hasDesc ? editData.description : '')) &&
                    <button disabled={pending} onClick={confirmUpdate}><FontAwesomeIcon icon={faCheck} /></button>
                }
            </div>
        );
    };

    return (
        <div className="todo">
            {contextHolder}
            {getTodoInfoHtml()}
            <div
                className="todo__author"
                style={{color: todo.creator.color}}
            >
                {todo.creator.login} {todo.creator.role === 'ROLE_ADMIN' && <FontAwesomeIcon icon={faStar} />}
            </div>
            {getButtonsHtml()}
            <div style={{color: 'red'}}>{error}</div>
        </div>
    );
};

export default Todo;