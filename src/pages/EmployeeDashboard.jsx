import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Calendar, CheckCircle, Clock } from 'lucide-react';
import { cn } from '../lib/utils';
import TaskDetailsModal from '../components/TaskDetailsModal';

const EmployeeDashboard = () => {
    const { tasks, users } = useData();
    const { user } = useAuth();
    const [selectedTask, setSelectedTask] = useState(null);

    // Filter tasks assigned to this employee
    const myTasks = user ? tasks.filter(t => t.assignedTo === user.id) : [];

    const pendingTasks = myTasks.filter(t => t.status === 'Pending').length;
    const completedTasks = myTasks.filter(t => t.status === 'Completed' || t.status === 'Late Submission').length;

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <header className="px-1">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Workspace</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Welcome back, {user?.name}. Here are your tasks.</p>
            </header>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { title: 'Pending Tasks', value: pendingTasks, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
                    { title: 'Completed', value: completedTasks, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' }
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

            {/* Task Grid */}
            <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 px-1">Assigned Tasks</h2>
                {myTasks.length === 0 ? (
                    <div className="text-center py-12 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-gray-300 dark:border-slate-700 backdrop-blur-sm">
                        <CheckCircle className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No tasks assigned</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">You're all caught up!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myTasks.map(task => (
                            <div
                                key={task.id}
                                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-sm border border-white/20 dark:border-slate-700 hover:shadow-xl hover:shadow-indigo-500/10 transition cursor-pointer flex flex-col h-full group"
                                onClick={() => setSelectedTask(task)}
                            >
                                <div className="p-6 flex-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className={cn(
                                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                                            task.status === 'Completed' ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                                                task.status === 'Late Submission' ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" :
                                                    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                        )}>
                                            {task.status}
                                        </span>
                                        {new Date(task.deadline) < new Date() && task.status !== 'Completed' && (
                                            <span className="text-xs font-bold text-red-500 dark:text-red-400 flex items-center gap-1">
                                                Overdue
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{task.title}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mb-4">{task.description}</p>
                                </div>
                                <div className="p-6 border-t border-gray-100 dark:border-slate-700 mt-auto bg-gray-50/50 dark:bg-slate-800/30">
                                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                        <Calendar size={16} className="mr-2 text-indigo-500" />
                                        <span>Due {new Date(task.deadline).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {selectedTask && (
                <TaskDetailsModal
                    task={selectedTask}
                    onClose={() => setSelectedTask(null)}
                />
            )}
        </div>
    );
};

export default EmployeeDashboard;
