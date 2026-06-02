import React from 'react';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiStar } from 'react-icons/fi';
import TicketSearch from './TicketSearch';

const GuestHero = () => {
  return (
    <div 
      className="hero min-h-[600px] w-full bg-fixed bg-center bg-cover overflow-hidden relative"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1600&auto=format&fit=crop&q=80')",
      }}
    >
      {/* Dark overlay with gradient for text readability */}
      <div className="hero-overlay bg-gradient-to-r from-black via-slate-900/70 to-slate-900/20"></div>
      
      <div className="hero-content flex-col lg:flex-row w-full max-w-7xl mx-auto px-6 lg:px-12 py-16 gap-12 justify-between z-10 text-white">
        
        {/* Left side: Text & Search */}
        <div className="flex-1 max-w-2xl text-center lg:text-left">
          <span className="badge badge-primary bg-blue-500/20 border-blue-400/30 text-blue-300 py-3 px-4 font-bold text-xs uppercase tracking-wider mb-6 backdrop-blur-sm">
            Your Trusted Support Partner
          </span>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-6 text-white drop-shadow-md">
            Bought a product? <br />
            <span className="text-blue-400">
              Let us fix the issues.
            </span>
          </h1>
          
          <p className="text-slate-200 mb-10 text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 drop-shadow-md">
            We stand by what we sell. Enter your complaint number below to get an instant update, or let our experts help you resolve any new problems.
          </p>
          
          {/* Central Search Bar */}
          {/* <div className="mb-10 max-w-md mx-auto lg:mx-0">
            <TicketSearch />
          </div> */}
          
          <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start items-center">
            <span className="text-sm text-slate-200 font-medium drop-shadow-md">Need to report a new problem?</span>
            <Link
              to="/signup"
              className="btn btn-primary bg-blue-600 hover:bg-blue-500 border-none text-white px-8 rounded-xl shadow-lg shadow-blue-600/30 cursor-pointer"
            >
              Raise a New Issue
            </Link>
          </div>
        </div>

        {/* Right side: Floating Stats */}
        <div className="w-full lg:w-auto flex justify-center lg:justify-end items-center mt-8 lg:mt-0">
          <div className="stats stats-vertical sm:stats-horizontal shadow-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white w-full max-w-md lg:w-auto">
            <div className="stat px-6 py-5">
              <div className="stat-title text-blue-200 text-xs font-bold uppercase tracking-wider drop-shadow-sm flex items-center gap-1.5">
                <FiCheckCircle className="text-sm" /> Issues Resolved
              </div>
              <div className="stat-value text-white text-3xl sm:text-4xl font-black mt-1 drop-shadow-md">99.4%</div>
              <div className="stat-desc text-slate-200 font-medium text-xs mt-1">Within first 24 hours</div>
            </div>
            <div className="stat px-6 py-5">
              <div className="stat-title text-blue-200 text-xs font-bold uppercase tracking-wider drop-shadow-sm flex items-center gap-1.5">
                <FiStar className="text-sm text-yellow-300" /> Satisfaction
              </div>
              <div className="stat-value text-emerald-400 text-3xl sm:text-4xl font-black mt-1 drop-shadow-md">4.9/5</div>
              <div className="stat-desc text-slate-200 font-medium text-xs mt-1">From 10k+ reviews</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default GuestHero;
