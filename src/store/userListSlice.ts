import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface UserListState {
    users: string[];
}

const initialState: UserListState = {
    users: []
}

export const userListSlice = createSlice({
    name: 'userList',
    initialState,
    reducers: {
        setUserList(state, action: PayloadAction<string[]>) {
            state.users = action.payload;
        },
    }
})

export const {setUserList} = userListSlice.actions;
export default userListSlice.reducer;