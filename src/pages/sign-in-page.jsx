import {useState} from 'react';
import {useAppDispatch, useAppSelector} from 'store';
import {logIn} from 'store/userActionCreators';

const SignInPage = () => {
    const dispatch = useAppDispatch();
    const {user, error, loading} = useAppSelector(state => state.user);
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
        e.preventDefault();
        dispatch(logIn(data.login, data.password));
        // window.localStorage.removeItem('jwt-token');
        // setPending(true);
        // let ok = true;
        // fetch(getApiUrl() + '/login', {
        //     method: 'post',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'ngrok-skip-browser-warning': '69420',
        //     },
        //     body: JSON.stringify(data),
        // }).then(res => {
        //     ok = res.ok;
        //     return res.json();
        // }).then(data => {
        //     if (ok) {
        //         // todo setUser
        //         setTokenToLocalStorage(data['jwt-token']);
        //         // setUser(data);
        //         setError('');
        //     } else {
        //         setError(data.message);
        //     }
        // }).catch(e => {
        //     // setUser(null);
        //     setError(e.message);
        // }).finally(() => {
        //     setPending(false);
        // });
    };

    return (
        <form className="login-form" onSubmit={handleSubmit}>
            <label htmlFor="login">Login:</label>
            <input disabled={loading} onChange={handleChange} value={data.login} type="text" id="login" name="login" />
            <label htmlFor="password">Password:</label>
            <input disabled={loading} onChange={handleChange} value={data.password} type="password" name="password"
                   id="password" />
            <button disabled={loading} type="submit">Sign in</button>
            <div className="error" style={{color: 'red'}}>{error}</div>
        </form>
    );
};

export default SignInPage;