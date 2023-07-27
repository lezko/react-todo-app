import UserList from 'components/UserList';
import {useEffect, useState} from 'react';
import {IUser} from 'models/IUser';
import axios from 'axios';
import Spinner from 'components/Spinner';
import {ApiUrl} from 'api-url';

const UsersPage = () => {
    const [users, setUsers] = useState<IUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    useEffect(() => {
        let ignore = false;
        axios.get(ApiUrl.getUsers())
            .then(res => {
                if (!ignore) {
                    setUsers(res.data);
                    setError('');
                }
            })
            .catch(e => {
                if (!ignore) {
                    if (axios.isAxiosError(e)) {
                        setUsers([]);
                        setError(e.response?.data.message);
                    } else {
                        setError(e.message);
                    }
                }
            })
            .finally(() => setLoading(false));

        return () => {
            ignore = true;
        };
    }, []);

    if (loading) {
        return <div style={{textAlign: 'center'}}>loading users <Spinner /></div>;
    }

    if (error) {
        return <div style={{color: 'red'}}>Error while fetching users: {error}</div>;
    }

    return (
        <div>
            <UserList users={users} setUsers={setUsers} />
        </div>
    );
};

export default UsersPage;