import React from 'react';
import { useData } from '../context/DataContext';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

const CalendarView = () => {
    const { tasks } = useData();
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const startDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const blanks = Array.from({ length: startDay }, (_, i) => i);

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Calendar</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">View task deadlines and schedules.</p>
                </div>
                <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-2 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"><ChevronLeft size={20} className="dark:text-white" /></button>
                    <span className="font-bold text-gray-900 dark:text-white w-32 text-center">
                        {today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </span>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"><ChevronRight size={20} className="dark:text-white" /></button>
                </div>
            </header>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-slate-700 overflow-hidden">
                <div className="grid grid-cols-7 border-b border-gray-100 dark:border-slate-700">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="py-4 text-center text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-50/50 dark:bg-slate-800/50">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 auto-rows-fr">
                    {blanks.map(i => <div key={`blank-${i}`} className="min-h-[140px] border-b border-r border-gray-50 dark:border-slate-700/50" />)}

                    {days.map(day => {
                        const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        const dayTasks = tasks.filter(t => t.deadline === dateStr);
                        const isToday = day === today.getDate();

                        return (
                            <div key={day} className={cn(
                                "min-h-[140px] border-b border-r border-gray-50 dark:border-slate-700/50 p-2 transition-colors hover:bg-gray-50/30 dark:hover:bg-slate-700/20 relative group",
                                isToday && "bg-indigo-50/30 dark:bg-indigo-900/10"
                            )}>
                                <span className={cn(
                                    "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium mb-2",
                                    isToday ? "bg-indigo-600 text-white" : "text-gray-500 dark:text-gray-400"
                                )}>
                                    {day}
                                </span>

                                <div className="space-y-1">
                                    {dayTasks.map(task => (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            key={task.id}
                                            className={cn(
                                                "text-xs p-1.5 rounded-lg truncate cursor-pointer shadow-sm border opacity-90 hover:opacity-100 hover:scale-[1.02] transition",
                                                task.status === 'Completed' ? "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800" :
                                                    task.status === 'Pending' ? "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800" :
                                                        "bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800"
                                            )}
                                        >
                                            <div className="flex items-center gap-1 font-semibold">
                                                <Clock size={10} />
                                                {task.title}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CalendarView;
