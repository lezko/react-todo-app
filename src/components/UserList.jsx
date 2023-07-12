import User from 'components/User';

const UserList = ({users, setUsers}) => {
    const handleUpdate = user => {
        setUsers(users.map(u => {
            if (u.id === user.id) {
                return user;
            }
            return u;
        }));
    };
    return (
        <ul className="user-list">
            {users.map(u =>
                <li key={u.login}>
                    <User user={u} onUpdate={handleUpdate} />
                </li>
            )}
        </ul>
    );
};

export default UserList;