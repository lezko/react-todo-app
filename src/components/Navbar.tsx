import {useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBars, faCircleUser, faRightFromBracket, faStar, faXmark} from '@fortawesome/free-solid-svg-icons';
import {NavLink, useNavigate} from 'react-router-dom';
import {ConfigProvider, Dropdown} from 'antd';
import {useAppDispatch} from 'store';
import {logOut} from 'store/userSlice';
import {useUser} from 'hooks/user';


const Navbar = () => {
    const dispatch = useAppDispatch();
    const {user} = useUser();
    const navigate = useNavigate();
    const pages = ['home'];
    if (user) {
        pages.push('todos', 'users');
    }

    const logout = () => {
        window.localStorage.removeItem('jwt-token');
        dispatch(logOut());
        setMenuOpened(false);
        navigate('/sign-in');
    };

    const [menuOpened, setMenuOpened] = useState(false);
    const handleNavigate = () => {
        setMenuOpened(false);
    };

    const menuItems = [
        {
            label: <NavLink onClick={handleNavigate}
                            to="/profile">profile</NavLink>,
            key: 0
        },
        {
            label: <NavLink onClick={handleNavigate}
                            to="/settings">settings</NavLink>,
            key: 1
        },
        {
            label: <a href="/logout" className="logout" onClick={e => {
                e.preventDefault();
                logout();
            }}><span>logout</span><FontAwesomeIcon className="icon" icon={faRightFromBracket} /></a>,
            key: 2
        }
    ];
    return (
        <>
            <div
                onClick={() => setMenuOpened(prevState => !prevState)}
                className="menu-toggle"
            >
                {menuOpened ? <FontAwesomeIcon icon={faXmark} /> : <FontAwesomeIcon icon={faBars} />}
            </div>
            <nav className={menuOpened ? 'active' : ''}>
                <a className="home-link" href="/">Todo App</a>
                <ul className="buttons">
                    {pages.map(p =>
                        <li key={p}>
                            <NavLink onClick={handleNavigate} to={p}>{p}</NavLink>
                        </li>
                    )}

                    {user ?
                        <>
                            <hr className="mobile-only" />
                            <li className="user-logout-btn">
                                <ConfigProvider theme={{
                                    token: {
                                        borderRadius: 0,
                                        colorBgBase: 'rgb(102, 21, 95)',
                                        colorText: '7E8098FF',
                                        controlItemBgHover: 'rgb(102, 21, 95)',
                                    }
                                }}>
                                    <Dropdown overlayClassName="nav-dropdown"
                                              menu={{items: menuItems}}
                                              trigger={['click']}>
                                        <a onClick={e => e.preventDefault()}
                                           className="current-user">
                                            <FontAwesomeIcon className="mobile-only profile-icon" icon={faCircleUser} />
                                            <span style={{color: user.color}}>{user.login}</span>
                                            {user.role === 'ROLE_ADMIN' &&
                                                <FontAwesomeIcon style={{color: user.color}} className="star" icon={faStar} />}
                                        </a>
                                    </Dropdown>
                                </ConfigProvider>
                            </li>
                        </>
                        :
                        <>
                            <li>
                                <NavLink onClick={handleNavigate} to="/sign-up">sign up</NavLink>
                            </li>
                            <li>
                                <NavLink onClick={handleNavigate} to="/sign-in">sign in</NavLink>
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