import {configureStore} from '@reduxjs/toolkit';
import userReducer from 'store/userSlice';
import userListReducer from 'store/userListSlice';
import settingsReducer from 'store/settingsSlice';
import refreshTodoReducer from 'store/refreshTodoSlice';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';

export const store = configureStore({
    reducer: {
        user: userReducer,
        userList: userListReducer,
        settings: settingsReducer,
        refreshTodo: refreshTodoReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;