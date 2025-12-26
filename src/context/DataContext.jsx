import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { mockDB } from '../lib/mockDB';
import { useAuth } from './AuthContext';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [loadingData, setLoadingData] = useState(false);

    const refreshData = useCallback(() => {
        if (!user) return;
        setLoadingData(true);
        // In a real app we might filter by role here or in the DB
        // For now we load all and filter in UI/Components for simplicity
        const allTasks = mockDB.getTasks();
        const allUsers = mockDB.getUsers();
        setTasks(allTasks);
        setUsers(allUsers);
        setLoadingData(false);
    }, [user]);

    useEffect(() => {
        refreshData();
    }, [refreshData]);

    const createTask = async (taskData) => {
        await mockDB.createTask(taskData);
        refreshData();
    };

    const updateTask = async (id, updates) => {
        await mockDB.updateTask(id, updates);
        refreshData();
    };

    const submitTask = async (id, submission) => {
        await mockDB.submitTask(id, submission);
        refreshData();
    };

    // Admin function
    const createManager = async (managerData) => {
        // Re-use register logic from mockDB but don't log them in
        await mockDB.register({ ...managerData, role: 'manager' });
        refreshData();
    };

    const deleteUser = async (id) => {
        await mockDB.deleteUser(id);
        refreshData();
    };

    return (
        <DataContext.Provider value={{
            tasks,
            users,
            loadingData,
            createTask,
            updateTask,
            submitTask,
            createManager,
            deleteUser,
            refreshData
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);
