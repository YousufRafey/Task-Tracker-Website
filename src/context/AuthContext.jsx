import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockDB, initDB } from '../lib/mockDB';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        initDB();
        const storedUser = localStorage.getItem('task_tracker_current_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const user = await mockDB.login(email, password);
            setUser(user);
            localStorage.setItem('task_tracker_current_user', JSON.stringify(user));
            return user;
        } catch (error) {
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            const user = await mockDB.register(userData);
            setUser(user);
            localStorage.setItem('task_tracker_current_user', JSON.stringify(user));
            return user;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('task_tracker_current_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
