import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Menu, Bell, ShieldCheck, Activity, Sun, Moon } from 'lucide-react';

export const AdminNavbar = ({ onMobileMenuToggle, unreadCount = 0 }) => {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-20 h-16 bg-[var(--admin-navbar-bg)]/95 backdrop-blur-md border-b border-slate-700/60 px-4 sm:px-6 flex items-center justify-between text-white transition-colors duration-200">
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 rounded-lg text-slate-300 hover:bg-slate-700/60 transition-colors"
          aria-label="Toggle Mobile Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold text-xs shadow-md">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm text-white tracking-tight">Admin Console</span>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-800/50 ml-2">
          <Activity className="w-3 h-3 animate-pulse" />
          <span>MongoDB Synced</span>
        </span>
      </div>

      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="theme-toggle text-slate-300 hover:bg-slate-700/60 hover:text-white transition-colors"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
        </button>

        {/* Admin Notifications */}
        <Link
          to="/admin/notifications"
          className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-700/60 rounded-lg transition-colors"
          title="Admin Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
              {unreadCount}
            </span>
          )}
        </Link>

        {/* Profile Pill */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-700/60">
          <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-xs ring-2 ring-rose-900">
            {user?.name ? user.name.charAt(0) : 'A'}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-semibold text-white leading-tight">{user?.name || 'Administrator'}</p>
            <p className="text-[10px] text-slate-400 font-mono">ID: {user?.college_id || 'ADMIN001'}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
