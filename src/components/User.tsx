import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBan, faCheck, faEyedropper, faStar, faXmark} from '@fortawesome/free-solid-svg-icons';
import {ChangeEvent, createRef, FC, useState} from 'react';
import {getApiUrl} from 'config';
import Toggle from 'components/Toggle';
import useModal from 'antd/es/modal/useModal';
import {IUser, UserRole} from 'models/IUser';
import axios from 'axios';
import {useLoggedInUser} from 'hooks/user';
import {useSettings} from 'hooks/settings';

interface UserProps {
    user: IUser;
    onUpdate: (user: IUser) => void;
}

const User: FC<UserProps> = ({user, onUpdate}) => {
    const {user: loggedUser} = useLoggedInUser();

    const [color, setColor] = useState(user.color);
    const [isAdmin, setIsAdmin] = useState(user.role === 'ROLE_ADMIN');
    const [isBanned, setIsBanned] = useState(user.isInBan);

    const [pending, setPending] = useState(false);
    const colorInputRef = createRef<HTMLInputElement>();

    const resetData = () => {
        setColor(user.color);
        setIsAdmin(user.role === UserRole.Admin);
        setIsBanned(user.isInBan);
    };

    const handleColorChange = (e: ChangeEvent<HTMLInputElement>) => {
        setColor(e.target.value);
    };

    const handleIsAdminChange = (nextIsAdmin: boolean) => {
        setIsAdmin(nextIsAdmin);
        confirmUpdate({role: nextIsAdmin ? UserRole.Admin : UserRole.User});
    };

    const handleIsBannedChange = (nextIsBanned: boolean) => {
        setIsBanned(nextIsBanned);
        // todo make server handle ban requests as regular update
        axios.put(getApiUrl() + '/ban/' + user.id)
            .then(() => {
                onUpdate({...user, isInBan: nextIsBanned});
            })
            .catch(e => {
                resetData();
                // todo show error in modal
                if (axios.isAxiosError(e)) {
                    console.error(e.response?.data.message);
                } else {
                    console.error(e.message);
                }
            })
            .finally(() => setPending(false));
    };

    const confirmUpdate = (updatedData: any) => {
        setPending(true);
        axios.put(getApiUrl() + '/user/' + user.id, JSON.stringify(updatedData))
            .then(() => {
                onUpdate({
                    ...user,
                    ...updatedData
                });
            })
            .catch(e => {
                // todo display error
                console.error(e);
                resetData();
            })
            .finally(() => setPending(false));
    };

    const [{confirm}, contextHolder] = useModal();
    const settings = useSettings();

    return (
        <div className="user">
            {contextHolder}
            <span style={{color: user.color}} className="user__name">{user.login}</span>
            {' '}

            {/*todo logged-in-interface + hook*/}
            {loggedUser && loggedUser.role === 'ROLE_ADMIN' ?
                <>
                    <div
                        className="picker"
                        style={{pointerEvents: pending ? 'none' : 'auto'}}
                        onClick={() => {
                            if (!pending) {
                                // todo get rid of '!'
                                colorInputRef.current!.click();
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
                        <Toggle title={isAdmin ? 'unmake admin' : 'make admin'} icon={faStar} iconColor={'gold'}
                                active={isAdmin} setActive={handleIsAdminChange} beforeChange={() => {
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
                        <Toggle title={isBanned ? 'unban' : 'ban'} icon={faBan} iconColor={'red'} active={isBanned}
                                setActive={handleIsBannedChange} beforeChange={() => {
                            return new Promise((resolve, reject) => {
                                if (!settings.confirmChangeBanned) {
                                    resolve();
                                    return;
                                }
                                confirm({
                                    title: 'Confirmation',
                                    content: user.isInBan ?
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
                    {user.isInBan && <FontAwesomeIcon className="ban-icon" icon={faBan} />}
                </>
            }

            {pending && <div className="suspense"></div>}
        </div>
    );
};

export default User;