import {ChangeEvent, FormEvent, useContext, useState} from 'react';
import {TodosContext, TodosContextType} from 'pages/todos-page';
import axios from 'axios';
import Spinner from 'components/Spinner';
import {ApiUrl} from 'api-url';
import Toggle from 'components/Toggle';

interface NewTodoProps {

}

const NewTodo = () => {
    const {todos, setTodos} = useContext(TodosContext) as TodosContextType;
    const [pending, setPending] = useState(false);
    const [error, setError] = useState('');
    const [data, setData] = useState({
        title: '',
        description: '',
    });
    const handleChange = (e: any) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    };
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPending(true);
        axios.post(ApiUrl.createTodo(), JSON.stringify(data))
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

    const [hasDesc, setHasDesc] = useState(false);

    return (
        <div className="new-todo">
            <form onSubmit={handleSubmit}>
                <label htmlFor="title">Title:</label>
                <input
                    value={data.title}
                    onChange={handleChange}
                    disabled={pending}
                    type="text"
                    name="title"
                    id="title"
                />

                <div className="desc-toggle">
                    <span>Description</span>
                    <Toggle
                        title={hasDesc ? 'remove description' : 'add description'}
                        active={hasDesc}
                        setActive={setHasDesc}
                    />
                </div>
                {hasDesc && <textarea name="description" rows={5}  onChange={handleChange} />}
                {/*<label htmlFor="description">Description:</label>*/}
                {/*<input*/}
                {/*    value={data.description}*/}
                {/*    onChange={handleChange}*/}
                {/*    disabled={pending}*/}
                {/*    type="text"*/}
                {/*    name="description"*/}
                {/*    id="description"*/}
                {/*/>*/}
                <div style={{display: 'flex', alignItems: 'center'}}>
                    {/*<button disabled={pending} type="submit">Add</button>*/}
                    {pending && <Spinner />}
                </div>
                {error && <div className="error" style={{color: 'red'}}>{error}</div>}
            </form>
        </div>
    );
};

export default NewTodo;