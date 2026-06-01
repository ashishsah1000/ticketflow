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
    <div className="h-screen w-full flex flex-col lg:flex-row bg-base-200 p-4 gap-4 overflow-hidden">
      {/* Left Side (Details & Controls) */}
      <div className="w-full lg:w-1/2 bg-base-100 rounded-xl shadow-md flex flex-col border border-base-300 overflow-y-auto">

        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-base-100/95 backdrop-blur border-b border-base-200 p-6">
          <div className="flex items-center gap-4 mb-4">
            <button onClick={() => navigate('/dashboard')} className="btn btn-circle btn-ghost btn-sm bg-base-200 hover:bg-base-300">
              <FaArrowLeft className="text-slate-600" />
            </button>
            <h1 className="text-2xl font-bold text-slate-800 flex-1 truncate">
              {issue.device || issue.issue_with_device}
            </h1>
            {issue.tokenId && (
              <div
                className="badge badge-primary badge-outline flex items-center gap-2 font-mono text-sm py-3 px-4 shadow-sm cursor-pointer hover:bg-primary/10 transition-colors"
                title="Copy Token ID"
                onClick={() => {
                  navigator.clipboard.writeText(issue.tokenId);
                  toast.success('Token ID copied!');
                }}
              >
                #{issue.tokenId} <FaCopy />
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button onClick={() => handleAction('call')} className="btn btn-success flex-1 text-white shadow-sm hover:shadow-md transition-all">
              <FaPhone /> Log Call
            </button>
            <button onClick={() => handleAction('mail')} className="btn btn-info flex-1 text-white shadow-sm hover:shadow-md transition-all">
              <FaEnvelope /> Log Mail
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-8">

          {/* Customer & Issue Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-800 mb-3 flex items-center gap-2">
                Customer Details
              </h3>
              <div className="space-y-2 text-sm text-slate-700">
                <p className="flex justify-between"><span className="text-slate-500">Name</span> <span className="font-semibold">{issue.user?.firstname} {issue.user?.lastname}</span></p>
                <p className="flex justify-between"><span className="text-slate-500">Email</span> <span className="font-semibold truncate ml-4">{issue.user?.email}</span></p>
                <p className="flex justify-between"><span className="text-slate-500">Phone</span> <span className="font-semibold">{issue.user?.phone}</span></p>
              </div>
            </div>

            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
                Issue Summary
              </h3>
              <p className="text-sm text-slate-700 font-medium mb-2">{issue.device}</p>
              <p className="text-sm text-slate-500 line-clamp-3">{issue.issue_with_device}</p>
            </div>
          </div>

          <div className="divider text-slate-400 text-sm">Resolution Controls</div>

          {/* Controls */}
          <div className="bg-base-100 rounded-xl space-y-4">

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-bold text-slate-700">Current Status</span>
              </label>
              <select
                className="select select-bordered w-full bg-slate-50"
                value={issue.status}
                onChange={(e) => handleUpdate('status', e.target.value)}
              >
                <option value="raised">Raised</option>
                <option value="processing">Processing</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-bold text-slate-700">Resolution Action</span>
              </label>
              <select
                className="select select-bordered w-full bg-slate-50"
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
              <label className="label">
                <span className="label-text font-bold text-slate-700">Escalation Level</span>
                <span className="label-text-alt text-error font-semibold">Priority</span>
              </label>
              <select
                className="select select-bordered w-full bg-slate-50"
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
      <div className="w-full lg:w-1/2 flex flex-col gap-4">
        {isManager && (
          <div className="bg-white rounded-xl shadow-md border border-base-300 p-4 h-64 flex flex-col shrink-0">
            <h3 className="font-bold text-slate-700 mb-2 px-2 flex justify-between items-center">
              <span>SLA Tracking (Time vs Action)</span>
              <span className="text-xs text-slate-400 font-normal">Elapsed Hours since Raised</span>
            </h3>
            <div className="flex-grow w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={graphData} margin={{ top: 15, right: 20, bottom: 5, left: 0 }}>
                  <Line type="monotone" dataKey="time" stroke="#3b82f6" strokeWidth={3} activeDot={{ r: 8, fill: '#1d4ed8' }} />
                  <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} tickLine={false} axisLine={{ stroke: '#cbd5e1' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748b' }} tickLine={false} axisLine={false} />
                  <Tooltip
                    formatter={(value) => [`${value} hrs`, 'Elapsed Time']}
                    labelFormatter={(label) => `Action: ${label}`}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        <div className="flex-grow bg-white rounded-xl shadow-md border border-base-300 overflow-hidden relative min-h-[400px]">
          <h3 className="absolute top-4 left-6 z-10 font-bold text-slate-700 bg-white/90 px-4 py-2 rounded-lg shadow-sm border border-slate-100 backdrop-blur-sm flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            Activity Timeline
          </h3>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView
            fitViewOptions={{ padding: 0.5 }}
            className="bg-slate-50/50"
          >
            <Background color="#cbd5e1" gap={20} size={1.5} />
            <Controls className="bg-white border-slate-200 shadow-sm rounded-lg" />
            <MiniMap nodeStrokeWidth={3} className="bg-white border-slate-200 shadow-sm rounded-lg" />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
};

export default IssueDetail;
