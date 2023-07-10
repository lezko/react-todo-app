import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faStar} from '@fortawesome/free-solid-svg-icons';

const HomePage = () => {
    return (
        <div className="home">
            <h1>Welcome to the Todo App!</h1>
            <p>
                This is the educational fullstack project. Enjoy adding todos to shared list and tracking progress of other users!
                You can ask admins to grant you admin privileges if you want to edit todos created by other users. Admin users are marked with as asterisk ({<FontAwesomeIcon icon={faStar} />})
            </p>
            <p>
                <a href="https://github.com/lezko/react-todo-app">Frontend</a> by <a href="https://github.com/lezko">lezko</a><br/>
                <a href="https://github.com/Sayntrywave/Todos">Backend</a> by <a href="https://github.com/Sayntrywave">Sayntrywave</a>
            </p>
        </div>
    );
};

export default HomePage;