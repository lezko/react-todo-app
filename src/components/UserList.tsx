import User from 'components/User';
import {useAppSelector} from 'store';
import {IUser} from 'models/IUser';
import {FC} from 'react';

interface UserListProps {
    users: IUser[];
    setUsers: (users: IUser[]) => void;
}

const UserList: FC<UserListProps> = ({users, setUsers}) => {
    const {user: loggedUser} = useAppSelector(state => state.user);
    const handleUpdate = (user: IUser) => {
        setUsers(users.map(u => {
            if (u.id === user.id) {
                return user;
            }
            return u;
        }));
        if (loggedUser && user.id === loggedUser.id) {
            // setUser(user);
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