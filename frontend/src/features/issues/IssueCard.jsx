import React from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaCopy } from 'react-icons/fa';

const getDaysSince = (dateString) => {
  const diffTime = Math.abs(new Date() - new Date(dateString));
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
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

  return (
    <Link to={`/issue/${issue.id}`} className="block h-full">
      <div className="card bg-base-100 shadow-xl border-t-4 border-primary hover:shadow-2xl transition h-full flex flex-col">
        <div className="card-body p-5 flex flex-col flex-grow">

          <div className="flex justify-between items-center mb-3">
            {issue.tokenId ? (
              <div className="badge badge-primary badge-outline flex items-center gap-1 font-mono text-xs py-2 px-3 shadow-sm hover:bg-primary/10 transition-colors" title="Copy Token ID" onClick={handleCopy}>
                #{issue.tokenId} <FaCopy className="cursor-pointer" />
              </div>
            ) : (
              <div className="badge badge-ghost text-xs">No Token</div>
            )}
            <div className="flex items-center gap-1">
              <span className={`badge ${issue.status === 'closed' ? 'badge-success' : issue.status === 'processing' ? 'badge-info' : 'badge-warning'}`}>
                {issue.status}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-start mb-2">
            <h3 className="card-title text-lg">{issue.device || issue.issue_with_device}</h3>
            <div className="flex flex-col gap-1 items-end">
              <span className="badge badge-outline badge-sm font-bold text-error">
                lvl : {issue.escalation}
              </span>
            </div>
          </div>

          {issue.user && (
            <div className="bg-base-200 p-3 rounded-lg mb-2 text-sm">
              <p className="font-bold border-b border-base-300 pb-1 mb-1">Customer Details</p>
              <p><span className="font-semibold">Name:</span> {issue.user.firstname} {issue.user.lastname}</p>
              <p><span className="font-semibold">Phone:</span> {issue.user.phone}</p>
              <p><span className="font-semibold">Email:</span> {issue.user.email}</p>
            </div>
          )}

          <p className="text-sm line-clamp-2 text-gray-600 mb-2 flex-grow">{issue.issue_with_device}</p>

          <div className="flex justify-between items-center text-xs text-gray-500 mt-auto pt-3 border-t border-base-200">
            <span>Pending for {getDaysSince(issue.created_at)} day(s)</span>
            <span>Pickup: {new Date(issue.date_for_pickup).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
