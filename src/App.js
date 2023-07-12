import {useEffect, useState} from 'react';
import Todos from 'routes/todos';
import SignIn from 'routes/sign-in';
import {getApiUrl} from 'config';
import Navbar from 'components/Navbar';
import Users from 'routes/users';
import {getTokenFromLocalStorage} from 'utils/tokenStorage';
import Home from 'routes/home';
import SignUp from 'routes/sign-up';

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
                        page === 'home' ? <Home /> : page === 'signUp' ? <SignUp onSignUp={() => setPage('todos')} /> : <SignIn onLogin={() => setPage('todos')} />
                        :
                        page === 'home' ? <Home /> : page === 'todos' ? <Todos /> : <Users />
                }
            </div>
        </UserContext.Provider>
    );
}

export default App;
