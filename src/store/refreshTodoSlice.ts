import {createSlice} from '@reduxjs/toolkit';

export interface RefreshTodoState {
    value: boolean;
}

const initialState: RefreshTodoState = {
    value: false
}

export const refreshTodoStateSlice = createSlice({
    name: 'refreshTodo',
    initialState,
    reducers: {
        refresh(state) {
            state.value = !state.value;
        },
    }
})

export const {refresh} = refreshTodoStateSlice.actions;
export default refreshTodoStateSlice.reducer;