// Mock Data Service
// Simulates a backend with LocalStorage persistence

const KEYS = {
    USERS: 'task_tracker_users',
    TASKS: 'task_tracker_tasks',
    TEAM: 'task_tracker_managers_team', // For simplicity, 1 team per manager? Or flat? Structure: { managerId: [empIds] }
    CURRENT_USER: 'task_tracker_current_user'
};

const INITIAL_ADMIN = {
    id: 'admin_1',
    name: 'System Admin',
    email: 'admin@admin.com',
    password: 'admin', // Mock password
    role: 'admin',
    avatar: 'https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff'
};

// Helper: Get data
const get = (key) => {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error('Error reading mock db', e);
        return [];
    }
};

// Helper: Set data
const set = (key, data) => localStorage.setItem(key, JSON.stringify(data));

// Initialize DB safely
export const initDB = () => {
    const users = get(KEYS.USERS);
    if (!users.find(u => u.email === INITIAL_ADMIN.email)) {
        users.push(INITIAL_ADMIN);
        set(KEYS.USERS, users);
    }
};

export const mockDB = {
    // User Operations
    login: async (email, password) => {
        await delay(500); // Simulate network
        const users = get(KEYS.USERS);
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            const { password, ...safeUser } = user;
            return safeUser;
        }
        throw new Error('Invalid credentials');
    },

    register: async (userData) => {
        // Only used for Employees in self-signup or Managers via Admin
        await delay(500);
        const users = get(KEYS.USERS);
        if (users.find(u => u.email === userData.email)) {
            throw new Error('Email already exists');
        }
        const newUser = {
            id: crypto.randomUUID(),
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=random&color=fff&size=128`,
            createdAt: new Date().toISOString(),
            role: 'employee', // Default role
            ...userData
        };
        users.push(newUser);
        set(KEYS.USERS, users);
        const { password, ...safeUser } = newUser;
        return safeUser;
    },

    getUsers: () => get(KEYS.USERS),

    updateUser: (id, updates) => {
        const users = get(KEYS.USERS);
        const index = users.findIndex(u => u.id === id);
        if (index !== -1) {
            users[index] = { ...users[index], ...updates };
            set(KEYS.USERS, users);
            return users[index];
        }
        return null;
    },

    deleteUser: async (id) => {
        await delay(300);
        const users = get(KEYS.USERS);
        const filtered = users.filter(u => u.id !== id);
        if (filtered.length === users.length) throw new Error('User not found');
        set(KEYS.USERS, filtered);
        return true;
    },

    // Task Operations
    getTasks: () => get(KEYS.TASKS),

    createTask: async (taskData) => {
        await delay(300);
        const tasks = get(KEYS.TASKS);
        const newTask = {
            id: crypto.randomUUID(),
            status: 'Pending',
            createdAt: new Date().toISOString(),
            submissions: [],
            ...taskData
        };
        tasks.push(newTask);
        set(KEYS.TASKS, tasks);
        return newTask;
    },

    updateTask: async (id, updates) => {
        await delay(300);
        const tasks = get(KEYS.TASKS);
        const index = tasks.findIndex(t => t.id === id);
        if (index !== -1) {
            tasks[index] = { ...tasks[index], ...updates };
            set(KEYS.TASKS, tasks);
            return tasks[index];
        }
        throw new Error('Task not found');
    },

    submitTask: async (taskId, submissionData) => {
        const tasks = get(KEYS.TASKS);
        const index = tasks.findIndex(t => t.id === taskId);
        if (index !== -1) {
            const task = tasks[index];
            // Check if late
            const isLate = new Date() > new Date(task.deadline);

            const submission = {
                id: crypto.randomUUID(),
                submittedAt: new Date().toISOString(),
                isLate,
                ...submissionData
            };

            task.submissions.push(submission);
            task.status = 'Completed'; // Auto-mark completed? Or just submitted? "Mark task as Completed" is a feature.
            // The requirement says "Mark task as Completed". Submission might be separate. 
            // User requirement: "Upload completed task files" and "Mark task as Completed".
            // I'll stick to updating the task.

            if (isLate) task.status = 'Late Submission';

            set(KEYS.TASKS, tasks);
            return task;
        }
        throw new Error('Task not found');
    }
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
