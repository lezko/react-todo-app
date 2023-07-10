import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faStar} from '@fortawesome/free-solid-svg-icons';

const User = ({user}) => {
    return (
        <div>
            <div className="user">
                <div className="user__name">
                    <span>{user.login}</span>
                    {' '}
                    <span className="star">
                        {user.role === 'ROLE_ADMIN' && <FontAwesomeIcon icon={faStar} />}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default User;