import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Search, Send, Phone, Video, MoreVertical, Paperclip, MessageSquare } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

const Messages = () => {
    const { user } = useAuth();
    const { users } = useData();
    const [selectedUser, setSelectedUser] = useState(null);
    const [messageInput, setMessageInput] = useState('');

    // Load all shared conversations
    const [allConversations, setAllConversations] = useState(() => {
        const saved = localStorage.getItem('shared_chat_history');
        return saved ? JSON.parse(saved) : [];
    });

    // Listen for storage changes
    React.useEffect(() => {
        const handleStorageChange = () => {
            const saved = localStorage.getItem('shared_chat_history');
            if (saved) setAllConversations(JSON.parse(saved));
        };
        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('chat-update', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('chat-update', handleStorageChange);
        };
    }, []);

    const otherUsers = users.filter(u => u.id !== user.id);

    const getConversationId = (id1, id2) => {
        return [id1, id2].sort().join('-');
    };

    // Mark messages as read when chat is opened
    React.useEffect(() => {
        if (selectedUser && allConversations.length > 0) {
            const convoId = getConversationId(user.id, selectedUser.id);
            const convoIndex = allConversations.findIndex(c => c.id === convoId);

            if (convoIndex > -1) {
                const conversation = allConversations[convoIndex];
                const hasUnread = conversation.messages.some(m => m.senderId !== user.id && !m.read);

                if (hasUnread) {
                    const updatedConversations = [...allConversations];
                    updatedConversations[convoIndex] = {
                        ...conversation,
                        messages: conversation.messages.map(m =>
                            m.senderId !== user.id ? { ...m, read: true } : m
                        )
                    };
                    setAllConversations(updatedConversations);
                    localStorage.setItem('shared_chat_history', JSON.stringify(updatedConversations));
                    // Don't dispatch updated event here to avoid infinite loops across tabs if not careful, 
                    // but we do need to update local badge state.
                    // Actually dispatching is fine because we check !m.read before updating.
                    window.dispatchEvent(new Event('chat-update'));
                }
            }
        }
    }, [selectedUser, allConversations, user.id]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!messageInput.trim() || !selectedUser) return;

        const newMsg = {
            id: Date.now(),
            text: messageInput,
            senderId: user.id,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            read: false // Default to unread
        };

        const convoId = getConversationId(user.id, selectedUser.id);

        let updatedConversations;
        const existingConvoIndex = allConversations.findIndex(c => c.id === convoId);

        if (existingConvoIndex > -1) {
            updatedConversations = [...allConversations];
            updatedConversations[existingConvoIndex] = {
                ...updatedConversations[existingConvoIndex],
                messages: [...updatedConversations[existingConvoIndex].messages, newMsg]
            };
        } else {
            updatedConversations = [...allConversations, {
                id: convoId,
                participants: [user.id, selectedUser.id],
                messages: [newMsg]
            }];
        }

        setAllConversations(updatedConversations);
        localStorage.setItem('shared_chat_history', JSON.stringify(updatedConversations));
        window.dispatchEvent(new Event('chat-update'));
        setMessageInput('');
    };

    const activeMessages = selectedUser
        ? (allConversations.find(c => c.id === getConversationId(user.id, selectedUser.id))?.messages || [])
        : [];

    return (
        <div className="flex bg-white dark:bg-slate-900 h-[calc(100vh-64px)] overflow-hidden">
            {/* Sidebar List */}
            <div className="w-80 border-r border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col">
                <div className="p-4 border-b border-gray-100 dark:border-slate-800">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Messages</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search people..."
                            className="w-full bg-gray-50 dark:bg-slate-800 pl-10 pr-4 py-2 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white placeholder-gray-400"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {otherUsers.map(u => {
                        const convoId = getConversationId(user.id, u.id);
                        const convo = allConversations.find(c => c.id === convoId);
                        const lastMsg = convo?.messages?.[convo.messages.length - 1];
                        const unreadCount = convo?.messages?.filter(m => m.senderId !== user.id && !m.read).length || 0;

                        return (
                            <div
                                key={u.id}
                                onClick={() => setSelectedUser(u)}
                                className={cn(
                                    "p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors",
                                    selectedUser?.id === u.id && "bg-indigo-50 dark:bg-indigo-900/10 border-r-4 border-indigo-600"
                                )}
                            >
                                <div className="relative">
                                    <img src={u.avatar} alt={u.name} className="h-10 w-10 rounded-full object-cover" />
                                    <span className={cn("absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-slate-900", "bg-green-500")} />
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <div className="flex justify-between items-center mb-0.5">
                                        <h3 className={cn("text-sm truncate", unreadCount > 0 ? "font-bold text-gray-900 dark:text-white" : "font-semibold text-gray-700 dark:text-gray-200")}>{u.name}</h3>
                                        <span className="text-xs text-gray-400">{lastMsg?.time || '10:30 AM'}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p className={cn("text-xs truncate max-w-[140px]", unreadCount > 0 ? "font-semibold text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400")}>
                                            {lastMsg ? (lastMsg.senderId === user.id ? `You: ${lastMsg.text}` : lastMsg.text) : u.role}
                                        </p>
                                        {unreadCount > 0 && (
                                            <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                                                {unreadCount}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Chat Window */}
            <div className="flex-1 flex flex-col bg-gray-50/50 dark:bg-slate-950/50">
                {selectedUser ? (
                    <>
                        <header className="p-4 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center shadow-sm z-10">
                            <div className="flex items-center gap-3">
                                <img src={selectedUser.avatar} alt={selectedUser.name} className="h-10 w-10 rounded-full" />
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white">{selectedUser.name}</h3>
                                    <p className="text-xs text-green-500 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Online
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                                <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition"><Phone size={20} /></button>
                                <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition"><Video size={20} /></button>
                                <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition"><MoreVertical size={20} /></button>
                            </div>
                        </header>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                            {activeMessages.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                    <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                        <Send className="text-indigo-400" size={24} />
                                    </div>
                                    <p>Start conversation with {selectedUser.name}</p>
                                </div>
                            ) : (
                                activeMessages.map((msg, index) => {
                                    const isMe = msg.senderId === user.id;
                                    return (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            key={msg.id || index}
                                            className={cn("flex", isMe ? "justify-end" : "justify-start")}
                                        >
                                            <div className={cn(
                                                "max-w-[70%] p-3 rounded-2xl shadow-sm text-sm",
                                                isMe
                                                    ? "bg-indigo-600 text-white rounded-br-none"
                                                    : "bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 rounded-bl-none border border-gray-100 dark:border-slate-700"
                                            )}>
                                                <p>{msg.text}</p>
                                                <p className={cn("text-[10px] mt-1 text-right", isMe ? "text-indigo-200" : "text-gray-400")}>
                                                    {msg.time}
                                                    {isMe && (
                                                        <span className="ml-1 opacity-70">
                                                            {msg.read ? "✓✓" : "✓"}
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                        </motion.div>
                                    );
                                })
                            )}
                        </div>

                        <div className="p-4 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800">
                            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                                <button type="button" className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition">
                                    <Paperclip size={20} />
                                </button>
                                <input
                                    type="text"
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-gray-50 dark:bg-slate-800 px-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white placeholder-gray-400"
                                />
                                <button
                                    type="submit"
                                    className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/30"
                                >
                                    <Send size={18} />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                        <div className="w-64 h-64 bg-slate-100 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-6 animate-pulse">
                            <MessageSquare className="w-32 h-32 text-indigo-200 dark:text-slate-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Select a conversation</h3>
                        <p>Choose a team member from the sidebar to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Messages;

