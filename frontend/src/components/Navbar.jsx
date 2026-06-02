import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUserTie, FaHeadset, FaUser, FaSignOutAlt, FaCog, FaChartPie, FaUserShield, FaChartLine } from 'react-icons/fa';

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isManager = user?.roles?.includes('manager');
  const isEmployee = user?.roles?.includes('employee');
  const isAdmin = user?.admin;

  const canViewAnalytics = isManager || isAdmin;
  const canViewDashboard = isManager || isEmployee || isAdmin;

  const getRoleBadge = () => {
    if (isAdmin) return { label: 'Admin', icon: <FaUserShield />, color: 'bg-purple-100 text-purple-700' };
    if (isManager) return { label: 'Manager', icon: <FaUserTie />, color: 'bg-emerald-100 text-emerald-700' };
    if (isEmployee) return { label: 'Agent', icon: <FaHeadset />, color: 'bg-blue-100 text-blue-700' };
    return { label: 'Customer', icon: <FaUser />, color: 'bg-slate-100 text-slate-700' };
  };

  const badge = getRoleBadge();

  return (
    <div className="navbar bg-white border-b border-slate-200 sticky top-0 z-50 px-4 sm:px-8 shadow-sm h-16">
      <div className="navbar-start">
        <Link to="/" className="text-2xl font-black tracking-tight text-blue-600 flex items-center gap-2 hover:opacity-90 transition-opacity">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
            <path fillRule="evenodd" d="M11.622 1.602a.75.75 0 01.756 0l2.25 1.313a.75.75 0 01-.756 1.295L12 3.118 10.128 4.21A.75.75 0 119.372 2.91l2.25-1.308zM4.622 5.666a.75.75 0 01.756 0l2.25 1.313a.75.75 0 01-.756 1.295L5 7.182 3.128 8.274A.75.75 0 112.372 6.98l2.25-1.313zM18.622 5.666a.75.75 0 01.756 0l2.25 1.313a.75.75 0 11-.756 1.295L20 7.182l-1.872 1.092a.75.75 0 11-.756-1.295l2.25-1.313zM2.81 12.338a.75.75 0 01.352 1.003L1.516 16.5h10.428a2.25 2.25 0 002.122-1.5l1.64-4.919h5.544a2.25 2.25 0 110 4.5h-1.643l1.838 5.514a.75.75 0 01-.15.756c-.198.225-.494.349-.801.349H1.425a.75.75 0 01-.676-1.077l2.128-4.486-.889-1.54a.75.75 0 01.822-1.26z" clipRule="evenodd" />
          </svg>
          <span className="bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">TicketFlow</span>
        </Link>
      </div>

      <div className="navbar-end gap-3 flex items-center">
        {isAuthenticated ? (
          <div className="flex items-center gap-5">

            {canViewAnalytics && (
              <Link
                to="/manager/analytics"
                className={`hidden md:flex items-center gap-2 font-semibold transition-colors px-3 py-2 rounded-xl ${location.pathname === '/manager/analytics'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                  }`}
              >
                <FaChartLine />

                Analytics
              </Link>
            )}

            {canViewDashboard && (
              <Link
                to="/dashboard"
                className={`hidden sm:flex items-center gap-2 font-semibold transition-colors px-3 py-2 rounded-xl ${location.pathname.startsWith('/dashboard')
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                  }`}
              >
                <FaChartPie />

                Dashboard
              </Link>
            )}


            {/* Role Badge */}
            <div className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${badge.color}`}>
              {badge.icon}
              {badge.label}
            </div>

            {/* Profile Dropdown */}
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar border-2 border-slate-100 hover:border-blue-200 transition-colors">
                <div className="w-10  rounded-full bg-gradient-to-tr from-blue-100 to-blue-50 flex flex-col items-center justify-center text-blue-700 font-black text-lg">
                  <span className='relative top-1'>
                    {user?.firstname?.charAt(0)?.toUpperCase() || user?.name?.charAt(0)?.toUpperCase() || 'U'}

                  </span>
                </div>
              </label>
              <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow-xl menu menu-sm dropdown-content bg-white rounded-xl w-56 border border-slate-100">
                <div className="px-4 py-3 border-b border-slate-100 mb-2">
                  <p className="text-sm font-bold text-slate-800 truncate">{user?.firstname} {user?.lastname}</p>
                  <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                </div>
                {/* 
                <li>
                  <Link to="/profile" className="flex items-center gap-3 text-slate-700 hover:text-blue-600 hover:bg-slate-50 py-2">
                    <FaUser className="text-slate-400" /> My Profile
                  </Link>
                </li>
                <li>
                  <a className="flex items-center gap-3 text-slate-700 hover:text-blue-600 hover:bg-slate-50 py-2">
                    <FaCog className="text-slate-400" /> Settings
                  </a>
                </li> */}

                {isAdmin && (
                  <li>
                    <Link to="/admin/users" className="flex items-center gap-3 text-purple-600 font-bold hover:bg-purple-50 py-2">
                      <FaUserShield className="text-purple-400" /> Admin Panel
                    </Link>
                  </li>
                )}

                <div className="divider my-1"></div>

                <li>
                  <a onClick={handleLogout} className="flex items-center gap-3 text-red-500 font-semibold hover:text-red-600 hover:bg-red-50 py-2">
                    <FaSignOutAlt /> Sign Out
                  </a>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login" className="btn btn-ghost hover:bg-slate-100 text-slate-600 font-semibold px-6 hidden sm:flex rounded-xl">Log In</Link>
            <Link to="/signup" className="btn btn-primary bg-blue-600 hover:bg-blue-700 border-none text-white shadow-md shadow-blue-200 px-6 rounded-xl">Sign Up</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
