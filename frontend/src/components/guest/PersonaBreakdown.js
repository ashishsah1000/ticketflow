import React from 'react';

const PersonaBreakdown = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 text-left max-w-4xl mx-auto">
      <div className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="card-body">
          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm mb-2">
            01
          </div>
          <h3 className="card-title text-slate-900 font-bold">Customers</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Submit tickets explaining problems with products you bought, track logs, and verify support status.
          </p>
        </div>
      </div>

      <div className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="card-body">
          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm mb-2">
            02
          </div>
          <h3 className="card-title text-slate-900 font-bold">Employees</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Access incoming ticket queues, resolve client queries, record support notes, and safely close tickets.
          </p>
        </div>
      </div>

      <div className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="card-body">
          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm mb-2">
            03
          </div>
          <h3 className="card-title text-slate-900 font-bold">Managers</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Monitor active ticket workloads allocated per employee and ensure response metrics stay within SLA targets.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PersonaBreakdown;
