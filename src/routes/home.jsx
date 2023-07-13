import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faStar} from '@fortawesome/free-solid-svg-icons';

const Home = () => {
    return (
        <div className="home">
            <div style={{textAlign: 'center', marginTop: 40}}><i>The app is still under construction and may sometimes be unavailable or behave strangely.</i></div>
            <h1>Welcome to the Todo App!</h1>
            <p style={{marginBottom: 40}}>
                This is the educational fullstack project. Enjoy adding todos to shared list and tracking progress of other users!
                You can ask admins to grant you admin privileges. Admin users are marked with an asterisk <span className="star-with-brackets">({<FontAwesomeIcon className="star" icon={faStar} />}</span>).
            </p>
            <p>
                Admins can:
            </p>
            <ul>
                <li>Give/take admin role to/from other users</li>
                <li>Change other user's nickname colors (as well as their own)</li>
                <li>Ban users for bad behaviour :)</li>
            </ul>
            <p>
                <a href="https://github.com/lezko/react-todo-app">Frontend</a> by <a href="https://github.com/lezko">lezko</a><br/>
                <a href="https://github.com/Sayntrywave/Todos">Backend</a> by <a href="https://github.com/Sayntrywave">Sayntrywave</a>
            </p>
        </div>
    );
};

export default Home;