import {useAppSelector} from 'store';

export function useSettings() {
    return useAppSelector(state => state.settings);
}