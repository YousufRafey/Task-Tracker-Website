import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Link } from 'react-router-dom';
import { Briefcase, List, Clock, AlertTriangle, CheckCircle, Plus } from 'lucide-react';
import { cn } from '../lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const ManagerDashboard = () => {
    const { tasks, users } = useData();
    const pendingTasks = tasks.filter(t => t.status === 'Pending').length;
    const completedTasks = tasks.filter(t => t.status === 'Completed').length;
    const lateTasks = tasks.filter(t => t.status === 'Late Submission').length;

    const dataPie = [
        { name: 'Pending', value: pendingTasks, color: '#EAB308' },
        { name: 'Completed', value: completedTasks, color: '#22C55E' },
        { name: 'Late', value: lateTasks, color: '#EF4444' },
    ].filter(d => d.value > 0);

    const dataBar = users
        .filter(u => u.role === 'employee')
        .map(u => ({
            name: u.name,
            tasks: tasks.filter(t => t.assignedTo === u.id).length
        }))
        .filter(d => d.tasks > 0)
        .slice(0, 5); // Top 5 busy employees

    // Filter tasks created by THIS manager? 
    // For simplicity of Mock Data, we show all tasks or assume single organization context.
    const recentTasks = [...tasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <header className="flex justify-between items-center px-1">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manager Dashboard</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Overview of team performance and tasks.</p>
                </div>
                <Link
                    to="/manager/create-task"
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/30"
                >
                    <Plus size={18} />
                    Create Task
                </Link>
            </header>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { title: 'Pending', value: pendingTasks, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
                    { title: 'Completed', value: completedTasks, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' },
                    { title: 'Late', value: lateTasks, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30' },
                    { title: 'Total Tasks', value: tasks.length, icon: List, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-6 rounded-2xl shadow-sm border border-white/20 dark:border-slate-700 flex items-center transition-transform hover:-translate-y-1">
                        <div className={cn("p-3 rounded-xl mr-4", stat.bg, stat.color)}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Tasks */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-sm border border-white/20 dark:border-slate-700 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-slate-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Tasks</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                        <thead className="bg-gray-50 dark:bg-slate-800/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Assigned To</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Deadline</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white/50 dark:bg-transparent divide-y divide-gray-200 dark:divide-slate-700">
                            {recentTasks.map(task => {
                                const assigneeName = users.find(u => u.id === task.assignedTo)?.name || 'Team';
                                return (
                                    <tr key={task.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{task.title}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            <div className="flex items-center">
                                                <div className="h-6 w-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-xs mr-2 text-indigo-700 dark:text-indigo-300 font-bold">
                                                    {assigneeName.charAt(0)}
                                                </div>
                                                {assigneeName}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(task.deadline).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={cn(
                                                "px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full",
                                                task.status === 'Completed' ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                                                    task.status === 'Pending' ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" :
                                                        task.status === 'Late Submission' ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" :
                                                            "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" // In Progress
                                            )}>
                                                {task.status}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManagerDashboard;
