import React from 'react';
import ReactDOM from 'react-dom/client';
import 'scss/index.scss';
import {createHashRouter, Navigate, RouterProvider} from 'react-router-dom';
import ErrorPage from 'error-page';
import HomePage from 'pages/home-page';
import TodosPage from 'pages/todos-page';
import AuthOnlyLayout from 'security/auth-only-layout';
import UsersPage from 'pages/users-page';
import NoAuthOnlyLayout from 'security/no-auth-only-layout';
import SignUpPage from 'pages/sign-up-page';
import SignInPage from 'pages/sign-in-page';
import ProfilePage from 'pages/profile-page';
import SettingsPage from 'pages/settings-page';
import Root from 'pages/root';

const router = createHashRouter([
    {
        path: '/',
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: 'home',
                element: <HomePage />
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
                        element: <SignUpPage />
                    },
                    {
                        path: 'sign-in',
                        element: <SignInPage />
                    }
                ]
            },
            {
                element: <AuthOnlyLayout />,
                children: [
                    {
                        path: 'todos',
                        element: <TodosPage />
                    },
                    {
                        path: 'users',
                        element: <UsersPage />
                    },
                    {
                        path: 'profile',
                        element: <ProfilePage />
                    },
                    {
                        path: 'settings',
                        element: <SettingsPage />
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
