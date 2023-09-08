import ProtectedLayout from 'security/protected-layout';
import {useLoggedInUser} from 'hooks/user';
import {UserRole} from 'models/IUser';

const AdminOnlyLayout = () => {
    const {user} = useLoggedInUser();
    return <ProtectedLayout isAllowed={user.role === UserRole.Admin} redirectPath="/home" />
};

export default AdminOnlyLayout;