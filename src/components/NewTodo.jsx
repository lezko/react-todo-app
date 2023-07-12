import {useContext, useState} from 'react';
import {getApiUrl} from 'config';
import {TodosContext} from 'routes/todos';
import {getTokenFromLocalStorage} from 'utils/tokenStorage';

const NewTodo = () => {
    const {todos, setTodos} = useContext(TodosContext);
    const [pending, setPending] = useState(false);
    const [error, setError] = useState('');
    const [data, setData] = useState({
        title: '',
        description: '',
    });
    const handleChange = e => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    };
    const handleSubmit = e => {
        e.preventDefault();
        let ok = true;
        setPending(true);
        fetch(getApiUrl() + '/todos', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'authorization': getTokenFromLocalStorage(),
            },
            body: JSON.stringify(data),
        })
            .then(res => {
                ok = res.ok;
                return res.json();
            })
            .then(data => {
                if (ok) {
                    setTodos([...todos, data]);
                    setData({
                        title: '',
                        description: '',
                    })
                    setError('');
                } else {
                    setError(data.message);
                }
            })
            .catch(e => {
                setError(e.message);
            })
            .finally(() => setPending(false));
    };
    return (
        <div className="new-todo">
            <h3>New Todo:</h3>
            <form onSubmit={handleSubmit}>
                <label htmlFor="title">Title:</label>
                <input value={data.title} onChange={handleChange} disabled={pending} type="text" name="title" id="title" />
                <label htmlFor="description">Description:</label>
                <input value={data.description} onChange={handleChange} disabled={pending} type="text" name="description" id="description" />
                <button disabled={pending} type="submit">Add</button>
                {error && <div className="error" style={{color: 'red'}}>{error}</div>}
            </form>
        </div>
    );
};

export default NewTodo;