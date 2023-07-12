import {Outlet, useNavigate} from 'react-router-dom';
import {UserContext, useUser} from 'hooks/user';
import Navbar from 'components/Navbar';
import {getApiUrl} from 'config';
import {getTokenFromLocalStorage} from 'utils/tokenStorage';
import {useEffect, useState} from 'react';

const Root = () => {
    const {user, setUser, initialPending, setInitialPending} = useUser();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        let ignore = false;
        let ok = true;
        fetch(getApiUrl() + '/me', {
            headers: {
                'ngrok-skip-browser-warning': '69420',
                'authorization': getTokenFromLocalStorage(),
            },
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
                    setUser(data);
                    navigate('/todos');
                } else {
                    setUser(null);
                }
            })
            .catch(e => {
                if (!ignore) {
                    setUser(null);
                }
            })
            .finally(() => {
                setLoading(false);
                setInitialPending(false);
            });

        return () => {
            ignore = true;
        };
    }, []);

    return (
        <div className="app">
            <UserContext.Provider value={{user, setUser, initialPending, setInitialPending}}>
                <Navbar />
                <Outlet />
            </UserContext.Provider>
        </div>
    );
};

export default Root;
