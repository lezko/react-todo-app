import {useState} from 'react';
import Spinner from 'components/Spinner';
import {getApiUrl} from 'config';
import {useUserContext} from 'hooks/user';
import {getTokenFromLocalStorage, setTokenToLocalStorage} from 'utils/tokenStorage';

const initialData = {
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: ''
};

const ResetPasswordForm = () => {
    const {user, setUser} = useUserContext();
    const [status, setStatus] = useState('default'); // default, typingOldPassword, typingNewPassword
    const [pending, setPending] = useState(false);
    const [error, setError] = useState('');
    const [data, setData] = useState(initialData);
    const [notification, setNotification] = useState('');

    const handleChange = e => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    };

    const handleStartClick = e => {
        e.preventDefault();
        setStatus('typingOldPassword');
    };

    const handleConfirmOldPassword = e => {
        setError('');
        e.preventDefault();
        setPending(true);
        let ok;
        fetch(getApiUrl() + '/login', {
            method: 'post',
            headers: {
                'content-type': 'application/json',
                'ngrok-skip-browser-warning': '69420',
            },
            body: JSON.stringify({login: user.login, password: data.oldPassword})
        }).then(res => {
            ok = res.ok;
            return res.json();
        }).then(data => {
            if (ok) {
                setError('');
                setStatus('typingNewPassword');
                setTokenToLocalStorage(data['jwt-token']);
            } else {
                setError(data.message);
            }
        }).catch(e => {
            setError(e.message);
        }).finally(() => setPending(false));
    };

    const handleConfirmNewPassword = e => {
        e.preventDefault();
        if (data.newPassword !== data.confirmNewPassword) {
            setError('Passwords do not match');
            return;
        } else {
            setError('');
        }

        setPending(true);
        fetch(getApiUrl() + '/user/' + user.id, {
            method: 'put',
            headers: {
                'content-type': 'application/json',
                'ngrok-skip-browser-warning': '69420',
                'authorization': getTokenFromLocalStorage()
            },
            body: JSON.stringify({password: data.newPassword})
        }).then(res => {
            if (res.ok) {
                setError('');
                setStatus('default');
                setData(initialData);
                // todo show notification
                setNotification('Password updated!');
                setTimeout(() => setNotification(''), 3000);
                return;
            }
            return res.json();
        }).then(data => {
            if (data) {
                setError(data.message);
            }
        }).finally(() => setPending(false));
    }

    const handleCancel = e => {
        e.preventDefault();
        setStatus('default');
        setError('');
        setData(initialData);
    }

    return (
        <form className="reset-password-form">
            {status === 'default' ? <button className="reset-btn" onClick={handleStartClick}>Reset Password</button> :
                <>
                    {status === 'typingOldPassword' ?
                        <>
                            <label htmlFor="oldPassword">Your old password: </label>
                            <input autoFocus value={data.oldPassword} onChange={handleChange} type="password" name="oldPassword"
                                   id="oldPassword" />
                            <button disabled={pending} onClick={handleConfirmOldPassword}>Continue</button>
                        </>
                        :
                        <>
                            <label htmlFor="newPassword">Enter new password: </label>
                            <input autoFocus value={data.newPassword} onChange={handleChange} type="password" name="newPassword"
                                   id="newPassword" />
                            <label htmlFor="confirmNewPassword">Confirm new password: </label>
                            <input value={data.confirmNewPassword} onChange={handleChange} type="password"
                                   name="confirmNewPassword" id="confirmNewPassword" />
                            <button onClick={handleConfirmNewPassword}>Save</button>
                        </>}
                    {/*todo allow cancel while pending -> request cleanup*/}
                    <button disabled={pending} onClick={handleCancel}>Cancel</button>
                    {pending && <Spinner />}
                </>
            }
            {error && <div className="error" style={{color: 'red'}}>{error}</div>}
            {notification && <div className="notification">{notification}</div>}
        </form>
    );
};

export default ResetPasswordForm;