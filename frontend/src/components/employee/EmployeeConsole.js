import React from 'react';

const EmployeeConsole = () => {
  const handleProcessClose = (ticketId) => {
    alert(`Ticket ${ticketId} processed and closed successfully!`);
  };

  return (
    <div className="space-y-6">
      <div className="alert alert-info bg-blue-50 border-blue-100 text-blue-800 flex items-start gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <h3 className="font-bold text-sm">Employee Queue Portal</h3>
          <p className="text-xs opacity-90">Track customer issues, post resolution logs, and mark tickets as closed.</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">My Active Queue</span>
          <span className="badge badge-warning text-white py-2 px-3 font-bold text-xs">3 Attention Required</span>
        </div>

        <div className="card bg-base-50 border border-base-200">
          <div className="card-body p-5 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-base-200/80 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-slate-900">#TK-90412</span>
                  <span className="badge badge-error text-white font-bold text-[10px]">High Urgency</span>
                </div>
                <p className="text-slate-700 text-sm">"Router firmware fails to connect after 2.4.1 patch."</p>
                <p className="text-xs text-slate-400 mt-1">Submitted by: alice@example.com • 2 hours ago</p>
              </div>
              <div>
                <button
                  onClick={() => handleProcessClose('#TK-90412')}
                  className="btn btn-sm btn-primary bg-blue-600 hover:bg-blue-500 border-none text-white cursor-pointer"
                >
                  Process & Close
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-slate-900">#TK-89421</span>
                  <span className="badge badge-ghost font-bold text-[10px]">Normal Urgency</span>
                </div>
                <p className="text-slate-700 text-sm">"Requested hardware warranty extension form link."</p>
                <p className="text-xs text-slate-400 mt-1">Submitted by: bob@example.com • Yesterday</p>
              </div>
              <div>
                <button
                  onClick={() => handleProcessClose('#TK-89421')}
                  className="btn btn-sm btn-primary bg-blue-600 hover:bg-blue-500 border-none text-white cursor-pointer"
                >
                  Process & Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeConsole;
