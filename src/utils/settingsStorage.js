export function getSettingsFromLocalStorage() {
    return JSON.parse(window.localStorage.getItem('settings'));
}

export function saveSettingsToLocalStorage(settings) {
    window.localStorage.setItem('settings', (JSON.stringify(settings)));
}

export function partiallySaveSettingsToLocalStorage(partialSettings) {
    const settings = getSettingsFromLocalStorage();
    saveSettingsToLocalStorage({...settings, ...partialSettings});
}

const initialSettings = {
    confirmChangeRole: true,
    confirmChangeBanned: true,
    confirmDeleteTodo: true
}

if (!getSettingsFromLocalStorage()) {
    saveSettingsToLocalStorage(initialSettings);
}
