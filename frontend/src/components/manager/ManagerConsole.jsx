import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { BACKEND_URL } from '../../constant';
import { IssueCard } from '../../features/issues/IssueCard';

export const ManagerConsole = () => {
  const { token } = useAuth();
  const [issues, setIssues] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIssues(statusFilter);
  }, [token, statusFilter]);

  const fetchIssues = async (status) => {
    try {
      setLoading(true);
      const url = new URL(`${BACKEND_URL}/issues/all`);
      if (status) {
        url.searchParams.append('status', status);
      }
      const response = await fetch(url.toString(), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setIssues(data);
      } else {
        toast.error('Failed to load issues');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  // Compute basic stats from issues
  const totalIssues = issues.length;
  const processingIssues = issues.filter(i => i.status === 'processing').length;
  const closedIssues = issues.filter(i => i.status === 'closed').length;
  const activeIssues = issues.filter(i => i.status === 'raised').length;

  return (
    <div className="space-y-6 px-12 mt-4">
      {/* Informational Alert */}
      <div className="alert alert-success bg-emerald-50 border-emerald-100 text-emerald-800 flex items-start gap-3 shadow-sm rounded-xl">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <h3 className="font-bold text-sm">Manager Oversight Active</h3>
          <p className="text-xs opacity-90">Review all system tickets, monitor SLA performance, and audit action timelines.</p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats stats-vertical lg:stats-horizontal shadow-sm border border-slate-200 w-full bg-base-50 rounded-xl">
        <div className="stat">
          <div className="stat-title text-xs font-bold uppercase tracking-wider text-slate-400">Total Tickets</div>
          <div className="stat-value text-slate-700 text-3xl">{totalIssues}</div>
          <div className="stat-desc text-slate-400 mt-1">Across all statuses</div>
        </div>
        <div className="stat">
          <div className="stat-title text-xs font-bold uppercase tracking-wider text-slate-400">Raised (Active)</div>
          <div className="stat-value text-error text-3xl">{activeIssues}</div>
          <div className="stat-desc text-slate-400 mt-1">Awaiting initial action</div>
        </div>
        <div className="stat">
          <div className="stat-title text-xs font-bold uppercase tracking-wider text-slate-400">In Progress</div>
          <div className="stat-value text-blue-600 text-3xl">{processingIssues}</div>
          <div className="stat-desc text-slate-400 mt-1">Currently being handled</div>
        </div>
        <div className="stat">
          <div className="stat-title text-xs font-bold uppercase tracking-wider text-slate-400">Resolved</div>
          <div className="stat-value text-emerald-600 text-3xl">{closedIssues}</div>
          <div className="stat-desc text-slate-400 mt-1">Successfully closed</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center bg-base-100 p-4 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800">Global Ticket Overview</h2>
        <div className="flex items-center gap-3">
          <label className="font-semibold text-xs text-slate-500 uppercase tracking-wide">Filter Status:</label>
          <select
            className="select select-bordered select-sm w-48 font-medium text-slate-700"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Issues</option>
            <option value="raised">Raised</option>
            <option value="processing">Processing</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Issue Grid */}
      {loading ? (
        <div className="flex justify-center p-12">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : issues.length === 0 ? (
        <div className="text-center p-12 bg-base-100 rounded-xl border border-slate-200">
          <p className="text-gray-500">No issues found matching the criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {issues.map(issue => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ManagerConsole;
