import ProtectedLayout from 'security/protected-layout';
import {useLoggedInUser} from 'hooks/user';

const AdminOnlyLayout = () => {
    const {user} = useLoggedInUser();
    return <ProtectedLayout isAllowed={user.role === 'ROLE_ADMIN'} redirectPath="/home" />
};

export default AdminOnlyLayout;