import React, { useState, useRef, useEffect } from 'react';
import { FaComments, FaTimes, FaRobot, FaUser, FaPaperPlane } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { BACKEND_URL } from '../../constant';

const renderText = (text) => {
    if (!text) return null;
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={index} className="font-bold">{part.slice(2, -2)}</strong>;
        }
        return part;
    });
};

export const ChatWidget = () => {
    const { token, user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'bot', text: 'Hello! I am your AI Support Assistant. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // If user is not authenticated or lacks token, don't show the widget
    if (!token) return null;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e?.preventDefault();
        if (!input.trim()) return;

        const userMessage = input.trim();
        setMessages((prev) => [...prev, { role: 'user', text: userMessage }]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch(`${BACKEND_URL}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ message: userMessage })
            });

            if (response.ok) {
                const data = await response.json();
                setMessages((prev) => [...prev, { role: 'bot', text: data.response }]);
            } else {
                setMessages((prev) => [...prev, { role: 'bot', text: 'Sorry, I am having trouble connecting to the server. Please try again later.' }]);
            }
        } catch (error) {
            setMessages((prev) => [...prev, { role: 'bot', text: 'Sorry, a network error occurred.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-[350px] sm:w-[400px] h-[500px] max-h-[80vh] flex flex-col bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-slate-200/50 overflow-hidden transform transition-all animate-in slide-in-from-bottom-8 fade-in duration-300 origin-bottom-right">

                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white flex justify-between items-center shadow-md shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/30 shadow-inner">
                                <FaRobot className="text-xl" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm tracking-wide">TFlow Bot</h3>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                                    <span className="text-xs text-blue-100 opacity-90">Online</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-blue-100 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors focus:outline-none"
                            aria-label="Close Chat"
                        >
                            <FaTimes />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 scroll-smooth">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    {/* Avatar */}
                                    <div className="flex-shrink-0 mt-1">
                                        {msg.role === 'user' ? (
                                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 shadow-sm border border-slate-300">
                                                <FaUser className="w-3 h-3" />
                                            </div>
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm border border-blue-200">
                                                <FaRobot className="w-4 h-4" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Message Bubble */}
                                    <div className={`px-4 py-2.5 rounded-2xl shadow-sm ${msg.role === 'user'
                                        ? 'bg-blue-600 text-white rounded-tr-none'
                                        : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                                        }`}>
                                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{renderText(msg.text)}</p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="flex gap-2 max-w-[85%] flex-row">
                                    <div className="flex-shrink-0 mt-1">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm border border-blue-200">
                                            <FaRobot className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <div className="px-4 py-3 rounded-2xl bg-white border border-slate-100 rounded-tl-none shadow-sm flex items-center gap-1.5">
                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-white border-t border-slate-100 shrink-0 rounded-b-[2rem]">
                        <form onSubmit={handleSend} className="flex gap-2 items-center">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder-slate-400"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-500/30 shrink-0"
                                aria-label="Send Message"
                            >
                                <FaPaperPlane className="ml-[-2px] mt-[1px]" />
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="group relative w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xl shadow-blue-900/30 hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/30"
                    aria-label="Open Chat"
                >
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-full transition-opacity"></div>
                    <FaComments className="text-2xl relative z-10" />
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
                    </span>
                </button>
            )}
        </div>
    );
};
