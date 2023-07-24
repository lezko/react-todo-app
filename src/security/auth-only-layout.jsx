import ProtectedLayout from 'security/protected-layout';
import Spinner from 'components/Spinner';
import {useAppSelector} from 'store';

const AuthOnlyLayout = () => {
    const {user, loading} = useAppSelector(state => state.user);
    return loading ? <Spinner /> : <ProtectedLayout isAllowed={user} redirectPath={'/home'} />;
};

export default AuthOnlyLayout;