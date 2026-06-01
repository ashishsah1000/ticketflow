import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BACKEND_URL } from '../../constant';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate('/');
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Front-end validations
    if (!formData.email.trim() || !formData.password.trim()) {
      setError('Email and password are required.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(BACKEND_URL + '/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid email or password.');
      }

      const success = login(data.access_token);
      if (success) {
        navigate('/');
      } else {
        throw new Error('Failed to parse token.');
      }
    } catch (err) {
      if (Array.isArray(err.message)) {
        setError(err.message.join(', '));
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-12rem)] w-full py-6 px-4">
      <div className="card w-full max-w-md bg-base-100 border border-base-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full blur-2xl pointer-events-none"></div>

        <div className="card-body p-8 relative z-10">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome back</h1>
            <p className="text-sm text-slate-500 mt-1">Please enter your credentials to log in.</p>
          </div>

          {error && (
            <div className="alert alert-error bg-red-50 border-red-100 text-red-700 text-xs py-3.5 mb-4 flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold text-slate-500 text-xs uppercase tracking-wider">Email Address</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                className="input input-bordered w-full text-slate-800 text-sm focus:outline-none"
                placeholder="john.doe@example.com"
              />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold text-slate-500 text-xs uppercase tracking-wider">Password</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
                className="input input-bordered w-full text-slate-800 text-sm focus:outline-none"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full bg-blue-600 hover:bg-blue-500 border-none text-white shadow shadow-blue-500/10 mt-4 cursor-pointer"
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                'Log In'
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 mt-6 font-medium">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
