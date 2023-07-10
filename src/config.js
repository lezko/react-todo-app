// export const apiUrl = 'http://localhost:3000/api/v1';
// export let apiUrl = 'https://1b69-83-139-159-121.ngrok-free.app';

// setApiUrl('https://1b69-83-139-159-121.ngrok-free.app');

if (!getApiUrl()) {
    setApiUrl('');
}

export function getApiUrl() {
    const url = window.localStorage.getItem('api-url');
    if (url) {
        return url;
    }
    return null;
}

export function setApiUrl(url) {
    if (url.endsWith('/')) {
        url = url.substring(0, url.length - 1);
    }
    window.localStorage.setItem('api-url', url);
}

export function clearApiUrl() {
    window.localStorage.removeItem('api-url');
}
