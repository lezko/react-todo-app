import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface SettingsState {
    confirmChangeBanned: boolean;
    confirmChangeRole: boolean;
    confirmDeleteTodo: boolean;
    showOnlyMyTodos: boolean;
    allowEditingCompleted: boolean;
}

const initialState: SettingsState = {
    confirmChangeBanned: true,
    confirmChangeRole: true,
    confirmDeleteTodo: true,
    showOnlyMyTodos: false,
    allowEditingCompleted: false,
};

function getSettingsFromLocalStorage() {
    const settingsString = localStorage.getItem('settings');
    if (settingsString) {
        const settings = JSON.parse(settingsString);
        // in case of user modified localstorage manually and removed some settings
        return {...initialState, ...settings};
    }
    saveSettingsToLocalStorage(initialState);
    return initialState;
}

function saveSettingsToLocalStorage(settings: SettingsState) {
    window.localStorage.setItem('settings', (JSON.stringify(settings)));
}

export const settingsSlice = createSlice({
    name: 'settings',
    initialState: getSettingsFromLocalStorage(),
    reducers: {
        setSettings(_, action: PayloadAction<SettingsState>) {
            const settings = action.payload;
            saveSettingsToLocalStorage(settings);
            return settings;
        },
    }
});

export const {setSettings} = settingsSlice.actions;
export default settingsSlice.reducer;