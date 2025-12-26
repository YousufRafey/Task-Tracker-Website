import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Users, Briefcase, UserPlus, CheckCircle, AlertCircle, Trash2, TrendingUp, Activity } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';

const AdminDashboard = () => {
    const { users, tasks, createManager, deleteUser } = useData();
    const [managerForm, setManagerForm] = useState({ name: '', email: '', password: '' });
    const [showForm, setShowForm] = useState(false);
    const [msg, setMsg] = useState({ type: '', text: '' });

    const totalEmployees = users.filter(u => u.role === 'employee').length;
    const totalManagers = users.filter(u => u.role === 'manager').length;
    const totalTasks = tasks.length;

    // Derived Stats for Charts
    const taskStats = [
        { name: 'Pending', value: tasks.filter(t => t.status === 'Pending').length, color: '#6366f1' },
        { name: 'In Progress', value: tasks.filter(t => t.status === 'In Progress').length, color: '#f59e0b' },
        { name: 'Completed', value: tasks.filter(t => t.status === 'Completed').length, color: '#22c55e' },
        { name: 'Late', value: tasks.filter(t => t.status === 'Late Submission').length, color: '#ef4444' },
    ];

    const handleDeleteUser = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await deleteUser(id);
                setMsg({ type: 'success', text: 'User deleted successfully' });
            } catch (error) {
                setMsg({ type: 'error', text: 'Failed to delete user' });
            }
        }
    };

    const handleCreateManager = async (e) => {
        e.preventDefault();
        setMsg({ type: '', text: '' });
        try {
            await createManager(managerForm);
            setMsg({ type: 'success', text: 'Manager created successfully' });
            setManagerForm({ name: '', email: '', password: '' });
            setShowForm(false);
        } catch (error) {
            setMsg({ type: 'error', text: error.message || 'Failed to create manager' });
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <motion.div
            className="p-8 space-y-8 max-w-7xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-400">
                        Admin Overview
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Welcome back, Administrator.</p>
                </div>
                <div className="text-sm px-4 py-2 bg-white/50 dark:bg-slate-800/50 rounded-full border border-white/20 dark:border-slate-700 backdrop-blur-md shadow-sm text-gray-600 dark:text-gray-300">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </header>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { title: 'Total Employees', value: totalEmployees, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
                    { title: 'Total Managers', value: totalManagers, icon: Briefcase, color: 'text-indigo-600', bg: 'bg-indigo-100 dark:bg-indigo-900/30' },
                    { title: 'Total Tasks', value: totalTasks, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' },
                ].map((stat, idx) => (
                    <motion.div
                        key={idx}
                        variants={itemVariants}
                        whileHover={{ y: -5 }}
                        className="bg-white/70 dark:bg-slate-800/50 backdrop-blur-xl p-6 rounded-2xl shadow-xl shadow-indigo-500/10 border border-white/20 dark:border-slate-700 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <stat.icon size={100} className={stat.color} />
                        </div>
                        <div className="flex items-center mb-4">
                            <div className={cn("p-3 rounded-xl mr-4", stat.bg, stat.color)}>
                                <stat.icon size={24} />
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Charts Section */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white/70 dark:bg-slate-800/50 backdrop-blur-xl p-6 rounded-2xl shadow-sm border border-white/20 dark:border-slate-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <TrendingUp size={20} className="text-indigo-500" />
                        Task Status Distribution
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={taskStats} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} strokeOpacity={0.1} />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={100} tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ fill: 'transparent' }}
                                />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                                    {taskStats.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white/70 dark:bg-slate-800/50 backdrop-blur-xl p-6 rounded-2xl shadow-sm border border-white/20 dark:border-slate-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <Activity size={20} className="text-indigo-500" />
                        Engagement Overview
                    </h3>
                    <div className="h-64 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={taskStats}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {taskStats.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </motion.div>

            {/* User Management Section */}
            <motion.div variants={itemVariants} className="bg-white/70 dark:bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-sm border border-white/20 dark:border-slate-700 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700/50 flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">User Management</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Manage system access</p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95"
                    >
                        <UserPlus size={18} />
                        {showForm ? 'Cancel' : 'Add Manager'}
                    </button>
                </div>

                {msg.text && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className={cn("px-6 py-4 mx-6 mt-6 rounded-xl flex items-center gap-3", msg.type === 'error' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100')}
                    >
                        {msg.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
                        {msg.text}
                    </motion.div>
                )}

                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="p-6 bg-gray-50/50 dark:bg-slate-800/30 border-b border-gray-100 dark:border-gray-700/50"
                    >
                        <div className="max-w-md">
                            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-4">Create New Manager Account</h3>
                            <form onSubmit={handleCreateManager} className="space-y-4">
                                <div>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Full Name"
                                        className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none dark:text-white transition-all"
                                        value={managerForm.name}
                                        onChange={e => setManagerForm({ ...managerForm, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <input
                                        type="email"
                                        required
                                        placeholder="Email Address"
                                        className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none dark:text-white transition-all"
                                        value={managerForm.email}
                                        onChange={e => setManagerForm({ ...managerForm, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <input
                                        type="password"
                                        required
                                        placeholder="Password"
                                        className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none dark:text-white transition-all"
                                        value={managerForm.password}
                                        onChange={e => setManagerForm({ ...managerForm, password: e.target.value })}
                                    />
                                </div>
                                <div className="pt-2">
                                    <button type="submit" className="w-full px-4 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition">
                                        Create Manager Account
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}

                <div className="p-6">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider text-xs">All System Users</h3>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {users.filter(u => u.role !== 'admin').length === 0 ? (
                            <p className="text-gray-400 italic text-center py-8">No additional users in the system.</p>
                        ) : (
                            users.filter(u => u.role !== 'admin').map((user, i) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    key={user.id}
                                    className="flex items-center justify-between p-4 bg-white dark:bg-slate-900/50 border border-gray-100 dark:border-gray-800 rounded-xl group hover:border-indigo-200 dark:hover:border-indigo-800 transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <div className={cn(
                                                "h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm",
                                                user.role === 'manager' ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300" : "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300"
                                            )}>
                                                {user.name.charAt(0)}
                                            </div>
                                            <span className={cn(
                                                "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-slate-900",
                                                "bg-green-500" // Mock status
                                            )} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                                {user.name}
                                                <span className={cn(
                                                    "px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wide font-semibold",
                                                    user.role === 'manager' ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400" : "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                                                )}>
                                                    {user.role}
                                                </span>
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">Password: <span className="font-mono text-indigo-500">{user.password || '****'}</span></p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="text-right hidden sm:block">
                                            <p className="text-xs text-gray-400">Joined</p>
                                            <p className="text-xs font-medium text-gray-600 dark:text-gray-300">
                                                {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteUser(user.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                                            title="Delete User"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default AdminDashboard;
