import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface SettingsState {
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
    let finalSettings = initialState;
    const settingsString = localStorage.getItem('settings');
    if (settingsString) {
        const settings = JSON.parse(settingsString);
        // in case of user modified localstorage manually and removed some settings
        finalSettings = {...finalSettings, ...settings};
    }
    // todo remove side effect
    saveSettingsToLocalStorage(finalSettings);
    return finalSettings;
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