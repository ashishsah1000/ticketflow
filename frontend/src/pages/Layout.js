import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Navbar } from '../components';

const Layout = () => {
  return (
    <div data-theme="light" className="min-h-screen w-full bg-slate-50 text-base-content flex flex-col font-sans">
      <Toaster position="top-right" />
      <Navbar />
      <main className="flex-grow flex flex-col items-center">
        <Outlet />
      </main>

      {/* DaisyUI Footer */}
      <footer className="footer footer-center p-6 bg-base-100 text-slate-400 border-t border-base-200">
        <div>
          <p>© {new Date().getFullYear()} - TicketFlow support platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
