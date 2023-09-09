import {UserListState} from 'store/userListSlice';
import {useAppSelector} from 'store';

export function useUserList(): UserListState {
    return useAppSelector(state => state.userList);
}