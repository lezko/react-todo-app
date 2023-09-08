import TodoList from 'components/TodoList';
import {createContext, useEffect, useState} from 'react';
import NewTodoForm, {NewTodoData} from 'components/NewTodoForm';
import axios from 'axios';
import {ITodo} from 'models/ITodo';
import Spinner from 'components/Spinner';
import {ApiUrl} from 'api-url';
import {Button, ConfigProvider, Dropdown, Modal} from 'antd';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlus, faEllipsis} from '@fortawesome/free-solid-svg-icons';
import {useSettings} from 'hooks/settings';
import {useLoggedInUser} from 'hooks/user';
import {setSettings} from 'store/settingsSlice';
import {useAppDispatch} from 'store';
import Toggle from 'components/Toggle';
import Checkbox from 'components/Checkbox';

export type TodosContextType = { todos: ITodo[], setTodos: (todos: ITodo[]) => void };
export const TodosContext = createContext<TodosContextType | null>(null);

const TodosPage = () => {
    const [todos, setTodos] = useState<ITodo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    useEffect(() => {
        let ignore = false;
        axios.get(ApiUrl.getTodos())
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
                setTodos([...todos, res.data]);
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

    const settings = useSettings();
    const user = useLoggedInUser();

    const dispatch = useAppDispatch();
    const [showOnlyMyTodos, setShowOnlyMyTodos] = useState(settings.showOnlyMyTodos);
    const handleChangeShowOnlyMy = () => {
        const nextShowOnlyMy = !showOnlyMyTodos;
        setShowOnlyMyTodos(nextShowOnlyMy);
        dispatch(setSettings({...settings, showOnlyMyTodos: nextShowOnlyMy}));
    }

    return (
        <div className="main">
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
                                                onClick={e => {
                                                    handleChangeShowOnlyMy();
                                                }}
                                            >
                                                <Checkbox checked={showOnlyMyTodos} setChecked={() => {}} />
                                                <span style={{marginLeft: 10}}>Show only my todos</span>
                                            </div>,
                                            key: 0
                                        },
                                        ]}}
                                    trigger={['click']}
                                    placement="bottomRight"
                                    overlayClassName="toolbar-menu"
                                >
                                    <FontAwesomeIcon cursor="pointer" fontSize="1.5rem" icon={faEllipsis} />
                                </Dropdown>
                            </ConfigProvider>
                        </div>
                        <TodoList
                            todos={settings.showOnlyMyTodos ? todos.filter(t => user.user.id === t.creator.id) : todos}
                        />
                    </TodosContext.Provider>
            }
        </div>
    );
};

export default TodosPage;