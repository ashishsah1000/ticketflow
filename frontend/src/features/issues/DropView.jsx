import React from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';

const getPendingText = (dateString) => {
  const diffTime = Math.abs(new Date() - new Date(dateString));
  const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Created today';
  return `${days} day${days > 1 ? 's' : ''} pending`;
};

const KanbanCard = ({ issue, onDragStart }) => {
  const isHighPriority = issue.escalation >= 4;
  const isClosed = issue.status === 'closed';
  const isProcessing = issue.status === 'processing';
  
  const accentColorClass = isClosed ? 'bg-emerald-500' : isProcessing ? 'bg-blue-500' : 'bg-amber-500';
  const lightBgClass = isClosed ? 'bg-emerald-50' : isProcessing ? 'bg-blue-50' : 'bg-amber-50';
  const textClass = isClosed ? 'text-emerald-700' : isProcessing ? 'text-blue-700' : 'text-amber-700';

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, issue.id)}
      className="relative bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-lg hover:-translate-y-1 hover:border-slate-300 transition-all duration-200 cursor-move mb-3 group overflow-hidden"
    >
      {/* Left Accent Bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${accentColorClass} transition-transform origin-left group-hover:scale-x-150`}></div>
      
      <div className="p-4 pl-5">
        <div className="flex justify-between items-start gap-2 mb-2">
          <Link to={`/issue/${issue.id}`} className="hover:text-blue-600 font-bold text-sm text-slate-800 line-clamp-2 leading-snug transition-colors">
            {issue.device || issue.issue_with_device}
          </Link>
          
          {issue.escalation > 1 && (
            <span className={`shrink-0 flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${
              isHighPriority ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
            }`}>
              {isHighPriority && <FaExclamationTriangle className="w-2 h-2" />}
              Lvl {issue.escalation}
            </span>
          )}
        </div>
        
        {issue.user && (
          <div className="text-xs text-slate-500 mb-3 truncate flex items-center gap-1.5 font-medium">
             <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${lightBgClass} ${textClass}`}>
               {issue.user.firstname?.charAt(0)}
             </div>
            {issue.user.firstname} {issue.user.lastname}
          </div>
        )}
        
        <div className="text-[11px] text-slate-400 mt-auto flex justify-between items-center pt-2 border-t border-slate-100">
          <span className="font-mono bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-medium">
            {issue.tokenId ? `#${issue.tokenId}` : 'No Token'}
          </span>
          <span className="font-medium">{getPendingText(issue.created_at)}</span>
        </div>
      </div>
    </div>
  );
};

export const DropView = ({ issues, onStatusChange }) => {
  const handleDragStart = (e, issueId) => {
    e.dataTransfer.setData('issueId', issueId);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    const issueId = e.dataTransfer.getData('issueId');
    if (issueId && onStatusChange) {
      onStatusChange(issueId, newStatus);
    }
  };

  // Group issues
  const grouped = {
    raised: issues.filter(i => i.status === 'raised').sort((a, b) => new Date(a.created_at) - new Date(b.created_at)),
    processing: issues.filter(i => i.status === 'processing').sort((a, b) => new Date(a.created_at) - new Date(b.created_at)),
    closed: issues.filter(i => i.status === 'closed').sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
  };

  const Column = ({ title, status, items, dotColorClass, bgPillClass, textPillClass }) => (
    <div 
      className="flex flex-col bg-slate-50/70 rounded-2xl p-4 min-h-[500px] border border-slate-200"
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, status)}
    >
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
           <div className={`w-2.5 h-2.5 rounded-full ${dotColorClass} shadow-sm`}></div>
           <h3 className="font-bold text-slate-700 tracking-wide text-sm">{title}</h3>
        </div>
        <span className={`${bgPillClass} ${textPillClass} px-2.5 py-0.5 rounded-full text-xs font-black shadow-sm border border-white/50`}>
          {items.length}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto pb-4">
        {items.map(issue => (
          <KanbanCard key={issue.id} issue={issue} onDragStart={handleDragStart} />
        ))}
        {items.length === 0 && (
          <div className="text-center flex flex-col items-center justify-center p-8 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl text-sm mt-2 h-32 bg-slate-100/50">
            No issues
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Column 
        title="Raised" 
        status="raised" 
        items={grouped.raised} 
        dotColorClass="bg-amber-400"
        bgPillClass="bg-amber-100"
        textPillClass="text-amber-700"
      />
      <Column 
        title="In Progress" 
        status="processing" 
        items={grouped.processing} 
        dotColorClass="bg-blue-400"
        bgPillClass="bg-blue-100"
        textPillClass="text-blue-700"
      />
      <Column 
        title="Closed" 
        status="closed" 
        items={grouped.closed} 
        dotColorClass="bg-emerald-400"
        bgPillClass="bg-emerald-100"
        textPillClass="text-emerald-700"
      />
    </div>
  );
};
