import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, Bell, Plus, ShieldAlert } from 'lucide-react';

export const Navbar = ({ onMobileMenuToggle, unreadNotifCount = 0 }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between">
      {/* Left section: Hamburger for mobile + App name */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 lg:hidden">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm text-slate-900 tracking-tight">Campus Tracker</span>
        </div>
      </div>

      {/* Right section: Quick action CTA, Notifications, Profile pill */}
      <div className="flex items-center gap-3">
        {/* Quick Report CTA */}
        <Link
          to="/report-problem"
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs hover:shadow transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Report Problem</span>
        </Link>

        {/* Notification Bell */}
        <Link
          to="/notifications"
          className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadNotifCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
              {unreadNotifCount}
            </span>
          )}
        </Link>

        {/* User Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs ring-2 ring-indigo-50">
            {user?.name ? user.name.charAt(0) : 'U'}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-semibold text-slate-800 leading-tight">{user?.name || 'Student'}</p>
            <p className="text-[10px] text-slate-400 font-mono">{user?.college_id || 'CS24001'}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
