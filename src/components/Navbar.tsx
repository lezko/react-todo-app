import {useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBars, faCircleUser, faRightFromBracket, faStar, faXmark} from '@fortawesome/free-solid-svg-icons';
import {NavLink, useNavigate} from 'react-router-dom';
import {ConfigProvider, Dropdown} from 'antd';
import {useAppDispatch} from 'store';
import {logOut} from 'store/userSlice';
import {useUser} from 'hooks/user';
import language from 'language.json';

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
        setMenuOpen(false);
        navigate('/sign-in');
    };

    const [menuOpen, setMenuOpen] = useState(false);
    const setMenuOpenWithOverflow = (nextOpen: boolean) => {
        document.documentElement.style.overflowY = nextOpen ? 'hidden' : 'visible';
        setMenuOpen(nextOpen);
    }

    // todo resize listener & keep overflow in sync with menu open state and doc width
    const handleNavigate = () => {
        setMenuOpenWithOverflow(false);
    };

    // todo language settings
    const l = 'en';
    const lang: {[key: string]: string} = language[l].navbar;

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
                                <ConfigProvider theme={{
                                    token: {
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
                                    >
                                        <a onClick={e => e.preventDefault()}
                                           className="current-user">
                                            <FontAwesomeIcon className="mobile-only profile-icon" icon={faCircleUser} />
                                            <span style={{color: user.color}}>{user.login}</span>
                                            {user.role === 'ROLE_ADMIN' &&
                                                <FontAwesomeIcon style={{color: user.color}} className="star"
                                                                 icon={faStar} />}
                                        </a>
                                    </Dropdown>
                                </ConfigProvider>
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