import {Outlet} from 'react-router-dom';
import Navbar from 'components/Navbar';
import {ConfigProvider} from 'antd';
import {useAppDispatch} from 'store';
import {useEffect} from 'react';
import {verifyUser} from 'store/userActionCreators';
import {useUser} from 'hooks/user';

const Root = () => {
    const dispatch = useAppDispatch();
    const {loading, user} = useUser();
    useEffect(() => {
        if (loading && user) {
            dispatch(verifyUser());
        }
    });
    return (
        <div className="app">
            <ConfigProvider theme={{
                token: {
                    colorBgBase: 'rgb(24, 24, 36)',
                    colorText: 'rgb(126, 128, 152)',
                    colorWarning: '#bbca5a',
                    borderRadius: 5,
                    colorBorder: 'rgb(126, 128, 152)',
                    colorPrimaryHover: 'rgb(159,162,210)',
                    colorPrimary: 'rgb(24, 24, 36)',
                }
            }}>
                <Navbar />
                <Outlet />
            </ConfigProvider>
        </div>
    );
};

export default Root;
