import TodoList from 'components/TodoList';
import {createContext, useEffect, useState} from 'react';
import NewTodoForm, {NewTodoData} from 'components/NewTodoForm';
import axios from 'axios';
import {ITodo} from 'models/ITodo';
import Spinner from 'components/Spinner';
import {ApiUrl} from 'api-url';
import {Button, ConfigProvider, Dropdown, Modal} from 'antd';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEllipsis, faPlus} from '@fortawesome/free-solid-svg-icons';
import {useSettings} from 'hooks/settings';
import {useLoggedInUser} from 'hooks/user';
import {setSettings} from 'store/settingsSlice';
import {useAppDispatch} from 'store';
import Checkbox from 'components/Checkbox';
import {getTodoCreator} from 'helpers/todoHelpers';
import {setUserList} from 'store/userListSlice';
import {useUserList} from 'hooks/userList';
import {useRefreshTodo} from 'hooks/refreshTodo';

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

    useEffect(() => {
        let ignore = false;
        axios.get(ApiUrl.getTodosCount())
            .then(res => {
                if (!ignore) {
                    setTodosCount(res.data.count);
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

    const settings = useSettings();
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
            })
            .finally(() => setLoading(false));

        return () => {
            ignore = true;
        };
    }, []);

    const {value: refreshValue} = useRefreshTodo();

    function fetchTodos() {
        setLoading(true);
        axios.get(ApiUrl.getTodos(page, limit, searchStr))
            .then(res => {
                setTodos(res.data.sort((a: any, b: any) => a.id - b.id));
            })
            .catch(e => {
                setError(e.message);
            })
            .finally(() => setLoading(false));
    }
    useEffect(() => {
        fetchTodos();
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
            .then(res => {
                setTodos([res.data, ...todos]);
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
    const [showOnlyMyTodos, setShowOnlyMyTodos] = useState(settings.showOnlyMyTodos);
    const handleChangeShowOnlyMy = () => {
        const nextShowOnlyMy = !showOnlyMyTodos;
        setShowOnlyMyTodos(nextShowOnlyMy);
        dispatch(setSettings({...settings, showOnlyMyTodos: nextShowOnlyMy}));
    };

    async function fetchWithSearch() {
        setLoading(true);
        await axios.get(ApiUrl.getTodosCount(searchStr))
            .then(res => {
                setTodosCount(res.data.count);
            })
            .catch(e => {
                setError(e.message);
            });
        setPage(1);
        axios.get(ApiUrl.getTodos(1, limit, searchStr))
            .then(res => {
                setError('');
                setTodos(res.data);
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
            {loading ?
                <div style={{textAlign: 'center'}}>loading todos <Spinner /></div> :
                error
                    ? <div style={{color: 'red'}}>{error}</div> :
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
                            <ConfigProvider theme={{token: {colorBgElevated: '#2c273d', motionDurationMid: '0'}}}>
                                <Dropdown
                                    menu={{
                                        items: [{
                                            label: <div
                                                style={{display: 'flex', alignItems: 'center'}}
                                                onClick={() => {
                                                    handleChangeShowOnlyMy();
                                                }}
                                            >
                                                <Checkbox checked={showOnlyMyTodos} setChecked={() => {
                                                }} />
                                                <span style={{marginLeft: 10}}>Show only my todos</span>
                                            </div>,
                                            key: 0
                                        },
                                        ]
                                    }}
                                    trigger={['click']}
                                    placement="bottomRight"
                                    overlayClassName="toolbar-menu"
                                >
                                    <FontAwesomeIcon cursor="pointer" fontSize="1.5rem" icon={faEllipsis} />
                                </Dropdown>
                            </ConfigProvider>
                        </div>
                        <div className="container">
                            <div style={{display: 'flex', marginBottom: 20}}>
                                <input type="text" placeholder="Search..." value={searchStr}
                                       onChange={e => setSearchStr(e.target.value)} />
                                <button onClick={fetchWithSearch} style={{marginLeft: 10}}>OK</button>
                            </div>
                        </div>
                        <TodoList
                            todos={settings.showOnlyMyTodos ? todos.filter(t => user.id === getTodoCreator(t).id) : todos}
                        />
                        <div className="container">
                            <ul className="page-btns">{Array(pageButtonsCount).fill(null).map((_, i) =>
                                <li key={i}>
                                    <button className={i + 1 === page ? 'active' : ''}
                                            onClick={() => {
                                                setPage(i + 1);
                                                fetchTodos();
                                            }}>{i + 1}</button>
                                </li>
                            )}</ul>
                        </div>
                    </TodosContext.Provider>
            }
        </div>
    );
};

export default TodosPage;