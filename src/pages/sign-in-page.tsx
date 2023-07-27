import {ChangeEvent, FormEvent, useState} from 'react';
import {useAppDispatch, useAppSelector} from 'store';
import {logIn} from 'store/userActionCreators';

const SignInPage = () => {
    const dispatch = useAppDispatch();
    const {error, loading} = useAppSelector(state => state.user);
    const [data, setData] = useState({
        login: '',
        password: ''
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch(logIn(data.login, data.password));
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