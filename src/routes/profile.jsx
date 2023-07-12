import {useUserContext} from 'hooks/user';

const Profile = () => {
    const {user, setUser} = useUserContext();
    return (
        <div>
profile
        </div>
    );
};

export default Profile;