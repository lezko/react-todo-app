import React from 'react';
import ReactDOM from 'react-dom/client';
import 'scss/index.scss';
import App from 'App';

// remove hosting ads :)
for (const child of document.body.children) {
    if (child.id !== 'root') {
        child.remove();
    }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
