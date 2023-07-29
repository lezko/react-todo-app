import User from 'components/User';
import {IUser} from 'models/IUser';
import {FC} from 'react';
import {useLoggedInUser} from 'hooks/user';
import {useAppDispatch} from 'store';
import {logInSuccess} from 'store/userSlice';

interface UserListProps {
    users: IUser[];
    setUsers: (users: IUser[]) => void;
}

const UserList: FC<UserListProps> = ({users, setUsers}) => {
    const dispatch = useAppDispatch();
    const {user: loggedInUser} = useLoggedInUser();
    const handleUpdate = (user: IUser) => {
        setUsers(users.map(u => {
            if (u.id === user.id) {
                return user;
            }
            return u;
        }));
        if (user.id === loggedInUser.id) {
            dispatch(logInSuccess({...loggedInUser, ...user}));
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