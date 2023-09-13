import {createRef, FC, RefObject, useCallback, useContext, useState} from 'react';
import {TodosContext, TodosContextType} from 'pages/todos-page';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCheck, faEdit, faTrash, faUserPlus, faXmark, faStar} from '@fortawesome/free-solid-svg-icons';
import useModal from 'antd/es/modal/useModal';
import Toggle from 'components/Toggle';
import Checkbox from 'components/Checkbox';
import Spinner from 'components/Spinner';
import {ITodo} from 'models/ITodo';
import axios from 'axios';
import {useSettings} from 'hooks/settings';
import {ApiUrl} from 'api-url';
import {useLoggedInUser} from 'hooks/user';
import {UserPrivilege} from 'models/IUserTodoRelation';
import {AutoComplete, ConfigProvider, Modal} from 'antd';
import {useUserList} from 'hooks/userList';
import {UserRole} from 'models/IUser';

interface TodoProps {
    todo: ITodo;
}

const Todo: FC<TodoProps> = ({todo}) => {
    const {user} = useLoggedInUser();

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
    const settings = useSettings();

    const deleteTodo = () => {
        setPending(true);
        axios.delete(ApiUrl.deleteTodo(todo.id))
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
        if (typeof updatedData.title === 'string' && updatedData.title.length === 0) {
            setError('Title must not be empty');
            return;
        }
        if (typeof updatedData.description === 'string' && updatedData.description.length === 0) {
            setError('Description must not be empty');
            return;
        }

        setError('');
        setPending(true);
        axios.put(ApiUrl.updateTodo(todo.id), JSON.stringify(updatedData))
            .then(() => {
                setError('');
                updateCurrentTodo(updatedData);
                setEditData({...editData, ...updatedData});
                setStatus('default');
            })
            .catch(e => {
                if (axios.isAxiosError(e)) {
                    setError(e.response?.data.message);
                } else {
                    setError(e.message);
                }
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

    let creator, userPrivilege = UserPrivilege.Reader, relationFound = false;
    for (const r of todo.users) {
        // if (r.privilege === Privilege.Creator) {
        //     creator = r.user;
        // }
        if (r.user.id === user.id) {
            userPrivilege = r.privilege;
            relationFound = true;
            break;
        }
    }
    // if (!creator) {
    //     throw new Error('Got todo without creator');
    // }
    if (!relationFound) {
        throw new Error(`Current user (id: ${user.id}) is not related to todo with id ${todo.id}`);
    }

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
                    <Toggle
                        title={hasDesc ? 'remove description' : 'add description'}
                        active={hasDesc}
                        setActive={setHasDesc}
                    />
                </div>
                {hasDesc &&
                    <textarea rows={5} value={editData.description} onChange={handleChange} name="description" />}
            </form>
        );
    };

    const userList = useUserList();
    const [addUserModalOpen, setAddUserModalOpen] = useState(false);
    const [userSearchOptions, setUserSearchOptions] = useState<{ value: string }[]>([]);
    const [userSearchStr, setUserSearchStr] = useState('');
    const [privilege, setPrivilege] = useState<UserPrivilege.Owner | UserPrivilege.Moderator | UserPrivilege.Reader>(UserPrivilege.Reader);
    const [addUserError, setAddUserError] = useState('');

    function closeAddUserModal() {
        setUserSearchStr('');
        setAddUserError('');
        setPrivilege(UserPrivilege.Reader);
        setUserSearchOptions([]);
        setAddUserModalOpen(false);
    }

    function handleAddUser() {
        if (!userList.users.includes(userSearchStr)) {
            setAddUserError('Invalid user name');
            return;
        }
        setAddUserError('');
        axios.put(ApiUrl.sendTodoRequest(todo.id), {
            login: userSearchStr,
            privilege
        }).then(() => {
            closeAddUserModal();
        }).catch((e: any) => {
            if (axios.isAxiosError(e)) {
                setError(e.response?.data.message);
            } else {
                setError(e.message);
            }
        });
    }

    function getMatchingUsers(users: string[], q: string) {
        if (!q) {
            return [];
        }
        return users.filter(u => u.toLowerCase().includes(q.toLowerCase()));
    }

    const privilegesOptions: UserPrivilege[] = [UserPrivilege.Reader, UserPrivilege.Moderator];
    if (userPrivilege === UserPrivilege.Creator) {
        privilegesOptions.push(UserPrivilege.Owner);
    }

    const getButtonsHtml = () => {
        if (status === 'default') {
            if (userPrivilege === UserPrivilege.Creator || userPrivilege === UserPrivilege.Owner || userPrivilege === UserPrivilege.Moderator) {
                return (
                    <div className="todo__buttons">
                        {userPrivilege !== UserPrivilege.Moderator &&
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
                        }
                        {(!editData.isCompleted || settings.allowEditingCompleted) &&
                            <button disabled={pending} onClick={startUpdate}><FontAwesomeIcon icon={faEdit} /></button>}
                        <Modal
                            open={addUserModalOpen}
                            closable
                            onCancel={closeAddUserModal}
                            okButtonProps={{type: 'default'}}
                            onOk={handleAddUser}
                        >
                            <>
                                <h3 style={{marginBottom: 5, fontSize: '1.3rem'}}>Add user:</h3>
                                {/* optionActiveBg*/}
                                <ConfigProvider theme={{
                                    components: {
                                        Select: {
                                            controlItemBgHover: 'rgb(37 39 60)'
                                        }
                                    }
                                }}>
                                    <AutoComplete

                                        value={userSearchStr}
                                        onChange={data => setUserSearchStr(data)}
                                        options={userSearchOptions}
                                        onSearch={text => setUserSearchOptions(getMatchingUsers(userList.users, text).map(s => ({value: s})))}
                                        onSelect={text => setUserSearchOptions(getMatchingUsers(userList.users, text).map(s => ({value: s})))}
                                        style={{width: '100%'}}
                                    />
                                </ConfigProvider>
                                <select style={{marginTop: 10}} value={privilege} onChange={e => {
                                    const v = e.target.value;
                                    const nextPrivilege = v === 'OWNER' ? UserPrivilege.Owner : v === 'MODERATOR' ? UserPrivilege.Moderator : UserPrivilege.Reader;
                                    setPrivilege(nextPrivilege);
                                }}>
                                    {privilegesOptions.map(o =>
                                        <option key={o} value={o}>{o}</option>
                                    )}
                                </select>
                                <div style={{marginBlock: 5, color: 'red'}} className="error">{addUserError}</div>
                            </>
                        </Modal>
                        {userPrivilege !== UserPrivilege.Moderator &&
                            <button onClick={() => setAddUserModalOpen(true)}><FontAwesomeIcon icon={faUserPlus} />
                            </button>
                        }
                    </div>
                );
            }
            return null;
        }

        let changedData = {};
        if (todo.title !== editData.title) {
            changedData = {...changedData, title: editData.title};
        }
        const newDescription = hasDesc ? editData.description : '';
        if (todo.description !== newDescription) {
            changedData = {...changedData, description: newDescription};
        }

        return (
            <div className="todo__buttons">
                <button disabled={pending} onClick={cancelUpdate}><FontAwesomeIcon icon={faXmark} /></button>
                {Object.keys(changedData).length > 0 &&
                    <button disabled={pending} onClick={() => {
                        confirmUpdate(changedData);
                    }}><FontAwesomeIcon icon={faCheck} /></button>
                }
            </div>
        );
    };

    const handleChangeCompleted = useCallback((nextCompleted: boolean) => {
        confirmUpdate({isCompleted: nextCompleted});
    }, []);

    const privilegeSortOrder = {
        [UserPrivilege.Creator]: 0,
        [UserPrivilege.Owner]: 1,
        [UserPrivilege.Moderator]: 2,
        [UserPrivilege.Reader]: 3,
    };

    return (
        <div className={'todo ' + (status === 'edit' ? 'edit' : '')}>
            {contextHolder}
            {pending && <Spinner className="pending-spinner" />}

            {status === 'default' &&
                <Checkbox
                    disabled={userPrivilege === UserPrivilege.Moderator || userPrivilege === UserPrivilege.Reader}
                    title={editData.isCompleted ? 'unmark completed' : 'mark completed'}
                    className="todo__checkbox"
                    checked={editData.isCompleted}
                    setChecked={handleChangeCompleted}
                />
            }
            {getTodoInfoHtml()}
            <ul className="todo__collaborators">
                {todo.users.sort((a, b) => privilegeSortOrder[a.privilege] - privilegeSortOrder[b.privilege]).map(u =>
                    <li title={u.privilege.toLowerCase()} className={'collaborator ' + u.privilege.toLowerCase()}
                        key={u.user.id}>
                        {u.user.login} {u.user.role === UserRole.Admin && <FontAwesomeIcon icon={faStar} />}
                    </li>
                )}
            </ul>

            {getButtonsHtml()}
            {error && <div style={{color: 'red'}}>{error}</div>}
        </div>
    );
};

export default Todo;