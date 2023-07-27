import ProtectedLayout from 'security/protected-layout';
import Spinner from 'components/Spinner';
import {useUser} from 'hooks/user';

const AuthOnlyLayout = () => {
    const {user, loading} = useUser();
    return loading ?
        <div style={{display: 'flex', justifyContent: 'center'}}><Spinner /></div> :
        <ProtectedLayout isAllowed={user !== null} redirectPath={'/home'} />;
};

export default AuthOnlyLayout;