import {ChangeEvent, createRef, FC, RefObject, SyntheticEvent, useContext, useRef, useState} from 'react';
import {getApiUrl} from 'config';
import {TodosContext, TodosContextType} from 'pages/todos-page';
import {getTokenFromLocalStorage} from 'utils/tokenStorage';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCheck, faEdit, faStar, faTrash, faXmark} from '@fortawesome/free-solid-svg-icons';
import useModal from 'antd/es/modal/useModal';
import {getSettingsFromLocalStorage} from 'utils/settingsStorage';
import Toggle from 'components/Toggle';
import Checkbox from 'components/Checkbox';
import Spinner from 'components/Spinner';
import {useAppSelector} from 'store';
import {ITodo} from 'models/ITodo';
import axios from 'axios';
import * as assert from 'assert';

interface TodoProps {
    todo: ITodo;
}

const Todo: FC<TodoProps> = ({todo}) => {
    const {user} = useAppSelector(state => state.user);

    const {todos, setTodos} = useContext(TodosContext) as TodosContextType;
    const [status, setStatus] = useState('default');
    const [hasDesc, setHasDesc] = useState(Boolean(todo.description));
    const [pending, setPending] = useState(false);
    const [editData, setEditData] = useState({
        title: todo.title,
        description: todo.description,
        isCompleted: todo.isCompleted
    });
    const resetEditData = () => {
        setEditData({
            title: todo.title,
            description: todo.description,
            isCompleted: todo.isCompleted
        });
    };

    const [error, setError] = useState('');
    const inputRef: RefObject<HTMLInputElement> = createRef();

    const [{confirm}, contextHolder] = useModal();
    const settings = getSettingsFromLocalStorage();

    const deleteTodo = () => {
        setPending(true);
        axios.delete(getApiUrl() + '/todos/' + todo.id)
            .then(() => {
                setTodos(todos.filter(t => t.id !== todo.id));
                setError('');
            })
            .catch(e => {
                if (axios.isAxiosError(e)) {
                    setError(e.response?.data.message);
                } else {
                    setError(e.message);
                }
            })
            .finally(() => setPending(false));
        // fetch(getApiUrl() + '/todos/' + todo.id, {
        //     method: 'delete',
        //     headers: {
        //         'ngrok-skip-browser-warning': '69420',
        //         'authorization': getTokenFromLocalStorage()
        //     }
        // })
        //     .then(res => {
        //         if (res.ok) {
        //             setTodos(todos.filter(t => t.id !== todo.id));
        //         } else {
        //             console.error('Error while deleting todo: ' + JSON.stringify(res));
        //         }
        //     })
        //     .catch(e => {
        //         setError(e.message);
        //     })
        //     .finally(() => {
        //         setPending(false);
        //     });
    };

    const startUpdate = () => {
        setStatus('edit');
    };

    const updateCurrentTodo = (newData: any) => {
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

    const confirmUpdate = (updatedData: any) => {
        if (!editData.title) {
            setError('Title must not be empty');
            return;
        }
        if (hasDesc && !editData.description) {
            setError('Description must not be empty');
            return;
        }

        setError('');
        setPending(true);
        fetch(getApiUrl() + '/todos/' + todo.id, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': '69420',
                'authorization': getTokenFromLocalStorage()
            },
            body: JSON.stringify({
                title: updatedData.title,
                description: updatedData.description,
                isCompleted: updatedData.completed
            }),
        })
            .then(res => {
                if (res.ok) {
                    setError('');
                    updateCurrentTodo(updatedData);
                    setEditData(updatedData);
                    setStatus('default');
                } else if (res.status === 400) {
                    return res.json();
                } else {
                    setError(`Request failed: ${res.status}`);
                    resetEditData();
                }
            })
            .then(data => {
                if (data) {
                    setError(data.message);
                    resetEditData();
                }
            })
            .catch(e => {
                setError(e.message);
                resetEditData();
            })
            .finally(() => setPending(false));
    };

    const cancelUpdate = () => {
        setEditData({title: todo.title, description: todo.description, isCompleted: editData.isCompleted});
        setError('');
        setStatus('default');
    };

    const handleChange = (e: any) => {
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
            assert(user !== null);
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
                        {!editData.isCompleted &&
                            <button disabled={pending} onClick={startUpdate}><FontAwesomeIcon icon={faEdit} /></button>}
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
                    <button disabled={pending} onClick={() => {
                        confirmUpdate({...editData, description: hasDesc ? editData.description : ''});
                    }}><FontAwesomeIcon icon={faCheck} /></button>
                }
            </div>
        );
    };

    const handleChangeCompleted = nextCompleted => {
        confirmUpdate({...editData, isCompleted: nextCompleted});
    };
    return (
        <div className={'todo ' + (status === 'edit' ? 'edit' : '')}>
            {contextHolder}
            {pending && <Spinner className="pending-spinner" />}

            {status === 'default' &&
                <Checkbox
                    disabled={+user.id !== +todo.creator.id}
                    title={editData.isCompleted ? 'unmark completed' : 'mark completed'}
                    className="todo__checkbox"
                    checked={editData.isCompleted}
                    setChecked={handleChangeCompleted}
                />
            }
            {getTodoInfoHtml()}
            <div
                className="todo__author"
                style={{color: todo.creator.color}}
            >
                {todo.creator.login} {todo.creator.role === 'ROLE_ADMIN' && <FontAwesomeIcon icon={faStar} />}
            </div>

            {getButtonsHtml()}
            {error && <div style={{color: 'red'}}>{error}</div>}
        </div>
    );
};

export default Todo;