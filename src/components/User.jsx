import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faStar} from '@fortawesome/free-solid-svg-icons';

const User = ({user}) => {
    return (
        <div>
            <div className="user">
                <span className="user__name">{user.login}</span>
                {' '}
                <span className="star">
                        {user.role === 'ROLE_ADMIN' || true && <FontAwesomeIcon icon={faStar} />}
                </span>
            </div>
        </div>
    );
};

export default User;