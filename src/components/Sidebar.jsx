import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
    LayoutDashboard,
    Users,
    FileText,
    CheckSquare,
    Briefcase,
    LogOut,
    Moon,
    Sun,
    MessageCircle,
    Calendar as CalendarIcon,
    List
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const [totalUnreadCount, setTotalUnreadCount] = React.useState(0);

    // Calculate unread messages
    React.useEffect(() => {
        const calculateUnread = () => {
            if (!user) return;
            const saved = localStorage.getItem('shared_chat_history');
            if (saved) {
                const allChats = JSON.parse(saved);
                let count = 0;
                allChats.forEach(chat => {
                    // Check if user is participant
                    if (chat.participants.includes(user.id)) {
                        // Count messages NOT sent by user AND NOT read
                        count += chat.messages.filter(m => m.senderId !== user.id && !m.read).length;
                    }
                });
                setTotalUnreadCount(count);
            }
        };

        calculateUnread();
        window.addEventListener('storage', calculateUnread);
        window.addEventListener('chat-update', calculateUnread);
        return () => {
            window.removeEventListener('storage', calculateUnread);
            window.removeEventListener('chat-update', calculateUnread);
        };
    }, [user]);

    const getNavItems = () => {
        const role = user?.role || 'employee'; // Fallback to employee
        const messagesItem = {
            icon: MessageCircle,
            label: 'Messages',
            path: '/messages',
            badge: totalUnreadCount > 0 ? totalUnreadCount : null
        };

        switch (role) {
            case 'admin':
                return [
                    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
                    { icon: FileText, label: 'Create Task', path: '/manager/create-task' },
                    { icon: CheckSquare, label: 'All Tasks', path: '/manager' },
                    messagesItem,
                    { icon: CalendarIcon, label: 'Calendar', path: '/calendar' },
                ];
            case 'manager':
                return [
                    { icon: LayoutDashboard, label: 'Dashboard', path: '/manager' },
                    { icon: FileText, label: 'Create Task', path: '/manager/create-task' },
                    messagesItem,
                    { icon: CalendarIcon, label: 'Calendar', path: '/calendar' },
                ];
            case 'employee':
            default:
                return [
                    { icon: LayoutDashboard, label: 'My Tasks', path: '/employee' },
                    messagesItem,
                    { icon: CalendarIcon, label: 'Calendar', path: '/calendar' },
                ];
        }
    };

    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const sidebarRef = React.useRef(null);

    // Close sidebar when clicking outside on mobile
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target) && isMobileMenuOpen) {
                setIsMobileMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isMobileMenuOpen]);

    // Close sidebar on route change
    React.useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [navigate]);

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden fixed top-4 right-4 z-50 p-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-200"
            >
                {isMobileMenuOpen ? <LogOut className="h-6 w-6 rotate-180" /> : <List className="h-6 w-6" />}
            </button>

            {/* Backdrop for Mobile */}
            {isMobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden"
                />
            )}

            {/* Sidebar Container */}
            <motion.aside
                ref={sidebarRef}
                initial={false}
                animate={{
                    x: isMobileMenuOpen ? 0 : window.innerWidth < 768 ? -280 : 0
                }}
                className={cn(
                    "fixed md:static inset-y-0 left-0 w-72 border-r border-white/20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl min-h-screen flex flex-col shadow-2xl z-40 transition-transform duration-300 ease-in-out",
                    // Reset transform on desktop to ensure it's always visible
                    "md:translate-x-0"
                )}
            >
                <div className="h-24 flex items-center px-6 border-b border-gray-200/50 dark:border-gray-700/50">
                    <img src="/logo.png" alt="TaskTracker" className="h-10 w-10 mr-3 object-contain drop-shadow-md" onError={(e) => { e.target.style.display = 'none'; document.getElementById('fallback-logo').style.display = 'flex'; }} />
                    <div id="fallback-logo" className="hidden p-2 bg-indigo-600 rounded-lg mr-3 shadow-lg shadow-indigo-500/30">
                        <Briefcase className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-400">
                        TaskTracker
                    </span>
                </div>

                <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                    {getNavItems().map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/manager' || item.path === '/admin' || item.path === '/employee'}
                            className={({ isActive }) => cn(
                                "flex items-center px-4 py-3.5 rounded-2xl text-sm font-medium transition-all duration-300 group relative overflow-hidden",
                                isActive
                                    ? "text-white shadow-xl shadow-indigo-500/20 translate-x-1"
                                    : "text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-white/5 hover:text-indigo-600 dark:hover:text-white hover:pl-5"
                            )}
                        >
                            {({ isActive }) => (
                                <>
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeNav"
                                            className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600"
                                            initial={false}
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                    <item.icon className={cn("h-5 w-5 mr-3 relative z-10 transition-transform duration-300 group-hover:scale-110", isActive ? "text-white" : "text-gray-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-400")} />
                                    {item.badge && (
                                        <span className="absolute right-3 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg shadow-rose-500/30 z-20 animate-pulse">
                                            {item.badge}
                                        </span>
                                    )}
                                    <span className="relative z-10 font-semibold tracking-wide">{item.label}</span>
                                    {!isActive && <div className="absolute inset-0 border-2 border-transparent group-hover:border-indigo-100 dark:group-hover:border-indigo-900/30 rounded-2xl transition-colors" />}
                                </>
                            )}
                        </NavLink>
                    ))}
                </div>

                <div className="p-4 mx-4 mb-4 rounded-2xl bg-white/40 dark:bg-slate-800/40 border border-white/20 dark:border-white/5 shadow-lg backdrop-blur-md space-y-3">
                    <button
                        onClick={toggleTheme}
                        className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer group"
                    >
                        <span className="flex items-center group-hover:translate-x-1 transition-transform">
                            {theme === 'light' ? <Sun className="h-4 w-4 mr-2 text-orange-400" /> : <Moon className="h-4 w-4 mr-2 text-indigo-400" />}
                            {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
                        </span>
                    </button>

                    <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />

                    <div className="flex items-center gap-3 py-1">
                        <div className="relative">
                            <img
                                src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=random`}
                                alt="Profile"
                                className="h-10 w-10 rounded-full border-2 border-white dark:border-slate-600 shadow-md object-cover"
                            />
                            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full"></span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-800 dark:text-white truncate">{user?.name}</p>
                            <p className="text-xs text-indigo-500 font-medium capitalize truncate flex items-center">
                                {user?.role || 'Employee'}
                            </p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all cursor-pointer"
                            title="Logout"
                        >
                            <LogOut className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </motion.aside>
        </>
    );
};

export default Sidebar;
