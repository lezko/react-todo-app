import {SyntheticEvent, useState} from 'react';
import Spinner from 'components/Spinner';
import {getApiUrl} from 'config';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCheck, faEdit, faXmark} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import {useLoggedInUser} from 'hooks/user';
import {useAppDispatch} from 'store';
import {logInSuccess} from 'store/userSlice';
import {ApiUrl} from 'api-url';

const ResetLoginForm = () => {
    const dispatch = useAppDispatch();
    const {user} = useLoggedInUser();
    const [status, setStatus] = useState<'default' | 'edit' | 'pending'>('default');
    const [error, setError] = useState('');
    const [login, setLogin] = useState(user.login);

    const handleSave = () => {
        setError('');
        setStatus('pending');
        axios.put(ApiUrl.resetLogin(user.id), JSON.stringify({login}))
            .then(res => {
                dispatch(logInSuccess({...user, login, ...res.data}));
                setError('');
            })
            .catch(e => {
                if (axios.isAxiosError(e)) {
                    setError(e.response?.data.message);
                    setLogin(user.login);
                }
            })
            .finally(() => setStatus('default'));
    }

    const handleCancel = (e: SyntheticEvent) => {
        e.preventDefault();
        setError('');
        setLogin(user.login);
        setStatus('default');
    }

    const handleStartEdit = (e: SyntheticEvent) => {
        e.preventDefault();
        setStatus('edit');
    }

    return (
        <form className={'reset-login-form ' + (status === 'edit' ? 'edit' : '')}>
            <div className="body">
                <input
                    disabled={status !== 'edit'}
                    value={login}
                    onChange={e => setLogin(e.target.value)}
                    style={{color: user.color}}
                    type="text"
                    name="login"
                    id="login"
                />

                {/*todo maybe allow cancel while pending*/}
                {status === 'default' ? <button onClick={handleStartEdit}><FontAwesomeIcon icon={faEdit} /></button> :
                    status === 'edit' ?
                        <>
                            {user.login !== login && <button onClick={handleSave}><FontAwesomeIcon icon={faCheck} /></button>}
                            <button onClick={handleCancel}><FontAwesomeIcon icon={faXmark} /></button>
                        </>
                        :
                        <div className="spinner-container"><Spinner /></div>

                }
            </div>
            {error && <div className="error" style={{color: 'red'}}>{error}</div>}
        </form>
    );
};

export default ResetLoginForm;