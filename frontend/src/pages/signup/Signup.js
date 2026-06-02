import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BACKEND_URL } from '../../constant';
import { useAuth } from '../../context/AuthContext';

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize from location.state if available
  const initialPhone = location.state?.phone || '';
  const initialError = location.state?.message || null;

  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: initialPhone,
    password: '',
  });

  const [error, setError] = useState(initialError);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

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

    // Frontend validations
    if (!formData.firstname.trim() || !formData.lastname.trim()) {
      setError('First name and Last name are required.');
      setLoading(false);
      return;
    }
    if (!formData.phone.trim()) {
      setError('Phone number is required.');
      setLoading(false);
      return;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(BACKEND_URL + '/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong during registration.');
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
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
    <div className="flex items-center justify-center min-h-[calc(100vh-12rem)] py-6 px-4">
      <div className="card w-full max-w-md bg-base-100 border border-base-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full blur-2xl pointer-events-none"></div>

        <div className="card-body p-8 relative z-10">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create an account</h1>
            <p className="text-sm text-slate-500 mt-1">Get started by entering your details below.</p>
          </div>

          {error && (
            <div className="alert alert-error bg-red-50 border-red-100 text-red-700 text-xs py-3.5 mb-4 flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="alert alert-success bg-emerald-50 border-emerald-100 text-emerald-700 text-xs py-3.5 mb-4 flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>Registration successful! Redirecting to login...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-semibold text-slate-500 text-xs uppercase tracking-wider">First Name</span>
                </label>
                <input
                  type="text"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="input input-bordered w-full text-slate-800 text-sm focus:outline-none"
                  placeholder="John"
                />
              </div>
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-semibold text-slate-500 text-xs uppercase tracking-wider">Last Name</span>
                </label>
                <input
                  type="text"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="input input-bordered w-full text-slate-800 text-sm focus:outline-none"
                  placeholder="Doe"
                />
              </div>
            </div>

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
                <span className="label-text font-semibold text-slate-500 text-xs uppercase tracking-wider">Phone Number</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                disabled={loading}
                className="input input-bordered w-full text-slate-800 text-sm focus:outline-none"
                placeholder="+1234567890"
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
              <span className="text-[10px] text-slate-400 mt-1 block font-medium">Must be at least 8 characters.</span>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="btn btn-primary w-full bg-blue-600 hover:bg-blue-500 border-none text-white shadow shadow-blue-500/10 mt-4 cursor-pointer"
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 mt-6 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
