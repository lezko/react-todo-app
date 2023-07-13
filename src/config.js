if (!getApiUrl()) {
    setApiUrl('https://82.148.16.142:8080');
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
