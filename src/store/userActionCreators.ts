import {AppDispatch, RootState} from 'store/index';
import {logInError, logInSuccess, startLogIn} from 'store/userSlice';
import {getApiUrl} from 'config';
import axios from 'axios';
import {UserRole} from 'models/IUser';
// todo proper exception handling
export function logIn(login: string, password: string) {
    return async function (dispatch: AppDispatch) {
        try {
            dispatch(startLogIn());
            const response = await axios.post(getApiUrl() + '/login', JSON.stringify({login, password}));
            // todo server rename jwt-token to token
            const userData = Object.assign({}, response.data);
            userData.token = response.data['jwt-token'];
            delete userData['jwt-token'];
            dispatch(logInSuccess(userData));
        } catch (e: unknown) {
            if (axios.isAxiosError(e)) {
                dispatch(logInError(e.response?.data.message));
            } else {
                dispatch(logInError(String(e)));
            }
        }
    };
}

export function verifyUser() {
    return async function (dispatch: AppDispatch, getState: () => RootState) {
        try {
            const token = getState().user.user?.token || '';
            // const response = await axios.get(getApiUrl() + '/me', {headers: {'Authorization': token}});
            const response = await axios.get(getApiUrl() + '/me');
            dispatch(logInSuccess(response.data));
        } catch (e: unknown) {
            console.error(e);
            dispatch(logInError(''));
            // todo display message in case of server error
        }
    };
}