import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBan, faCheck, faEyedropper, faStar, faXmark} from '@fortawesome/free-solid-svg-icons';
import {useRef, useState} from 'react';
import {getApiUrl} from 'config';
import {getTokenFromLocalStorage} from 'utils/tokenStorage';
import Toggle from 'components/Toggle';
import useModal from 'antd/es/modal/useModal';
import {getSettingsFromLocalStorage} from 'utils/settingsStorage';
import {useAppSelector} from 'store';

const User = ({user, onUpdate}) => {
    const {user: loggedUser} = useAppSelector(state => state.user);

    const [color, setColor] = useState(user.color);
    const [isAdmin, setIsAdmin] = useState(user.role === 'ROLE_ADMIN');
    const [isBanned, setIsBanned] = useState(user.isInBan);

    const [pending, setPending] = useState(false);
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
                    isInBan: nextIsBanned
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

    const [{confirm}, contextHolder] = useModal();
    const settings = getSettingsFromLocalStorage();

    return (
        <div className="user">
            {contextHolder}
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
                        <Toggle title={isAdmin ? 'unmake admin' : 'make admin'} icon={faStar} iconColor={'gold'} active={isAdmin} setActive={handleIsAdminChange} beforeChange={() => {
                            return new Promise((resolve, reject) => {
                                if (!settings.confirmChangeRole) {
                                    resolve();
                                    return;
                                }
                                confirm({
                                    title: 'Confirmation',
                                    content: user.role === 'ROLE_ADMIN' ?
                                        <p>You are revoking admin privileges from user <i>{user.login}</i></p> :
                                        <p>You are granting admin privileges to user <i>{user.login}</i></p>,
                                    okType: 'default',
                                    onOk: () => {
                                        resolve();
                                    },
                                    onCancel: () => {
                                        reject();
                                    },
                                    closable: true,
                                });
                            });
                        }} />
                        <Toggle title={isBanned ? 'unban' : 'ban'} icon={faBan} iconColor={'red'} active={isBanned} setActive={handleIsBannedChange} beforeChange={() => {
                            return new Promise((resolve, reject) => {
                                if (!settings.confirmChangeBanned) {
                                    resolve();
                                    return;
                                }
                                confirm({
                                    title: 'Confirmation',
                                    content: user.inBan ?
                                        <p>You are unbanning user <i>{user.login}</i></p> :
                                        <p>You are banning user <i>{user.login}</i></p>,
                                    okType: 'default',
                                    onOk: () => {
                                        resolve();
                                    },
                                    onCancel: () => {
                                        reject();
                                    },
                                    closable: true,
                                });
                            });
                        }} />
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