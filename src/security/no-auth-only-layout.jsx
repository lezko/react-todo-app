import ProtectedLayout from 'security/protected-layout';
import {useAppSelector} from 'store';

const NoAuthOnlyLayout = () => {
    const {user} = useAppSelector(state => state.user);
    return <ProtectedLayout isAllowed={!user} redirectPath="/todos" />
};

export default NoAuthOnlyLayout;