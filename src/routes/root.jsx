import {Outlet, useNavigate} from 'react-router-dom';
import {UserContext, useUser} from 'hooks/user';
import Navbar from 'components/Navbar';
import {getApiUrl} from 'config';
import {getTokenFromLocalStorage} from 'utils/tokenStorage';
import {useEffect, useState} from 'react';
import {ConfigProvider} from 'antd';

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
            <ConfigProvider theme={{token: {
                    colorBgBase: 'rgb(24, 24, 36)',
                    colorText: 'rgb(126, 128, 152)',
                    colorWarning: '#bbca5a',
                    borderRadius: 5,
                    colorBorder: 'rgb(126, 128, 152)',
                    colorPrimaryHover: 'rgb(159,162,210)',
                    colorPrimary: 'rgb(24, 24, 36)',
                }}}>
                <UserContext.Provider value={{user, setUser, initialPending, setInitialPending}}>
                    <Navbar />
                    <Outlet />
                </UserContext.Provider>
            </ConfigProvider>
        </div>
    );
};

export default Root;
