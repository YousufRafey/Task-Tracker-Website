import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';
import { Lock, Mail, Loader2, AlertCircle, ArrowRight, CheckCircle2, ShieldCheck, Zap, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [resetStatus, setResetStatus] = useState('idle'); // idle, sending, success

    const { login } = useAuth();
    const navigate = useNavigate();

    // Check for Magic Login Token
    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const magicToken = params.get('magic_token');
        if (magicToken) {
            toast.loading('Verifying Magic Link...', { id: 'magic' });
            setTimeout(async () => {
                // Mock Auto-Login
                try {
                    await login('admin@admin.com', 'admin'); // Auto-login as admin for demo
                    toast.success('✨ Magic Login Successful!', { id: 'magic' });
                    navigate('/admin');
                } catch (e) {
                    toast.error('Login Failed', { id: 'magic' });
                }
            }, 1500);
        }
    }, []);

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setResetStatus('sending');
        // Simulate API call
        await new Promise(r => setTimeout(r, 1500));
        setResetStatus('success');

        const magicLink = `${window.location.origin}/login?magic_token=${crypto.randomUUID()}`;

        // Mock Notification with Clickable Link
        toast.custom((t) => (
            <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white dark:bg-slate-800 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
                <div className="flex-1 w-0 p-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0 pt-0.5">
                            <Mail className="h-10 w-10 text-indigo-500" />
                        </div>
                        <div className="ml-3 flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                New Email from TaskTracker
                            </p>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Click the button below to login instantly.
                            </p>
                            <div className="mt-3 flex gap-2">
                                <a
                                    href={magicLink}
                                    className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none cursor-pointer"
                                >
                                    Login Now
                                </a>
                                <button
                                    onClick={() => toast.dismiss(t.id)}
                                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none cursor-pointer"
                                >
                                    Dismiss
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ), { duration: 10000 });

        setTimeout(() => {
            setShowForgotPassword(false);
            setResetStatus('idle');
            setResetEmail('');
        }, 3000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const user = await login(email, password);
            await new Promise(r => setTimeout(r, 800));
            if (user.role === 'admin') navigate('/admin');
            else if (user.role === 'manager') navigate('/manager');
            else navigate('/employee');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const marqueeVariants = {
        animate: {
            x: [0, -1000],
            transition: {
                x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 20,
                    ease: "linear",
                },
            },
        },
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 flex overflow-hidden relative">
            {/* Brand Logo - Top Left */}
            <div className="absolute top-8 left-8 z-50 flex items-center gap-3">
                <img src="/logo.png" alt="TaskTracker" className="h-10 w-10 object-contain drop-shadow-md" />
                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-400">
                    TaskTracker
                </span>
            </div>

            {/* Left Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative z-10 bg-white dark:bg-slate-950">
                <div className="w-full max-w-md space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="mb-8">
                            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                                Welcome back
                            </h1>
                            <p className="mt-2 text-gray-500 dark:text-gray-400">
                                Please enter your details to sign in.
                            </p>
                        </div>

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="bg-red-50/50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl flex items-center gap-2 text-sm"
                                >
                                    <AlertCircle size={16} />
                                    {error}
                                </motion.div>
                            )}

                            <div className="space-y-5">
                                <div className="group">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">Email</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors" />
                                        </div>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="block w-full pl-11 px-4 py-3.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white transition-all outline-none"
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="group">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">Password</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors" />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="block w-full pl-11 pr-10 px-4 py-3.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white transition-all outline-none"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-full transition-all duration-200 cursor-pointer"
                                            title={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center text-gray-500 dark:text-gray-400 cursor-pointer">
                                    <input type="checkbox" className="mr-2 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                                    Remember me
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setShowForgotPassword(true)}
                                    className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 hover:underline transition-all cursor-pointer"
                                >
                                    Forgot password?
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={cn(
                                    "w-full flex justify-center items-center py-4 px-4 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-[1.01] active:scale-[0.99] cursor-pointer",
                                    loading && "opacity-70 cursor-not-allowed"
                                )}
                            >
                                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                                    <>Sign in <ArrowRight className="ml-2 h-4 w-4" /></>
                                )}
                            </button>

                            <div className="text-center mt-6">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Don't have an account?{' '}
                                    <Link to="/signup" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors">
                                        Sign up for free
                                    </Link>
                                </p>
                            </div>
                        </form>

                        <div className="mt-10 pt-6 border-t border-gray-100 dark:border-slate-800 text-xs text-center text-gray-400">
                            <p>Demo Admin: admin@admin.com / admin</p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Right Side - Premium Motion Effects */}
            <div className="hidden lg:flex w-1/2 bg-black relative overflow-hidden items-center justify-center perspective-1000">
                {/* Animated Background Mesh */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black opacity-80"></div>

                {/* Floating Blobs */}
                <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>

                {/* 3D Dashboard Mockup */}
                <motion.div
                    initial={{ opacity: 0, rotateY: -20, rotateX: 10, scale: 0.9 }}
                    animate={{ opacity: 1, rotateY: -10, rotateX: 5, scale: 1 }}
                    transition={{ duration: 1.5, type: "spring" }}
                    className="relative z-10 w-[80%] max-w-2xl bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden transform-style-3d shadow-indigo-500/20"
                    style={{ transform: "rotateY(-12deg) rotateX(5deg)" }}
                >
                    {/* Mock Header */}
                    <div className="h-12 border-b border-slate-700/50 flex items-center px-4 gap-2 bg-slate-900/50">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                        </div>
                        <div className="ml-4 w-1/2 h-6 bg-slate-700/50 rounded-md"></div>
                    </div>

                    {/* Mock Body */}
                    <div className="p-6 flex gap-6 h-[400px]">
                        {/* Mock Sidebar */}
                        <div className="w-16 flex flex-col items-center gap-4 py-2">
                            <div className="w-10 h-10 rounded-xl bg-indigo-600/80 mb-4"></div>
                            <div className="w-8 h-8 rounded-lg bg-slate-700/50"></div>
                            <div className="w-8 h-8 rounded-lg bg-slate-700/50"></div>
                            <div className="w-8 h-8 rounded-lg bg-slate-700/50"></div>
                        </div>

                        {/* Mock Content */}
                        <div className="flex-1 space-y-4">
                            <div className="flex justify-between items-center">
                                <div className="w-1/3 h-8 bg-slate-700/50 rounded-lg"></div>
                                <div className="w-24 h-8 bg-indigo-600/50 rounded-lg"></div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-slate-700/30 p-4 rounded-xl h-24"></div>
                                <div className="bg-slate-700/30 p-4 rounded-xl h-24"></div>
                                <div className="bg-slate-700/30 p-4 rounded-xl h-24"></div>
                            </div>

                            <div className="w-full bg-slate-700/30 rounded-xl h-48 flex items-end justify-between p-4 gap-2">
                                <div className="w-full bg-indigo-500/20 rounded-t-lg h-[40%]" />
                                <div className="w-full bg-indigo-500/40 rounded-t-lg h-[60%]" />
                                <div className="w-full bg-indigo-500/60 rounded-t-lg h-[80%]" />
                                <div className="w-full bg-indigo-500/80 rounded-t-lg h-[50%]" />
                                <div className="w-full bg-indigo-500 rounded-t-lg h-[75%]" />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>


            {/* Forgot Password Modal */}
            {
                showForgotPassword && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-8 border border-gray-100 dark:border-slate-800 relative"
                        >
                            <button
                                onClick={() => setShowForgotPassword(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>

                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Mail className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Reset Password</h3>
                                <p className="text-gray-500 dark:text-gray-400 mt-2">Enter your email and we'll send you a link to reset your password.</p>
                            </div>

                            {resetStatus === 'success' ? (
                                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 p-4 rounded-xl flex items-center justify-center gap-2">
                                    <CheckCircle2 className="w-5 h-5" />
                                    <div className="flex flex-col items-center">
                                        <p className="font-semibold text-center mb-1">Magic Link Sent!</p>
                                        <p className="text-xs opacity-75">(Check the notification to Login)</p>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleForgotPassword} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            value={resetEmail}
                                            onChange={(e) => setResetEmail(e.target.value)}
                                            className="block w-full px-4 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white transition-all outline-none"
                                            placeholder="Enter your registered email"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={resetStatus === 'sending'}
                                        className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-lg shadow-indigo-500/20 cursor-pointer"
                                    >
                                        {resetStatus === 'sending' ? <Loader2 className="animate-spin h-5 w-5" /> : 'Send Reset Link'}
                                    </button>
                                </form>
                            )}
                        </motion.div>
                    </div>
                )
            }
        </div >
    );
};

export default Login;
