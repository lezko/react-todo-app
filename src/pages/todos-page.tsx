import TodoList from 'components/TodoList';
import {createContext, useEffect, useState} from 'react';
import NewTodoForm, {NewTodoData} from 'components/NewTodoForm';
import axios from 'axios';
import {ITodo} from 'models/ITodo';
import Spinner from 'components/Spinner';
import {ApiUrl} from 'api-url';
import {Button, Modal} from 'antd';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlus, faXmark} from '@fortawesome/free-solid-svg-icons';
import {useLoggedInUser} from 'hooks/user';
import {useAppDispatch} from 'store';
import {setUserList} from 'store/userListSlice';
import {useUserList} from 'hooks/userList';
import {useRefreshTodo} from 'hooks/refreshTodo';
import {refresh} from 'store/refreshTodoSlice';

export type TodosContextType = { todos: ITodo[], setTodos: (todos: ITodo[]) => void };
export const TodosContext = createContext<TodosContextType | null>(null);

const TodosPage = () => {
    const [todos, setTodos] = useState<ITodo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [limit, setLimit] = useState(10);
    const [todosCount, setTodosCount] = useState(0);
    const [page, setPage] = useState(1);
    const pageCount = Math.ceil(todosCount / limit);
    const pageButtonsCount = pageCount > 1 ? pageCount : 0;

    const [searchStr, setSearchStr] = useState('');
    const [lastSearch, setLastSearch] = useState('');

    const {user} = useLoggedInUser();
    const userList = useUserList();
    useEffect(() => {
        if (userList.users.length) {
            return;
        }
        let ignore = false;
        axios.get(ApiUrl.getUsers())
            .then(res => {
                if (!ignore) {
                    dispatch(setUserList(res.data.reduce((arr: string[], u: any) => {
                        arr.push(u.login);
                        return arr;
                    }, []).filter((u: string) => u !== user.login)));
                    setError('');
                }
            })
            .catch(e => {
                if (!ignore) {
                    if (axios.isAxiosError(e)) {
                        setError(e.response?.data.message);
                    } else {
                        setError(e.message);
                    }
                }
            });
        return () => {
            ignore = true;
        };
    }, []);

    const {value: refreshValue} = useRefreshTodo();

    useEffect(() => {
        fetchWithSearch(page, limit, searchStr, true);
    }, [refreshValue]);

    const [newTodoModalOpen, setNewTodoModalOpen] = useState(false);

    // todo extract NewTodo component
    const [data, setData] = useState<NewTodoData>({title: '', description: ''});
    const [hasDescription, setHasDescription] = useState(false);

    const [pending, setPending] = useState(false);
    const [newTodoError, setNewTodoError] = useState('');

    const handleSubmit = (e: any) => {
        e.preventDefault();
        setPending(true);
        axios.post(ApiUrl.createTodo(), JSON.stringify(data))
            .then(() => {
                dispatch(refresh());
                setNewTodoError('');
                setData({title: '', description: ''});
                setNewTodoModalOpen(false);
            })
            .catch(e => {
                if (axios.isAxiosError(e)) {
                    setNewTodoError(e.response?.data.message);
                } else {
                    setNewTodoError(e.message);
                }
            })
            .finally(() => {
                setPending(false);
            });
    };

    const dispatch = useAppDispatch();

    async function fetchWithSearch(page: number, limit: number, searchStr: string, updateTotal: boolean) {
        setLoading(true);
        let receivedCount = 0;
        if (updateTotal) {
            await axios.get(ApiUrl.getTodosCount(searchStr))
                .then(res => {
                    receivedCount = res.data.count;
                })
                .catch(e => {
                    setError(e.message);
                });
            setPage(page);
        }

        axios.get(ApiUrl.getTodos(page, limit, searchStr))
            .then(res => {
                setError('');
                if (updateTotal) {
                    setTodosCount(receivedCount);
                }
                setTodos(res.data.sort((a: ITodo, b: ITodo) => b.id - a.id));
                setSearchStr('');
                setLastSearch(searchStr);
            })
            .catch(e => {
                if (axios.isAxiosError(e)) {
                    setNewTodoError(e.response?.data.message);
                } else {
                    setNewTodoError(e.message);
                }
            })
            .finally(() => setLoading(false));
    }

    return (
        <div className="main todos-page">
            <TodosContext.Provider value={{todos, setTodos}}>
                <Modal
                    open={newTodoModalOpen}
                    closable
                    onCancel={() => setNewTodoModalOpen(false)}
                    okButtonProps={{type: 'default'}}
                    onOk={handleSubmit}
                    // todo autofocus title input
                    footer={<div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
                        {pending ? <div style={{marginRight: 10}}><Spinner /></div> : null}
                        <Button onClick={() => setNewTodoModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSubmit}>OK</Button>
                    </div>}
                >
                    <>
                        <NewTodoForm
                            error={newTodoError}
                            disabled={pending}
                            data={data}
                            setData={setData}
                            hasDescription={hasDescription}
                            setHasDescription={setHasDescription}
                        />
                    </>
                </Modal>
                <div className="toolbar">
                    <button className="new-todo-btn" onClick={() => setNewTodoModalOpen(true)}>
                        <FontAwesomeIcon icon={faPlus} />
                        <span>new todo</span>
                    </button>
                    <div>
                        Total: {todosCount}
                    </div>
                </div>

                <div className="container">
                    <div style={{display: 'flex', marginBottom: 20}}>
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchStr}
                            onKeyDown={e => {
                                if (e.key === 'Enter') {
                                    fetchWithSearch(1, limit, searchStr, true);
                                }
                            }}
                            onChange={e => {
                                setSearchStr(e.target.value);
                            }}
                        />
                        <button disabled={!searchStr} onClick={() => {
                            fetchWithSearch(1, limit, searchStr, true);
                        }} style={{marginLeft: 10}}>OK
                        </button>
                    </div>
                    {lastSearch &&
                        <div style={{display: 'flex', alignItems: 'center', marginBottom: 15}}>
                            <span style={{lineHeight: 1}}>Showing results for "<i>{lastSearch}</i>"</span>
                            <FontAwesomeIcon
                                style={{cursor: 'pointer', marginLeft: 10, width: 20, height: 20}}
                                onClick={() => {
                                    setSearchStr('');
                                    fetchWithSearch(1, limit, '', true);
                                }} icon={faXmark} />
                        </div>
                    }
                </div>

                {loading ?
                    <div style={{textAlign: 'center', marginTop: 40}}>loading todos <Spinner /></div> :
                    error
                        ? <div style={{color: 'red'}}>{error}</div> :
                        <>
                            <TodoList
                                todos={todos}
                            />
                            <div className="container">
                                <ul className="page-btns">{Array(pageButtonsCount).fill(null).map((_, i) =>
                                    <li key={i}>
                                        <button
                                            className={i + 1 === page ? 'active' : ''}
                                            onClick={() => {
                                                setPage(i + 1);
                                                fetchWithSearch(i + 1, limit, lastSearch, false);
                                            }}>{i + 1}
                                        </button>
                                    </li>
                                )}</ul>
                            </div>
                        </>
                }
            </TodosContext.Provider>
        </div>
    );
};

export default TodosPage;
