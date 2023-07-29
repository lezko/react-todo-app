import {useAppSelector} from 'store';
import {SettingsState} from 'store/settingsSlice';

export function useSettings(): SettingsState {
    return useAppSelector(state => state.settings);
}