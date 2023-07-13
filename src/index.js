import React from 'react';
import ReactDOM from 'react-dom/client';
import 'scss/index.scss';
import {createHashRouter, Navigate, RouterProvider} from 'react-router-dom';
import Root from 'routes/root';
import ErrorPage from 'error-page';
import Home from 'routes/home';
import Todos from 'routes/todos';
import AuthOnlyLayout from 'security/auth-only-layout';
import Users from 'routes/users';
import NoAuthOnlyLayout from 'security/no-auth-only-layout';
import SignUp from 'routes/sign-up';
import SignIn from 'routes/sign-in';
import Profile from 'routes/profile';
import Settings from 'routes/settings';

const router = createHashRouter([
    {
        path: '/',
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: 'home',
                element: <Home />
            },
            {
                index: true,
                element: <Navigate to="/home" />
            },
            {
                element: <NoAuthOnlyLayout />,
                children: [
                    {
                        path: 'sign-up',
                        element: <SignUp />
                    },
                    {
                        path: 'sign-in',
                        element: <SignIn />
                    }
                ]
            },
            {
                element: <AuthOnlyLayout />,
                children: [
                    {
                        path: 'todos',
                        element: <Todos />
                    },
                    {
                        path: 'users',
                        element: <Users />
                    },
                    {
                        path: 'profile',
                        element: <Profile />
                    },
                    {
                        path: 'settings',
                        element: <Settings />
                    }
                ]
            }
        ]
    }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
//    <React.StrictMode>
        <RouterProvider router={router} />
  //  </React.StrictMode>
);
