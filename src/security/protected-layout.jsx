import {Navigate, Outlet} from 'react-router-dom';

const ProtectedLayout = ({redirectPath, isAllowed}) => {
    if (!isAllowed) {
        return <Navigate to={redirectPath} replace />
    }
    return <Outlet />;
};

export default ProtectedLayout;