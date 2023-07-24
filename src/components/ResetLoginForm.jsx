import {useState} from 'react';
import Spinner from 'components/Spinner';
import {getApiUrl} from 'config';
import {getTokenFromLocalStorage, setTokenToLocalStorage} from 'utils/tokenStorage';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCheck, faEdit, faXmark} from '@fortawesome/free-solid-svg-icons';
import {useAppSelector} from 'store';

const ResetLoginForm = () => {
    const {user} = useAppSelector(state => state.user);
    const [status, setStatus] = useState('default'); // default, edit, pending
    const [error, setError] = useState('');
    const [login, setLogin] = useState(user.login);

    const handleSave = e => {
        setError('');
        setStatus('pending');
        let ok;
        fetch(getApiUrl() + '/user/' + user.id, {
            method: 'put',
            headers: {
                'content-type': 'application/json',
                'ngrok-skip-browser-warning': '69420',
                'authorization': getTokenFromLocalStorage()
            },
            body: JSON.stringify({login})
        }).then(res => {
            ok = res.ok;
            return res.json();
        }).then(data => {
            if (ok) {
                // todo setUser
                // setUser({...user, login});
                setError('');
                setTokenToLocalStorage(data['jwt-token']);
            } else {
                setError(data.message);
                setLogin(user.login);
            }
        }).catch(e => {
            setError(e.message);
            setLogin(user.login);
        }).finally(() => setStatus('default'));
    }

    const handleCancel = e => {
        e.preventDefault();
        setError('');
        setLogin(user.login);
        setStatus('default');
    }

    const handleStartEdit = e => {
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
                            {user.login !== login && <button disabled={status === 'pending'} onClick={handleSave}><FontAwesomeIcon icon={faCheck} /></button>}
                            <button disabled={status === 'pending'} onClick={handleCancel}><FontAwesomeIcon icon={faXmark} /></button>
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