import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Menu, Bell, Plus, ShieldAlert, Sun, Moon } from 'lucide-react';

export const Navbar = ({ onMobileMenuToggle, unreadNotifCount = 0 }) => {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-20 h-16 bg-[var(--bg-surface)]/90 backdrop-blur-md border-b border-[var(--bg-border)] px-4 sm:px-6 flex items-center justify-between transition-colors duration-200">
      {/* Left section: Hamburger for mobile + App name */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-surface-2)] transition-colors"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 lg:hidden">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm text-[var(--text-primary)] tracking-tight">Campus Tracker</span>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2">
        {/* Quick Report CTA */}
        <Link
          to="/report-problem"
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs hover:shadow transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Report Problem</span>
        </Link>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="theme-toggle text-[var(--text-secondary)] hover:bg-[var(--bg-surface-2)] hover:text-[var(--text-primary)] transition-colors"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
        </button>

        {/* Notification Bell */}
        <Link
          to="/notifications"
          className="relative p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-2)] rounded-lg transition-colors"
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
        <div className="flex items-center gap-2 pl-2 border-l border-[var(--bg-border)]">
          <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-xs ring-2 ring-indigo-50 dark:ring-indigo-900/30">
            {user?.name ? user.name.charAt(0) : 'U'}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-semibold text-[var(--text-primary)] leading-tight">{user?.name || 'Student'}</p>
            <p className="text-[10px] text-[var(--text-muted)] font-mono">{user?.college_id || 'CS24001'}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
