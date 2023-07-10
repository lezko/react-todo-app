export function setTokenToLocalStorage(token) {
    window.localStorage.setItem('jwt-token', token);
}

export function getTokenFromLocalStorage() {
    const token = window.localStorage.getItem('jwt-token');
    if (token) {
        return token;
    }
    return null;
}