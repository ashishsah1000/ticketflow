import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ProductCatalog } from '../features';
import {
  ProfileCard,
  ManagerConsole,
  EmployeeConsole,
  RaiseTicketForm,
  GuestHero,
  PersonaBreakdown,
} from '../components';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { user, isAuthenticated, logout } = useAuth();

  // Helper to check if a user has a specific role
  const hasRole = (roleName) => {
    return user && user.roles && user.roles.includes(roleName);
  };
  const navigate = useNavigate();
  // if user is authenticated send him to /dashboard
  if (isAuthenticated) {
    navigate("/dashboard")
  }

  useEffect(() => {
    if (isAuthenticated)
      navigate("/dashboard")

  }, [])

  return (
    <div className="w-full flex flex-col">
      {isAuthenticated ? (
        <div className="space-y-8 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          {/* Profile Card */}
          <ProfileCard user={user} onLogout={logout} />

          {/* Role-Specific Portal Section */}
          <div className="card bg-base-100 border border-base-200 shadow-sm">
            <div className="card-body space-y-6">
              <h2 className="card-title text-xl font-bold text-slate-900 border-b border-base-200 pb-4">
                Support Console
              </h2>

              {/* Customer panel (default/fallback if not manager or employee) */}
              {!hasRole('manager') && !hasRole('employee') && (
                <div className="space-y-8">
                  <div className="alert alert-info bg-blue-50 border-blue-100 text-blue-800 flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h3 className="font-bold text-sm">Customer Portal</h3>
                      <p className="text-xs opacity-90">Raise support issues or report inquiries about any product you bought.</p>
                    </div>
                  </div>

                  {/* Products browser */}
                  <ProductCatalog
                    title="Browse Support Catalog"
                    cardClassName="card bg-base-50 border border-base-200"
                  />

                  {/* Create Ticket form */}
                  {/* <RaiseTicketForm /> */}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          <GuestHero />
          <div className="space-y-8 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-8 pb-8">
            {/* Product Catalog with Brand Selector (Interactive for Guests) */}
            <ProductCatalog
              title="Explore Support Catalog"
              cardClassName="card bg-base-100 border border-base-200 shadow-sm"
            />

            {/* Persona breakdown */}
            <PersonaBreakdown />
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
