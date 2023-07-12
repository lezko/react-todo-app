import {useUserContext} from 'hooks/user';
import ProtectedLayout from 'security/protected-layout';
import Spinner from 'components/Spinner';

const AuthOnlyLayout = () => {
    const {user, initialPending} = useUserContext();
    return initialPending ? <Spinner /> : <ProtectedLayout isAllowed={user} redirectPath={'/home'} />;
};

export default AuthOnlyLayout;