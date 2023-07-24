import {useState} from 'react';
import {getApiUrl} from 'config';
import {setTokenToLocalStorage} from 'utils/tokenStorage';

const SignUpPage = () => {
    const [pending, setPending] = useState(false);
    const [error, setError] = useState('');
    const [data, setData] = useState({
        login: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = e => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = e => {
        // e.preventDefault();
        // if (data.password !== data.confirmPassword) {
        //     setError('Passwords do not match');
        //     return;
        // } else {
        //     setError('');
        // }
        // setPending(true);
        // let ok = true;
        // fetch(getApiUrl() + '/register', {
        //     method: 'post',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'ngrok-skip-browser-warning': '69420',
        //     },
        //     body: JSON.stringify({
        //         name: 'dummy name',
        //         login: data.login,
        //         password: data.password
        //     }),
        // }).then(res => {
        //     ok = res.ok;
        //     return res.json();
        // }).then(data => {
        //     if (ok) {
        //         setTokenToLocalStorage(data['jwt-token']);
        //         setUser(data);
        //         setError('');
        //     } else {
        //         setError(data.message);
        //     }
        // }).catch(e => {
        //     setUser(null);
        //     setError(e.message);
        // }).finally(() => {
        //     setPending(false);
        // })
    };

    return (
        <form className="sign-up-form" onSubmit={handleSubmit}>
            <label htmlFor="login">Login:</label>
            <input disabled={pending} onChange={handleChange} value={data.login} type="text" id="login" name="login" />
            <label htmlFor="password">Password:</label>
            <input disabled={pending} onChange={handleChange} value={data.password} type="password" name="password"
                   id="password" />
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input disabled={pending} onChange={handleChange} value={data.confirmPassword} type="password" name="confirmPassword"
                   id="confirmPassword" />
            <button disabled={pending} type="submit">Sign up</button>
            <div className="error" style={{color: 'red'}}>{error}</div>
        </form>
    );
};

export default SignUpPage;