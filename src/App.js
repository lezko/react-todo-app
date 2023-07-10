import {createContext, useEffect, useState} from 'react';
import TodosPage from 'pages/TodosPage';
import SignInPage from 'pages/SignInPage';
import {getApiUrl, setApiUrl} from 'config';
import Navbar from 'components/Navbar';
import UserPage from 'pages/UserPage';
import {getTokenFromLocalStorage} from 'utils/tokenStorage';
import HomePage from 'pages/HomePage';
import SignUpPage from 'pages/SignUpPage';

export const UserContext = createContext(null);

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState('home');

    useEffect(() => {
        let ignore = false;
        let ok = true;
        fetch(getApiUrl() + '/me', {
            headers: {
                'ngrok-skip-browser-warning': '69420',
                'authorization': getTokenFromLocalStorage(),
            },
        })
            .then(res => {
                ok = res.ok;
                return res.json();
            })
            .then(data => {
                if (ignore) {
                    return;
                }
                if (ok) {
                    setUser(data);
                    setPage('todos');
                } else {
                    setUser(null);
                }
            })
            .catch(e => {
                if (!ignore) {
                    setUser(null);
                }
            })
            .finally(() => {
                if (!ignore) {
                    setLoading(false);
                }
            });

        return () => {
            ignore = true;
        };
    }, []);

    return (
        <UserContext.Provider value={{user, setUser}}>
            <div className="app">
                <Navbar onNavigate={p => setPage(p)} activePage={page} onLogout={() => setPage('signIn')} />
                {loading
                    ?
                    'loading...'
                    : !user
                        ?
                        page === 'home' ? <HomePage /> : page === 'signUp' ? <SignUpPage onSignUp={() => setPage('todos')} /> : <SignInPage onLogin={() => setPage('todos')} />
                        :
                        page === 'home' ? <HomePage /> : page === 'todos' ? <TodosPage /> : <UserPage />
                }
            </div>
        </UserContext.Provider>
    );
}

export default App;
