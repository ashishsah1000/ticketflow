import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Navbar } from '../components';
import { Footer } from '../features';

const Layout = () => {
  return (
    <div data-theme="light" className="min-h-screen w-full bg-slate-50 text-base-content flex flex-col font-sans">
      <Toaster position="top-right" />
      <Navbar />
      <main className="flex-grow flex flex-col items-center">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
