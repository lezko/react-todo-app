import User from 'components/User';
import {useUserContext} from 'hooks/user';

const UserList = ({users, setUsers}) => {
    const {user: loggedUser, setUser} = useUserContext();
    const handleUpdate = user => {
        setUsers(users.map(u => {
            if (u.id === user.id) {
                return user;
            }
            return u;
        }));
        if (user.id === loggedUser.id) {
            setUser(user);
        }
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