import {useEffect, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBars, faBell, faCircleUser, faRightFromBracket, faStar, faXmark} from '@fortawesome/free-solid-svg-icons';
import {NavLink, useNavigate} from 'react-router-dom';
import {ConfigProvider, Dropdown, Modal} from 'antd';
import {useAppDispatch} from 'store';
import {logOut} from 'store/userSlice';
import {useUser} from 'hooks/user';
import language from 'language.json';
import {UserRole} from 'models/IUser';
import {UserPrivilege} from 'models/IUserTodoRelation';
import axios from 'axios';
import {ApiUrl} from 'api-url';
import {refresh} from 'store/refreshTodoSlice';
import {setUserList} from 'store/userListSlice';

const Navbar = () => {
    const dispatch = useAppDispatch();
    const {user, loading} = useUser();
    const navigate = useNavigate();
    const pages = ['home'];
    if (user) {
        pages.push('todos', 'users');
    }

    const logout = () => {
        dispatch(logOut());
        dispatch(setUserList([]));
        setMenuOpenWithOverflow(false);
        navigate('/sign-in');
    };

    const [menuOpen, setMenuOpen] = useState(false);
    const setMenuOpenWithOverflow = (nextOpen: boolean) => {
        document.documentElement.style.overflowY = nextOpen ? 'hidden' : 'visible';
        setMenuOpen(nextOpen);
    };

    // todo resize listener & keep overflow in sync with menu open state and doc width
    const handleNavigate = () => {
        setMenuOpenWithOverflow(false);
    };

    // todo language settings
    const l = 'en';
    const lang: { [key: string]: string } = language[l].navbar;

    const menuItems = [
        {
            label: <NavLink onClick={handleNavigate} to="/profile">{lang.profile}</NavLink>,
            key: 0
        },
        {
            label: <NavLink onClick={handleNavigate} to="/settings">{lang.settings}</NavLink>,
            key: 1
        },
        {
            label: <a href="/logout" className="logout" onClick={e => {
                e.preventDefault();
                logout();
            }}><span>{lang.logout}</span><FontAwesomeIcon className="icon" icon={faRightFromBracket} /></a>,
            key: 2
        }
    ];

    const [requests, setRequests] = useState<{ todoId: number, todoTitle: string, userLogin: string, userPrivilege: UserPrivilege }[]>([]);
    useEffect(() => {
        if (!user) {
            return;
        }
        let ignore = false;
        axios.get(ApiUrl.getRequests())
            .then(res => {
                if (!ignore) {
                    setRequests(res.data);
                }
            })
            .catch(e => {
                if (!ignore) {
                    console.error(e);
                }
            });
        return () => {
            ignore = true;
        };
    }, [user]);
    const [requestsModalOpen, setRequestsModalOpen] = useState(false);

    function processRequest(id: number, accept: boolean) {
        axios.post(ApiUrl.processRequest(id, accept), {accept})
            .then(() => {
                setRequests(prevState => prevState.filter(r => r.todoId !== id));
                dispatch(refresh());
                if (requests.length === 1) {
                    setRequestsModalOpen(false);
                }
            })
            .catch((e: any) => {
                console.error(e);
            });
    }

    return (
        <>
            <div
                onClick={() => setMenuOpenWithOverflow(!menuOpen)}
                className="menu-toggle"
            >
                {menuOpen ? <FontAwesomeIcon icon={faXmark} /> : <FontAwesomeIcon icon={faBars} />}
            </div>
            <nav className={menuOpen ? 'active' : ''}>
                <a className="home-link" href="/">Todo App</a>
                <ul className="buttons">
                    {pages.map(p =>
                        <li key={p}>
                            <NavLink onClick={handleNavigate} to={p}>{lang[p]}</NavLink>
                        </li>
                    )}

                    {user ?
                        <>
                            <hr className="mobile-only" />
                            <li className="user-logout-btn">
                                <div style={{display: 'flex', alignItems: 'center'}}>
                                    <ConfigProvider theme={{
                                        token: {
                                            colorBgElevated: 'rgb(102, 21, 95)',
                                            borderRadius: 0,
                                            colorBgBase: 'rgb(102, 21, 95)',
                                            colorText: '7E8098FF',
                                            controlItemBgHover: 'rgb(102, 21, 95)',
                                        }
                                    }}>
                                        <Dropdown
                                            overlayClassName="nav-dropdown"
                                            menu={{items: menuItems}}
                                            trigger={['click']}
                                            onOpenChange={setMenuOpenWithOverflow}
                                            // todo very strange bug - without line below dropdown appears off screen on the top when page scrolled to bottom
                                            placement="top"
                                        >
                                            <a onClick={e => e.preventDefault()}
                                               className="current-user">
                                                <FontAwesomeIcon className="mobile-only profile-icon"
                                                                 icon={faCircleUser} />
                                                <span>{user.login}</span>
                                                {user.role === UserRole.Admin &&
                                                    <FontAwesomeIcon style={{color: user.color}} className="star"
                                                                     icon={faStar} />}
                                            </a>
                                        </Dropdown>
                                    </ConfigProvider>
                                    <>
                                        <Modal
                                            className="requests-modal"
                                            open={requestsModalOpen}
                                            closable
                                            onCancel={() => setRequestsModalOpen(false)}
                                            footer={[]}
                                        >
                                            <h3>Incoming requests</h3>
                                            <ul>{requests.map(r =>
                                                <li className="request" key={r.todoId}>
                                                    <div className="info">
                                                        <span className="request__author">{r.userLogin} </span>
                                                        invited you to become a/an
                                                        <span className="request__privilege"> {r.userPrivilege.toLowerCase()} </span>{' '}
                                                        of a todo
                                                        <span className="request__title"> {r.todoTitle}</span>
                                                    </div>
                                                    <div className="request__buttons">
                                                        <button onClick={() => processRequest(r.todoId, true)}>Accept</button>
                                                        <button className="danger" onClick={() => processRequest(r.todoId, false)}>Decline</button>
                                                    </div>
                                                </li>
                                            )}</ul>
                                        </Modal>
                                        {requests.length > 0 &&
                                            <div onClick={() => {
                                                setRequestsModalOpen(true);
                                                setMenuOpen(false);
                                            }} className="bell"
                                                 role="button">
                                                <FontAwesomeIcon className="icon" icon={faBell} />
                                                <span className="count">{requests.length}</span>
                                            </div>
                                        }
                                    </>
                                </div>
                            </li>
                        </>
                        :
                        <>
                            <li>
                                <NavLink onClick={handleNavigate} to="/sign-up">{lang.signUp}</NavLink>
                            </li>
                            <li>
                                <NavLink onClick={handleNavigate} to="/sign-in">{lang.signIn}</NavLink>
                            </li>
                        </>
                    }
                    {user &&
                        <ul className="mobile-only">{menuItems.map(item =>
                            <li key={item.key}>{item.label}</li>
                        )}</ul>
                    }
                </ul>
            </nav>
        </>
    );
};

export default Navbar;