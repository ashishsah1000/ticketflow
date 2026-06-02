import React from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaCopy, FaExclamationTriangle, FaPhoneAlt, FaEnvelope, FaCalendarAlt, FaClock } from 'react-icons/fa';

const getPendingText = (dateString) => {
  const diffTime = Math.abs(new Date() - new Date(dateString));
  const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Created today';
  return `${days} day${days > 1 ? 's' : ''} pending`;
};

export const IssueCard = ({ issue }) => {
  const handleCopy = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (issue.tokenId) {
      navigator.clipboard.writeText(issue.tokenId);
      toast.success('Token ID copied!');
    }
  };

  const isHighPriority = issue.escalation >= 4;
  const isClosed = issue.status === 'closed';
  const isProcessing = issue.status === 'processing';

  return (
    <Link to={`/issue/${issue.id}`} className="block h-full group">
      <div className="relative bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 hover:border-blue-200 transition-all duration-300 flex flex-col h-full overflow-hidden">
        
        {/* Decorative background blob */}
        <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-500 opacity-20 ${
          isClosed ? 'bg-emerald-200' : isProcessing ? 'bg-blue-200' : 'bg-amber-200'
        }`}></div>
        
        <div className="relative z-10 flex-grow flex flex-col">
          {/* Header: Token & Status */}
          <div className="flex justify-between items-start mb-4">
            {issue.tokenId ? (
              <button 
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-full text-xs font-mono font-medium transition-colors border border-slate-200 hover:border-blue-300 z-20"
                title="Copy Token ID"
              >
                #{issue.tokenId}
                <FaCopy className="w-3 h-3 opacity-70" />
              </button>
            ) : (
              <span className="px-3 py-1 bg-slate-50 text-slate-400 rounded-full text-xs font-medium border border-slate-100">No Token</span>
            )}
            
            <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold tracking-widest uppercase shadow-sm ${
              isClosed ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 
              isProcessing ? 'bg-blue-100 text-blue-700 border border-blue-200' : 
              'bg-amber-100 text-amber-700 border border-amber-200'
            }`}>
              {issue.status}
            </span>
          </div>

          {/* Main Content: Title & Escalation */}
          <div className="flex justify-between items-start gap-3 mb-2">
            <h3 className="text-lg font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">
              {issue.device || issue.issue_with_device}
            </h3>
            
            {issue.escalation > 1 ? (
              <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black uppercase shrink-0 ${
                isHighPriority ? 'bg-red-100 text-red-600 border border-red-200' : 'bg-orange-100 text-orange-600 border border-orange-200'
              }`}>
                {isHighPriority && <FaExclamationTriangle className="w-2.5 h-2.5" />}
                Lvl {issue.escalation}
              </div>
            ) : (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 bg-slate-100 text-slate-500 border border-slate-200">
                Lvl {issue.escalation}
              </div>
            )}
          </div>

          <p className="text-sm text-slate-600 line-clamp-2 mb-4 flex-grow font-medium leading-relaxed">
            {issue.issue_with_device}
          </p>

          {/* Customer Info (Sleek) */}
          {issue.user && (
            <div className="bg-slate-50 rounded-xl p-3 mb-4 border border-slate-100 group-hover:bg-blue-50/30 transition-colors">
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-200/60">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 flex items-center justify-center text-xs font-bold shadow-sm">
                  {issue.user.firstname?.charAt(0)}
                </div>
                <span className="text-sm font-semibold text-slate-700">
                  {issue.user.firstname} {issue.user.lastname}
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                 <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                   <FaPhoneAlt className="text-slate-400 w-3 h-3" /> {issue.user.phone}
                 </div>
                 <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                   <FaEnvelope className="text-slate-400 w-3 h-3" /> <span className="truncate">{issue.user.email}</span>
                 </div>
              </div>
            </div>
          )}

          {/* Footer Info */}
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium pt-3 border-t border-slate-100 mt-auto">
            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
               <FaClock className="text-slate-400 w-3 h-3" />
               <span>{getPendingText(issue.created_at)}</span>
            </div>
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border font-semibold ${
              isClosed ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-blue-50 text-blue-700 border-blue-100'
            }`}>
               <FaCalendarAlt className={isClosed ? "text-emerald-400 w-3 h-3" : "text-blue-400 w-3 h-3"} />
               <span>Pickup: {new Date(issue.date_for_pickup).toLocaleDateString(undefined, { month: 'short', day: 'numeric'})}</span>
            </div>
          </div>
          
        </div>
      </div>
    </Link>
  );
};

export default IssueCard;
