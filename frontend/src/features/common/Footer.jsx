import React from 'react';
import { FaTwitter, FaGithub, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer footer-center p-8 mt-8 bg-white text-slate-500 border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.02)]">
      <div>
        <div className="flex gap-6 mb-4">
          <a href="#" className="hover:text-blue-500 hover:-translate-y-1 transition-all">
            <FaTwitter className="text-2xl" />
          </a>
          <a href="#" className="hover:text-slate-800 hover:-translate-y-1 transition-all">
            <FaGithub className="text-2xl" />
          </a>
          <a href="#" className="hover:text-blue-700 hover:-translate-y-1 transition-all">
            <FaLinkedin className="text-2xl" />
          </a>
        </div>
        <p className="font-medium text-sm">© {new Date().getFullYear()} - TicketFlow support platform. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
