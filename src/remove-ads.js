let interval;
function tryRemoveAds() {
    for (const child of document.body.children) {
        if (child.id !== 'root') {
            child.remove();
            clearInterval(interval);
        }
    }
    return false;
}

interval = setInterval(tryRemoveAds, 100);
