import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IUser} from 'models/IUser';
import {IAuthUser} from 'models/IAuthUser';

interface UserState {
    user: IAuthUser | null;
    loading: boolean;
    error: string;
}

export interface LoggedInUserState {
    user: IAuthUser;
    loading: boolean;
    error: string;
}

function saveUserToLocalStorage(user: IUser) {
    localStorage.setItem('user', JSON.stringify(user));
}

function getUserFromLocalStorage(): UserState {
    const userString = localStorage.getItem('user');
    if (userString) {
        // todo user may edit localstorage manually and some fields will be missing
        const user: IAuthUser = JSON.parse(userString);
        return {
            user,
            loading: true,
            error: '',
        };
    }
    return {
        user: null,
        loading: false,
        error: '',
    };
}

function removeUserFromLocalStorage() {
    localStorage.removeItem('user');
}

const initialState = getUserFromLocalStorage();

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        startLogIn(state) {
            state.loading = true;
        },
        logInSuccess(state, action: PayloadAction<IAuthUser>) {
            state.loading = false;
            state.error = '';
            const user = {...state.user, ...action.payload};
            state.user = user;
            saveUserToLocalStorage(user);
        },
        logInError(state, action: PayloadAction<string>) {
            state.user = null;
            state.loading = false;
            state.error = action.payload;
        },
        logOut(state) {
            state.user = null;
            removeUserFromLocalStorage();
        },
    }
});

export const {startLogIn, logOut, logInSuccess, logInError} = userSlice.actions;
export default userSlice.reducer;