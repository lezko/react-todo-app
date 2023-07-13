import {createContext, useContext, useState} from 'react';

export const UserContext = createContext(null);

export const useUser = (initialUser = null) => {
    const [user, setUser] = useState(initialUser);
    const [initialPending, setInitialPending] = useState(true);
    return {user, setUser, initialPending, setInitialPending};
};

export const useUserContext = () => useContext(UserContext);
