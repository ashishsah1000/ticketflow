import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { IssueList } from '../../features/issues/IssueList';
import { IssueForm } from '../../features/forms/IssueForm';
import EmployeeDashboard from './EmployeeDashboard';
import { ManagerConsole } from '../../components';
import { FaTicketAlt, FaPlusCircle } from 'react-icons/fa';

export const Dashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('list');

    const isEmployee = user?.roles?.includes('employee') || user?.admin;
    const isManager = user?.roles?.includes('manager') || user?.admin;

    if (isEmployee) return <EmployeeDashboard />;
    if (isManager) return <ManagerConsole />;

    return (
        <div className="min-h-screen bg-[#f8fafc] w-full pb-20">
            {/* Top accent bar */}
            <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

            <div className="max-w-7xl mx-auto space-y-8 px-6 md:px-12 pt-10">

                {/* Premium Dashboard Header */}
                <div className="relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between bg-gradient-to-br from-blue-900 to-indigo-900 p-10 md:p-12 rounded-[2rem] shadow-2xl shadow-blue-900/20 text-white">
                    {/* Decorative blobs */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none transition-transform duration-1000 hover:scale-110"></div>
                    <div className="absolute bottom-0 left-10 w-64 h-64 bg-blue-500 opacity-20 rounded-full blur-3xl -mb-20 pointer-events-none"></div>

                    <div className="relative z-10 w-full">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 w-full">
                            <div>
                                <span className="inline-block px-3 py-1 mb-4 rounded-full bg-blue-800/50 border border-blue-700/50 text-blue-200 text-xs font-bold uppercase tracking-widest backdrop-blur-sm">
                                    Customer Dashboard
                                </span>
                                <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
                                    Welcome back, {user?.firstname || 'Customer'}!
                                </h1>
                                <p className="text-blue-100/80 text-base md:text-lg max-w-2xl font-medium leading-relaxed">

                                    Manage your support tickets, track real-time resolutions, and request new assistance seamlessly.
                                </p>
                                <p className='text-blue-400 text-sm'>Sorry for the issue you faced with our products. </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sleek Navigation Tabs */}
                <div className="flex justify-center md:justify-start pt-2">
                    <div className="inline-flex bg-white/80 backdrop-blur-xl p-1.5 rounded-[1.25rem] shadow-sm border border-slate-200/80">
                        <button
                            onClick={() => setActiveTab('list')}
                            className={`flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${activeTab === 'list'
                                ? 'bg-white text-blue-700 shadow-sm border border-slate-100 scale-100'
                                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50 scale-95 opacity-80 hover:opacity-100'
                                }`}
                        >
                            <FaTicketAlt className={`text-lg ${activeTab === 'list' ? 'text-blue-500' : 'text-slate-400'}`} />
                            My Tickets
                        </button>
                        <button
                            onClick={() => setActiveTab('new')}
                            className={`flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${activeTab === 'new'
                                ? 'bg-white text-emerald-700 shadow-sm border border-slate-100 scale-100'
                                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50 scale-95 opacity-80 hover:opacity-100'
                                }`}
                        >
                            <FaPlusCircle className={`text-lg ${activeTab === 'new' ? 'text-emerald-500' : 'text-slate-400'}`} />
                            New Request
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="min-h-[600px]">
                    {activeTab === 'list' ? (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {/* IssueList is already styled nicely, we just render it */}
                            <IssueList />
                        </div>
                    ) : (
                        <div className="animate-in fade-in zoom-in-95 duration-500 max-w-4xl mx-auto mt-6">
                            <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-12 relative overflow-hidden">
                                {/* Form decorative background */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-60 -mr-20 -mt-20 pointer-events-none"></div>
                                <div className="relative z-10">
                                    <div className="mb-8 border-b border-slate-100 pb-6">
                                        <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Create a New Ticket</h2>
                                        <p className="text-slate-500 mt-2 font-medium">Please provide the details of your issue below, and our team will assist you shortly.</p>
                                    </div>
                                    <IssueForm onSuccess={() => setActiveTab('list')} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
