import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './pages/Layout';
import Home from './pages/Home';
import Signup from './pages/signup/Signup';
import Login from './pages/login/Login';

import AdminUsers from './pages/admin/Users';
import Dashboard from './pages/dashboard/dashboard';
import IssueDetail from './pages/issue/IssueDetail';
import AnalyticsPage from './pages/manager/AnalyticsPage';
import ProductsPage from './pages/products/ProductsPage';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><span className="loading loading-spinner loading-lg text-primary"></span></div>;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

const PublicRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><span className="loading loading-spinner loading-lg text-primary"></span></div>;
  return !isAuthenticated ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Common Routes */}
            <Route index element={<Home />} />
            <Route path="products" element={<ProductsPage />} />
            
            {/* Public Routes (only accessible if NOT logged in) */}
            <Route element={<PublicRoute />}>
              <Route path="signup" element={<Signup />} />
              <Route path="login" element={<Login />} />
            </Route>

            {/* Protected Routes (only accessible if logged in) */}
            <Route element={<ProtectedRoute />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="admin/users" element={<AdminUsers />} />
              <Route path="issue/:id" element={<IssueDetail />} />
              <Route path="manager/analytics" element={<AnalyticsPage />} />
            </Route>

            <Route path="*" element={<Home />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
