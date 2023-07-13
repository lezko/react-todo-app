import {useUserContext} from 'hooks/user';
import ProtectedLayout from 'security/protected-layout';

const NoAuthOnlyLayout = () => {
    const {user} = useUserContext();
    return <ProtectedLayout isAllowed={!user} redirectPath="/todos" />
};

export default NoAuthOnlyLayout;