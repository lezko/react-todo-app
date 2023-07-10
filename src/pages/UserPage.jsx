import UserList from 'components/UserList';
import {useEffect, useState} from 'react';
import {getApiUrl} from 'config';
import {getTokenFromLocalStorage} from 'utils/tokenStorage';

const UserPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    useEffect(() => {
        let ignore = false;
        let ok = true;
        fetch(getApiUrl() + '/users', {
            headers: {
                'ngrok-skip-browser-warning': '69420',
                'authorization': getTokenFromLocalStorage()
            }
        })
            .then(res => {
                ok = res.ok;
                return res.json();
            })
            .then(data => {
                if (ignore) {
                    return;
                }
                if (ok) {
                    setUsers(data);
                    setError('');
                } else {
                    setUsers([]);
                    setError(data.message);
                }
            })
            .catch(e => {
                if (!ignore) {
                    setUsers([]);
                    setError(e.message);
                }
            })
            .finally(() => {
                if (!ignore) {
                    setLoading(false);
                }
            });

        return () => {
            ignore = true;
        }
    }, []);

    if (loading) {
        return 'loading users...';
    }

    if (error) {
        return <div style={{color: 'red'}}>Error while fetching users: {error}</div>
    }

    return (
        <div>
            <UserList users={users} />
        </div>
    );
};

export default UserPage;