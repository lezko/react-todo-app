import {RefreshTodoState} from 'store/refreshTodoSlice';
import {useAppSelector} from 'store';

export function useRefreshTodo(): RefreshTodoState {
    return useAppSelector(state => state.refreshTodo);
}