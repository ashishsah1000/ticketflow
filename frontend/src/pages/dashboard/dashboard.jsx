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
        <div className="min-h-screen bg-slate-50 p-6 md:p-12 w-full">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Dashboard Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                            Welcome back, {user?.firstname || 'Customer'}!
                        </h1>
                        <p className="text-slate-500 mt-2 text-sm md:text-base">
                            Manage your support tickets, track resolutions, and request new assistance.
                        </p>
                    </div>
                </div>

                {/* Navigation Pills */}
                <div className="flex justify-center md:justify-start gap-4">
                    <button
                        onClick={() => setActiveTab('list')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-200 shadow-sm ${activeTab === 'list'
                            ? 'bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700'
                            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                            }`}
                    >
                        <FaTicketAlt className={activeTab === 'list' ? 'text-blue-100' : 'text-slate-400'} />
                        My Tickets
                    </button>
                    <button
                        onClick={() => setActiveTab('new')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-200 shadow-sm ${activeTab === 'new'
                            ? 'bg-emerald-600 text-white shadow-emerald-200 hover:bg-emerald-700'
                            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                            }`}
                    >
                        <FaPlusCircle className={activeTab === 'new' ? 'text-emerald-100' : 'text-slate-400'} />
                        New Request
                    </button>
                </div>

                {/* Content Area */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 min-h-[500px] ">
                    {activeTab === 'list' ? (
                        <div className="animate-in fade-in duration-300">
                            <IssueList />
                        </div>
                    ) : (
                        <div className="animate-in fade-in duration-300 max-w-3xl mx-auto">
                            <IssueForm onSuccess={() => setActiveTab('list')} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
