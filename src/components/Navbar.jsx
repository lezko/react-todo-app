import {useState} from 'react';
import {getApiUrl, setApiUrl} from 'config';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBars, faRightFromBracket, faStar, faXmark} from '@fortawesome/free-solid-svg-icons';
import {useUserContext} from 'hooks/user';
import {NavLink, useNavigate} from 'react-router-dom';

const Navbar = () => {
    const {user, setUser} = useUserContext();
    const navigate = useNavigate();
    const pages = ['home'];
    if (user) {
        pages.push('todos', 'users');
    }

    const logout = () => {
        window.localStorage.removeItem('jwt-token');
        setUser(null);
        setMenuOpened(false);
        navigate('/sign-in');
    };

    // debug only
    const [input, setInput] = useState(getApiUrl || '');
    const handleClick = e => {
        e.preventDefault();
        setApiUrl(input);
        setInput(getApiUrl());
    };

    const [menuOpened, setMenuOpened] = useState(false);
    const handleNavigate = path => {
        setMenuOpened(false);
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
                            <NavLink onClick={handleNavigate} to={p}>{p}</NavLink>
                        </li>
                    )}

                    {user ?
                        <li style={{color: user.color}} className="user-logout-btn">
                            <NavLink onClick={handleNavigate} to="/profile" className="current-user">{user.login}</NavLink>
                            {user.role === 'ROLE_ADMIN' && <FontAwesomeIcon className="star" icon={faStar} />}
                            <a href="/logout" className="logout" onClick={e => {
                                e.preventDefault();
                                logout();
                            }}>
                                <FontAwesomeIcon icon={faRightFromBracket} />
                            </a>
                        </li>
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
                </ul>
            </nav>
        </>
    );
};

export default Navbar;