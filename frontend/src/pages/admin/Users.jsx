import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BACKEND_URL } from '../../constant';
import toast from 'react-hot-toast';

const ALL_ROLES = ['customer', 'employee', 'manager'];

const Users = () => {
  const { user, token, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Authorization check
  useEffect(() => {
    if (!authLoading && (!user || !user.admin)) {
      toast.error('Access Denied: Super Admin Privileges Required');
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_URL}/admin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.admin) {
      fetchUsers();
    }
  }, [user]);

  const handleRoleChange = async (userId, newRoleStr) => {
    const roles = newRoleStr ? [newRoleStr] : []; // Keep it simple: one main role per user selected via dropdown
    
    try {
      const res = await fetch(`${BACKEND_URL}/admin/users/${userId}/roles`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ roles })
      });
      
      if (!res.ok) {
        throw new Error('Failed to update user role');
      }
      
      toast.success('Role updated successfully!');
      
      // Update local state
      setUsers(users.map(u => {
        if (u.id === userId) {
          return { ...u, roles: roles.map(r => ({ role: r })) };
        }
        return u;
      }));
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (authLoading || (!user?.admin && !authLoading)) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="max-w-7xl mx-auto w-full px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">User Management</h1>
        <p className="text-slate-500 mt-2">Manage platform users and access control roles.</p>
      </div>

      <div className="card bg-base-100 border border-base-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center p-12">
            <span className="loading loading-spinner loading-lg text-blue-600"></span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th>User</th>
                  <th>Contact</th>
                  <th>Status</th>
                  <th>Current Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const currentRole = u.roles && u.roles.length > 0 ? u.roles[0].role : '';
                  return (
                    <tr key={u.id} className="hover">
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar placeholder">
                            <div className="bg-blue-100 text-blue-600 rounded-full w-10 h-10 font-bold">
                              <span>{u.firstname.charAt(0)}</span>
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">{u.firstname} {u.lastname}</div>
                            {u.admin && <span className="badge badge-primary badge-xs mt-1">Super Admin</span>}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="text-sm">{u.email}</div>
                        <div className="text-xs text-slate-500">{u.phone}</div>
                      </td>
                      <td>
                        <span className={`badge badge-sm ${u.status === 'ACTIVE' ? 'badge-success text-white' : 'badge-ghost'}`}>
                          {u.status}
                        </span>
                      </td>
                      <td>
                        <span className="font-semibold text-slate-700 capitalize">
                          {currentRole || 'Customer'}
                        </span>
                      </td>
                      <td>
                        <select 
                          className="select select-bordered select-sm w-full max-w-xs focus:outline-none"
                          value={currentRole}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        >
                          <option value="">Customer (Default)</option>
                          {ALL_ROLES.filter(r => r !== 'customer').map(role => (
                            <option key={role} value={role}>
                              {role.charAt(0).toUpperCase() + role.slice(1)}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
