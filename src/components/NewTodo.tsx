import {ChangeEvent, FormEvent, useContext, useState} from 'react';
import {getApiUrl} from 'config';
import {TodosContext, TodosContextType} from 'pages/todos-page';
import axios from 'axios';
import Spinner from 'components/Spinner';

const NewTodo = () => {
    const {todos, setTodos} = useContext(TodosContext) as TodosContextType;
    const [pending, setPending] = useState(false);
    const [error, setError] = useState('');
    const [data, setData] = useState({
        title: '',
        description: '',
    });
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    };
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPending(true);
        axios.post(getApiUrl() + '/todos', JSON.stringify(data))
            .then(res => {
                setTodos([...todos, res.data]);
                setError('');
                setData({title: '', description: ''});
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
    return (
        <div className="new-todo">
            <h3>New Todo:</h3>
            <form onSubmit={handleSubmit}>
                <label htmlFor="title">Title:</label>
                <input value={data.title} onChange={handleChange} disabled={pending} type="text" name="title"
                       id="title" />
                <label htmlFor="description">Description:</label>
                <input value={data.description} onChange={handleChange} disabled={pending} type="text"
                       name="description" id="description" />
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <button disabled={pending} type="submit">Add</button>
                    {pending && <Spinner />}
                </div>
                {error && <div className="error" style={{color: 'red'}}>{error}</div>}
            </form>
        </div>
    );
};

export default NewTodo;