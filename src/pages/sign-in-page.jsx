import {useContext, useState} from 'react';
import {getApiUrl} from 'config';
import {setTokenToLocalStorage} from 'utils/tokenStorage';
import {UserContext} from 'hooks/user';

const SignInPage = () => {
    const {setUser} = useContext(UserContext);
    const [pending, setPending] = useState(false);
    const [error, setError] = useState('');
    const [data, setData] = useState({
        login: '',
        password: ''
    });

    const handleChange = e => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = e => {
        window.localStorage.removeItem('jwt-token');
        e.preventDefault();
        setPending(true);
        let ok = true;
        fetch(getApiUrl() + '/login', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': '69420',
            },
            body: JSON.stringify(data),
        }).then(res => {
            ok = res.ok;
            return res.json();
        }).then(data => {
            if (ok) {
                setTokenToLocalStorage(data['jwt-token']);
                setUser(data);
                setError('');
            } else {
                setError(data.message);
            }
        }).catch(e => {
            setUser(null);
            setError(e.message);
        }).finally(() => {
            setPending(false);
        });
    };

    return (
        <form className="login-form" onSubmit={handleSubmit}>
            <label htmlFor="login">Login:</label>
            <input disabled={pending} onChange={handleChange} value={data.login} type="text" id="login" name="login" />
            <label htmlFor="password">Password:</label>
            <input disabled={pending} onChange={handleChange} value={data.password} type="password" name="password"
                   id="password" />
            <button disabled={pending} type="submit">Sign in</button>
            <div className="error" style={{color: 'red'}}>{error}</div>
        </form>
    );
};

export default SignInPage;