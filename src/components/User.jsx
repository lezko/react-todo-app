import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBan, faCheck, faEyedropper, faStar, faXmark} from '@fortawesome/free-solid-svg-icons';
import {useRef, useState} from 'react';
import {useUserContext} from 'hooks/user';
import {getApiUrl} from 'config';
import {getTokenFromLocalStorage} from 'utils/tokenStorage';
import Toggle from 'components/Toggle';

const User = ({user, onUpdate}) => {
    const [color, setColor] = useState(user.color);
    const [isAdmin, setIsAdmin] = useState(user.role === 'ROLE_ADMIN');
    const [isBanned, setIsBanned] = useState(user.inBan);

    const [pending, setPending] = useState(false);
    const {user: loggedUser} = useUserContext();
    const colorInputRef = useRef();

    const resetData = () => {
        setColor(user.color);
        setIsAdmin(user.role === 'ROLE_ADMIN');
        setIsBanned(user.inBan);
    };

    const handleColorChange = e => {
        setColor(e.target.value);
    };

    const handleIsAdminChange = nextIsAdmin => {
        setIsAdmin(nextIsAdmin);
        confirmUpdate({role: nextIsAdmin ? 'ROLE_ADMIN' : 'ROLE_USER'});
    };

    const handleIsBannedChange = nextIsBanned => {
        setIsBanned(nextIsBanned);
        setPending(true);
        fetch(getApiUrl() + '/ban/' + user.id, {
            method: 'put',
            headers: {
                'ngrok-skip-browser-warning': '69420',
                'authorization': getTokenFromLocalStorage()
            },
        }).then(res => {
            if (res.ok) {
                onUpdate({
                    ...user,
                    inBan: nextIsBanned
                });
                return;
            }
            return res.json();
        }).then(err => {
            if (err) {
                console.error(err.error);
                resetData();
            }
        }).catch(e => {
            console.error(e);
            resetData();
        }).finally(() => setPending(false));
    };

    const confirmUpdate = updatedData => {
        setPending(true);
        fetch(getApiUrl() + '/user/' + user.id, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': '69420',
                'authorization': getTokenFromLocalStorage()
            },
            body: JSON.stringify(updatedData)
        }).then(res => {
            if (res.ok) {
                onUpdate({
                    ...user,
                    ...updatedData
                });
                return;
            }
            return res.json();
        }).then(err => {
            if (err) {
                console.error(err.error);
                resetData();
            }
        }).catch(e => {
            console.error(e);
            resetData();
        }).finally(() => setPending(false));
    };

    return (
        <div className="user">
            <span style={{color: user.color}} className="user__name">{user.login}</span>
            {' '}

            {loggedUser.role === 'ROLE_ADMIN' ?
                <>
                    <div
                        className="picker"
                        style={{pointerEvents: pending ? 'none' : 'auto'}}
                        onClick={() => {
                            if (!pending) {
                                colorInputRef.current.click();
                            }
                        }}
                    >
                        <input ref={colorInputRef} value={color} onChange={handleColorChange}
                               type="color" />
                        <FontAwesomeIcon className="brush" icon={faEyedropper} />
                    </div>
                    {color !== user.color && !pending &&
                        <div className="color-buttons">
                            <FontAwesomeIcon className="btn ok" onClick={() => confirmUpdate({color})} icon={faCheck} />
                            <FontAwesomeIcon className="btn cancel" onClick={() => setColor(user.color)}
                                             icon={faXmark} />
                        </div>
                    }

                    <div className="toggles">
                        <Toggle icon={faStar} iconColor={'gold'} active={isAdmin} setActive={handleIsAdminChange} />
                        <Toggle icon={faBan} iconColor={'red'} active={isBanned} setActive={handleIsBannedChange} />
                    </div>
                </>
                :
                <>
                    {user.role === 'ROLE_ADMIN' &&
                        <span style={{color: user.color}} className="star"><FontAwesomeIcon icon={faStar} /></span>}
                    {user.inBan && <FontAwesomeIcon className="ban-icon" icon={faBan} />}
                </>
            }

            {pending && <div className="suspense"></div>}
        </div>
    );
};

export default User;