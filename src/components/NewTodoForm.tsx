import {FC} from 'react';
import Toggle from 'components/Toggle';

export interface NewTodoData {
    title: string;
    description: string;
}

interface NewTodoProps {
    data: NewTodoData;
    setData: (data: NewTodoData) => void;
    hasDescription: boolean;
    setHasDescription: (hasDescription: boolean) => void;
    disabled: boolean;
    error: string;
}

const NewTodoForm: FC<NewTodoProps> = ({data, setData, hasDescription, setHasDescription, disabled, error}) => {
    const handleChange = (e: any) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="new-todo">
            <form onSubmit={e => e.preventDefault()}>
                <label htmlFor="title">Title:</label>
                <input
                    value={data.title}
                    onChange={handleChange}
                    disabled={disabled}
                    type="text"
                    name="title"
                    id="title"
                />

                <div className="desc-toggle">
                    <span>Description</span>
                    <Toggle
                        title={hasDescription ? 'remove description' : 'add description'}
                        active={hasDescription}
                        setActive={setHasDescription}
                    />
                </div>
                {hasDescription &&
                    <textarea name="description" rows={5} value={data.description} onChange={handleChange} />}
                {error && <div className="error" style={{color: 'red', marginTop: 10}}>{error}</div>}
            </form>
        </div>
    );
};

export default NewTodoForm;