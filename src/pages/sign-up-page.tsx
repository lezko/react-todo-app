import {ChangeEvent, FormEvent, useState} from 'react';
import axios from 'axios';
import {useAppDispatch} from 'store';
import {logInError, logInSuccess} from 'store/userSlice';
import {ApiUrl} from 'api-url';
import Spinner from 'components/Spinner';

const SignUpPage = () => {
    const dispatch = useAppDispatch();
    const [pending, setPending] = useState(false);
    const [error, setError] = useState('');
    const [data, setData] = useState({
        login: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (data.password !== data.confirmPassword) {
            setError('Passwords do not match');
            return;
        } else {
            setError('');
        }
        setPending(true);
        axios.post(ApiUrl.register(), JSON.stringify({
            name: 'dummy name',
            login: data.login,
            password: data.password
        }))
            .then(res => {
                dispatch(logInSuccess(res.data));
                setError('');
            })
            .catch(e => {
                if (axios.isAxiosError(e)) {
                    const message = e.response?.data.message;
                    dispatch(logInError(message));
                    setError(message);
                } else {
                    setError(e.message);
                    dispatch(logInError(e.message));
                }
            })
            .finally(() => setPending(false));
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
            <div style={{display: 'flex', alignItems: 'center'}}>
                <button disabled={pending} type="submit">Sign up</button>
                {pending && <Spinner />}
            </div>
            <div className="error" style={{color: 'red'}}>{error}</div>
        </form>
    );
};

export default SignUpPage;