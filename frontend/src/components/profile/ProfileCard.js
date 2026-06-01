import React from 'react';

const ProfileCard = ({ user, onLogout }) => {
  if (!user) return null;

  return (
    <div className="card bg-base-100 border border-base-200 shadow-sm">
      <div className="card-body sm:flex-row items-center gap-6">
        <div className="avatar placeholder">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-500 text-white font-bold text-3xl shadow-md">
            <span>
              {user.firstname?.[0]?.toUpperCase()}
              {user.lastname?.[0]?.toUpperCase()}
            </span>
          </div>
        </div>
        <div className="space-y-1 flex-1">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Welcome back, {user.firstname}!
          </h1>
          <p className="text-sm text-slate-500">
            Signed in as <span className="font-semibold text-blue-600">{user.email}</span>
          </p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {user.roles && user.roles.length > 0 ? (
              user.roles.map((role, idx) => (
                <span
                  key={idx}
                  className="badge badge-primary bg-blue-50 border-blue-100 text-blue-600 capitalize py-2 px-3 font-semibold text-xs"
                >
                  {role}
                </span>
              ))
            ) : (
              <span className="badge badge-primary bg-blue-50 border-blue-100 text-blue-600 py-2 px-3 font-semibold text-xs">
                Customer
              </span>
            )}
          </div>
        </div>
        <div className="card-actions justify-end">
          <button onClick={onLogout} className="btn btn-outline btn-error btn-sm">
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
