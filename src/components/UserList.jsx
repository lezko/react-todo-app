import User from 'components/User';

const UserList = ({users}) => {
    return (
        <ul className="user-list">
            {users.map(u =>
                <li key={u.login}>
                    <User user={u} />
                </li>
            )}
        </ul>
    );
};

export default UserList;