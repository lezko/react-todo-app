import ResetPasswordForm from 'components/ResetPasswordForm';
import ResetLoginForm from 'components/ResetLoginForm';

const ProfilePage = () => {
    return (
        // todo cancel one form if another form clicked
        <div className="profile-page container">
            <h2>Personal info: </h2>
            <ResetLoginForm />
            <ResetPasswordForm />
        </div>
    );
};

export default ProfilePage;