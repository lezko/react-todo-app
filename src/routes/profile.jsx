import {useUserContext} from 'hooks/user';
import ResetPasswordForm from 'components/ResetPasswordForm';
import ResetLoginForm from 'components/ResetLoginForm';

const Profile = () => {
    const {user, setUser} = useUserContext();
    return (
        // todo cancel one form if another form clicked
        <div className="profile-page container">
            <h2>Personal info: </h2>
            <ResetLoginForm />
            <ResetPasswordForm />
        </div>
    );
};

export default Profile;