import {ChangeEvent, SyntheticEvent, useState} from 'react';
import Spinner from 'components/Spinner';
import {getApiUrl} from 'config';
import {useLoggedInUser} from 'hooks/user';
import axios from 'axios';
import {ApiUrl} from 'api-url';

const initialData = {
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: ''
};

const ResetPasswordForm = () => {
    const {user} = useLoggedInUser();

    const [status, setStatus] = useState<'default' | 'typingOldPassword' | 'typingNewPassword'>('default');
    const [pending, setPending] = useState(false);
    const [error, setError] = useState('');
    const [data, setData] = useState(initialData);
    const [notification, setNotification] = useState('');

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    };

    const handleStartClick = (e: SyntheticEvent) => {
        e.preventDefault();
        setStatus('typingOldPassword');
    };

    const handleConfirmOldPassword = (e: SyntheticEvent) => {
        setError('');
        e.preventDefault();
        setPending(true);
        axios.post(ApiUrl.login(), JSON.stringify({login: user.login, password: data.oldPassword}))
            .then(() => {
                // todo maybe save new token
                setError('');
                setStatus('typingNewPassword');
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

    const handleConfirmNewPassword = (e: SyntheticEvent) => {
        e.preventDefault();
        if (data.newPassword.length < 3) {
            setError('Password is too short');
            return;
        } else if (data.newPassword.length > 30) {
            setError('Password is too long');
            return;
        }
        if (data.newPassword !== data.confirmNewPassword) {
            setError('Passwords do not match');
            return;
        } else {
            setError('');
        }

        setPending(true);
        axios.put(ApiUrl.resetPassword(user.id), JSON.stringify({password: data.newPassword}))
            .then(() => {
                setError('');
                setStatus('default');
                setData(initialData);
                // todo modal window notification
                setNotification('Password updated!');
                setTimeout(() => setNotification(''), 3000);
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

    const handleCancel = (e: SyntheticEvent) => {
        e.preventDefault();
        setStatus('default');
        setError('');
        setData(initialData);
    };

    return (
        <form className="reset-password-form">
            {status === 'default' ? <button className="reset-btn" onClick={handleStartClick}>Reset Password</button> :
                <>
                    {status === 'typingOldPassword' ?
                        <>
                            <label htmlFor="oldPassword">Your old password: </label>
                            <input autoFocus value={data.oldPassword} onChange={handleChange} type="password"
                                   name="oldPassword"
                                   id="oldPassword" />
                            <button disabled={pending} onClick={handleConfirmOldPassword}>Continue</button>
                        </>
                        :
                        <>
                            <label htmlFor="newPassword">Enter new password: </label>
                            <input autoFocus value={data.newPassword} onChange={handleChange} type="password"
                                   name="newPassword"
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