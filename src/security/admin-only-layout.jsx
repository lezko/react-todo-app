import {useUserContext} from 'hooks/user';
import ProtectedLayout from 'security/protected-layout';

const AdminOnlyLayout = () => {
    const {user} = useUserContext();
    return <ProtectedLayout isAllowed={user.role === 'ROLE_ADMIN'} redirectPath="/home" />
};

export default AdminOnlyLayout;