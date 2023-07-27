import {useAppSelector} from 'store';
import {LoggedInUserState} from 'store/userSlice';

export function useUser() {
    return useAppSelector(state => state.user);
}

export function useLoggedInUser(): LoggedInUserState {
    const user = useUser();
    if (user.user === null) {
        throw new Error('User reached auth-only component with `user` being null')
    }
    return user as LoggedInUserState;
}