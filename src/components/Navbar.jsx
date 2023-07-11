import {useContext, useState} from 'react';
import {UserContext} from 'App';
import {getApiUrl, setApiUrl} from 'config';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faRightFromBracket} from '@fortawesome/free-solid-svg-icons';
import {faXmark, faBars, faStar} from '@fortawesome/free-solid-svg-icons';

const Navbar = ({onNavigate, activePage, onLogout}) => {
    const {user, setUser} = useContext(UserContext);
    const pages = ['home'];
    if (user) {
        pages.push('todos');
    }
    if (user?.role === 'ROLE_ADMIN') {
        pages.push('users');
    }

    const logout = () => {
        // window.localStorage.removeItem('jwt-token');
        // fetch(apiUrl + '/logout', {
        //     method: 'post',
        //     credentials: 'same-origin',
        //     headers: {
        //         'ngrok-skip-browser-warning': '69420',
        //     }
        // })
        //     .then(res => {
        //         if (res.ok) {
        //             setUser(null);
        //             // fixme: server bug
        //             onNavigate('main');
        //         } else {
        //             console.error('Failed to logout: ' + JSON.stringify(res));
        //         }
        //     })
        //     .catch(e => {
        //         console.error(e);
        //     });
        window.localStorage.removeItem('jwt-token');
        setUser(null);
        setMenuOpened(false);
        onLogout();
    };

    const signUp = () => {
        handleNavigate('signUp');
    };

    const signIn = () => {
        handleNavigate('signIn');
    };

    const [input, setInput] = useState(getApiUrl || '');
    const handleClick = e => {
        e.preventDefault();
        setApiUrl(input);
        setInput(getApiUrl());
    };

    const [menuOpened, setMenuOpened] = useState(false);
    const handleNavigate = path => {
        setMenuOpened(false);
        onNavigate(path);
    }

    return (
        <>
            <div
                onClick={() => setMenuOpened(prevState => !prevState)}
                className="menu-toggle"
            >
                {menuOpened ? <FontAwesomeIcon icon={faXmark} /> : <FontAwesomeIcon icon={faBars} />}
            </div>
            <nav className={menuOpened ? 'active' : ''}>
                {/*<form>*/}
                {/*    <input*/}
                {/*        style={{width: 500}}*/}
                {/*        value={input}*/}
                {/*        onChange={e => setInput(e.target.value)}*/}
                {/*        type="text"*/}
                {/*    />*/}
                {/*    <button onClick={handleClick}>ok</button>*/}
                {/*</form>*/}
                <a className="home-link" href="/">Todo App</a>
                <ul className="buttons">
                    {pages.map(p =>
                        <li key={p}>
                            <button
                                onClick={() => handleNavigate(p)}
                                className={p === activePage ? 'active' : ''}
                            >{p}</button>
                        </li>
                    )}

                    {user ?
                        <li className="user-logout-btn">
                            <span className="current-user">{user.login}</span>
                            {user.role === 'ROLE_ADMIN' && <FontAwesomeIcon className="star" icon={faStar} />}
                            <button className="logout" onClick={logout}><FontAwesomeIcon icon={faRightFromBracket} />
                            </button>
                        </li>
                        :
                        <>
                            <li>
                                <button className={activePage === 'signUp' ? 'active' : ''} onClick={signUp}>sign up
                                </button>
                            </li>
                            <li>
                                <button className={activePage === 'signIn' ? 'active' : ''} onClick={signIn}>sign in
                                </button>
                            </li>
                        </>
                    }
                </ul>
            </nav>
        </>
    );
};

export default Navbar;