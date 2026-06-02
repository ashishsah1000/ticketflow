import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BACKEND_URL } from '../../constant';
import { toast } from 'react-hot-toast';
import { FaPhone, FaEnvelope, FaArrowLeft, FaCopy } from 'react-icons/fa';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export const IssueDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const isManager = user?.roles?.includes('manager') || user?.admin;

  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [graphData, setGraphData] = useState([]);

  // React Flow state
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    fetchData();
  }, [id, token]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [issueRes, activitiesRes] = await Promise.all([
        fetch(`${BACKEND_URL}/issues/${id}`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${BACKEND_URL}/issues/${id}/activities`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      if (!issueRes.ok) throw new Error('Failed to fetch issue details');
      const issueData = await issueRes.json();
      const activitiesData = await activitiesRes.json();

      setIssue(issueData);
      buildFlowGraph(issueData, activitiesData);
      buildGraphData(issueData, activitiesData);
    } catch (err) {
      toast.error('Error loading issue details');
    } finally {
      setLoading(false);
    }
  };

  const buildGraphData = (issueData, activities) => {
    const startTime = new Date(issueData.created_at).getTime();

    const data = activities.map(act => {
      const actTime = new Date(act.created_at).getTime();
      const hoursElapsed = (actTime - startTime) / (1000 * 60 * 60);
      return {
        name: act.activity_type,
        time: parseFloat(hoursElapsed.toFixed(2)),
        label: new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    });

    // Add the initial Raised event as 0
    data.unshift({
      name: 'raised',
      time: 0,
      label: new Date(issueData.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    setGraphData(data);
  };

  const buildFlowGraph = (issueData, activities) => {
    const newNodes = [];
    const newEdges = [];

    // Base position config
    const startX = 250;
    let currentY = 50;
    const ySpacing = 150;

    const createNode = (id, label, subtext, type = 'default', style = {}) => {
      const node = {
        id,
        position: { x: startX, y: currentY },
        data: {
          label: (
            <div className="flex flex-col items-center p-2">
              <span className="font-bold text-sm">{label}</span>
              <span className="text-xs text-gray-500 mt-1">{subtext}</span>
            </div>
          )
        },
        type,
        style: {
          width: 250,
          borderRadius: '8px',
          border: '2px solid #e5e7eb',
          backgroundColor: '#ffffff',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          ...style
        }
      };
      currentY += ySpacing;
      return node;
    };

    // 1. Initial Node (Raised)
    newNodes.push(
      createNode(
        'node-raised',
        'Issue Raised',
        new Date(issueData.created_at).toLocaleString(),
        'input',
        { borderColor: '#3b82f6' }
      )
    );

    // 2. Activity Nodes
    let prevId = 'node-raised';

    activities.forEach((act, index) => {
      const nodeId = `node-act-${act.id}`;
      let borderColor = '#e5e7eb';
      if (act.activity_type === 'call') borderColor = '#10b981'; // Green
      if (act.activity_type === 'mail') borderColor = '#8b5cf6'; // Purple
      if (act.activity_type === 'status_change') borderColor = '#f59e0b'; // Amber

      newNodes.push(
        createNode(
          nodeId,
          act.details,
          new Date(act.created_at).toLocaleString(),
          'default',
          { borderColor }
        )
      );

      // Edge
      newEdges.push({
        id: `edge-${prevId}-${nodeId}`,
        source: prevId,
        target: nodeId,
        animated: true,
        markerEnd: { type: MarkerType.ArrowClosed, color: '#9ca3af' },
        style: { stroke: '#9ca3af', strokeWidth: 2 }
      });

      prevId = nodeId;
    });

    // Mark the last node as 'output' type to remove bottom handle
    if (newNodes.length > 0) {
      newNodes[newNodes.length - 1].type = 'output';
    }

    setNodes(newNodes);
    setEdges(newEdges);
  };

  const handleAction = async (actionType) => {
    try {
      const details = actionType === 'call' ? 'Called Customer' : 'Mailed Customer';
      const res = await fetch(`${BACKEND_URL}/issues/${id}/activities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ type: actionType, details })
      });
      if (res.ok) {
        toast.success(`${actionType === 'call' ? 'Call' : 'Mail'} logged successfully!`);
        fetchData(); // refresh
      }
    } catch (e) {
      toast.error('Failed to log action');
    }
  };

  const handleUpdate = async (field, value) => {
    try {
      const res = await fetch(`${BACKEND_URL}/issues/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ [field]: value })
      });
      if (res.ok) {
        toast.success(`${field} updated successfully!`);
        fetchData();
      }
    } catch (e) {
      toast.error('Failed to update issue');
    }
  };

  if (loading || !issue) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col xl:flex-row bg-slate-50 p-4 md:p-6 lg:p-8 gap-6">
      {/* Left Side (Details & Controls) */}
      <div className="w-full xl:w-[45%] flex flex-col gap-6">
        
        {/* Main Details Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden flex flex-col">

        {/* Header Section */}
        <div className="bg-white p-6 md:p-8 border-b border-slate-100">
          <div className="flex items-start md:items-center justify-between gap-4 flex-col md:flex-row mb-6">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/dashboard')} className="btn btn-circle btn-sm bg-slate-100 hover:bg-slate-200 border-none shadow-none">
                <FaArrowLeft className="text-slate-600" />
              </button>
              <div>
                <h1 className="text-2xl font-black text-slate-800 tracking-tight line-clamp-1">
                  {issue.device || issue.issue_with_device}
                </h1>
                {issue.tokenId && (
                  <div className="flex items-center gap-2 mt-1.5 text-sm font-medium text-slate-500">
                    <span>Token ID:</span>
                    <span 
                      className="font-mono bg-blue-50 text-blue-600 px-2 py-0.5 rounded cursor-pointer hover:bg-blue-100 transition-colors flex items-center gap-1.5"
                      onClick={() => {
                        navigator.clipboard.writeText(issue.tokenId);
                        toast.success('Token ID copied!');
                      }}
                      title="Copy Token ID"
                    >
                      #{issue.tokenId} <FaCopy className="text-xs" />
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => handleAction('call')} className="btn flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200 hover:border-emerald-300 shadow-sm transition-all rounded-xl">
              <FaPhone /> Log Call
            </button>
            <button onClick={() => handleAction('mail')} className="btn flex-1 bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200 hover:border-purple-300 shadow-sm transition-all rounded-xl">
              <FaEnvelope /> Log Mail
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 space-y-8 bg-slate-50/30">

          {/* Customer & Issue Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
                Customer Details
              </h3>
              <div className="space-y-3 text-sm text-slate-700">
                <div className="flex justify-between items-center"><span className="text-slate-400 font-medium">Name</span> <span className="font-bold text-slate-800">{issue.user?.firstname} {issue.user?.lastname}</span></div>
                <div className="flex justify-between items-center"><span className="text-slate-400 font-medium">Email</span> <span className="font-bold text-slate-800 truncate ml-4" title={issue.user?.email}>{issue.user?.email}</span></div>
                <div className="flex justify-between items-center"><span className="text-slate-400 font-medium">Phone</span> <span className="font-bold text-slate-800">{issue.user?.phone}</span></div>
              </div>
              
              {isManager && issue.user?.status !== 'disabled' && (
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <button 
                    onClick={async () => {
                      if (window.confirm('Are you sure you want to block this user from creating new issues?')) {
                        try {
                          const res = await fetch(`${BACKEND_URL}/issues/${id}/block-user`, {
                            method: 'PATCH',
                            headers: { 'Authorization': `Bearer ${token}` }
                          });
                          if (res.ok) {
                            toast.success('User blocked successfully!');
                            fetchData();
                          } else {
                            toast.error('Failed to block user');
                          }
                        } catch (e) {
                          toast.error('Error blocking user');
                        }
                      }
                    }}
                    className="btn btn-sm w-full bg-rose-50 hover:bg-rose-100 text-rose-600 border-none shadow-none font-bold rounded-xl"
                  >
                    Block User
                  </button>
                </div>
              )}
              {issue.user?.status === 'disabled' && (
                <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col gap-3">
                  <div className="flex items-center justify-center bg-rose-50 text-rose-600 font-bold text-xs uppercase tracking-wide py-2 rounded-lg border border-rose-100">
                    Account Blocked
                  </div>
                  {isManager && (
                    <button 
                      onClick={async () => {
                        if (window.confirm('Are you sure you want to unblock this user?')) {
                          try {
                            const res = await fetch(`${BACKEND_URL}/issues/${id}/unblock-user`, {
                              method: 'PATCH',
                              headers: { 'Authorization': `Bearer ${token}` }
                            });
                            if (res.ok) {
                              toast.success('User unblocked successfully!');
                              fetchData();
                            } else {
                              toast.error('Failed to unblock user');
                            }
                          } catch (e) {
                            toast.error('Error unblocking user');
                          }
                        }
                      }}
                      className="btn btn-sm w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-none shadow-none font-bold rounded-xl"
                    >
                      Unblock User
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
                Issue Summary
              </h3>
              <p className="text-sm font-bold text-slate-800 mb-2">{issue.device}</p>
              <p className="text-sm text-slate-600 flex-grow leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 overflow-y-auto max-h-[120px]">
                {issue.issue_with_device}
              </p>
            </div>
          </div>
        </div>
        </div>

        {/* Resolution Controls Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-6 md:p-8">
          <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
            Resolution Controls
          </h3>

          <div className="space-y-5">
            <div className="form-control w-full">
              <label className="label py-1">
                <span className="label-text font-bold text-slate-600 text-xs uppercase tracking-wider">Current Status</span>
              </label>
              <select
                className="select w-full bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl font-semibold text-slate-700"
                value={issue.status}
                onChange={(e) => handleUpdate('status', e.target.value)}
              >
                <option value="raised">Raised</option>
                <option value="processing">Processing</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div className="form-control w-full">
              <label className="label py-1">
                <span className="label-text font-bold text-slate-600 text-xs uppercase tracking-wider">Resolution Action</span>
              </label>
              <select
                className="select w-full bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl font-semibold text-slate-700"
                value={issue.action || ''}
                onChange={(e) => handleUpdate('action', e.target.value)}
              >
                <option value="" disabled>Select Action Taken</option>
                <option value="refunded">Refunded</option>
                <option value="replacement">Replacement</option>
                <option value="repair">Repair</option>
              </select>
            </div>

            <div className="form-control w-full">
              <label className="label py-1">
                <span className="label-text font-bold text-slate-600 text-xs uppercase tracking-wider">Escalation Level</span>
              </label>
              <select
                className="select w-full bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl font-semibold text-slate-700"
                value={issue.escalation}
                onChange={(e) => handleUpdate('escalation', parseInt(e.target.value))}
              >
                {[1, 2, 3, 4, 5].map(lvl => (
                  <option key={lvl} value={lvl}>Level {lvl} {lvl === 5 ? '(Critical)' : ''}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side (React Flow & Graph) */}
      <div className="w-full xl:w-[55%] flex flex-col gap-6">
        {isManager && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-6 flex flex-col shrink-0 min-h-[300px]">
            <div className="mb-4">
              <h3 className="font-black text-slate-800 text-lg">SLA Tracking</h3>
              <p className="text-sm text-slate-500 mt-1">Elapsed Hours since Raised vs Action</p>
            </div>
            <div className="flex-grow w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={graphData} margin={{ top: 10, right: 20, bottom: 5, left: -20 }}>
                  <Line type="monotone" dataKey="time" stroke="#3b82f6" strokeWidth={3} activeDot={{ r: 8, fill: '#1d4ed8', stroke: '#fff', strokeWidth: 2 }} />
                  <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} dy={10} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748b' }} tickLine={false} axisLine={false} dx={-10} />
                  <Tooltip
                    formatter={(value) => [`${value} hrs`, 'Elapsed Time']}
                    labelFormatter={(label) => `Action: ${label}`}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        <div className="flex-grow bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden relative min-h-[500px]">
          <div className="absolute top-6 left-6 z-10 bg-white/95 backdrop-blur shadow-sm border border-slate-100 rounded-xl px-5 py-3 flex items-center gap-3">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </div>
            <h3 className="font-bold text-slate-800 tracking-wide text-sm uppercase">Activity Timeline</h3>
          </div>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView
            fitViewOptions={{ padding: 0.5 }}
            className="bg-slate-50/50"
          >
            <Background color="#cbd5e1" gap={24} size={2} />
            <Controls className="bg-white border-slate-200 shadow-sm rounded-xl overflow-hidden" />
            <MiniMap nodeStrokeWidth={3} maskColor="rgba(248, 250, 252, 0.7)" className="bg-white border-slate-200 shadow-sm rounded-xl overflow-hidden" />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
};

export default IssueDetail;
