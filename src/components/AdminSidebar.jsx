import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Layers,
  Flame,
  Building2,
  Users,
  Tag,
  MapPin,
  BarChart3,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  ShieldCheck,
  X
} from 'lucide-react';

const ADMIN_NAV_ITEMS = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/problems', label: 'All Problems', icon: Layers },
  { path: '/admin/priority', label: 'Priority Queue', icon: Flame },
  { path: '/admin/departments', label: 'Departments', icon: Building2 },
  { path: '/admin/staff', label: 'Staff Management', icon: Users },
  { path: '/admin/categories', label: 'Categories', icon: Tag },
  { path: '/admin/locations', label: 'Locations', icon: MapPin },
  { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/admin/feedback', label: 'User Feedback', icon: MessageSquare },
  { path: '/admin/notifications', label: 'Notifications', icon: Bell },
  { path: '/admin/settings', label: 'System Settings', icon: Settings }
];

export const AdminSidebar = ({ mobileOpen, setMobileOpen, unreadCount = 0 }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navContent = (
    <div className="flex flex-col h-full bg-slate-950 text-slate-300 w-64 border-r border-slate-800/80">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800/80 bg-slate-900/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-sm text-white tracking-wide leading-none">
              Campus Tracker
            </h2>
            <span className="text-[10px] text-rose-400 font-bold tracking-widest uppercase mt-1 block">
              ADMIN PORTAL
            </span>
          </div>
        </div>
        {mobileOpen && (
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Main Admin Nav */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          Administration
        </div>
        {ADMIN_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen && setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </div>
              {item.path === '/admin/notifications' && unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500 text-white animate-pulse">
                  {unreadCount}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Admin User Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/60">
        <div className="flex items-center gap-2.5 mb-3 px-1">
          <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center font-bold text-xs shrink-0">
            {user?.name ? user.name.charAt(0) : 'A'}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white truncate">{user?.name || 'Administrator'}</p>
            <p className="text-[10px] text-rose-400 font-mono truncate">{user?.college_id || 'ADMIN001'}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-950/60 hover:text-rose-300 border border-rose-900/40 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Admin Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block fixed inset-y-0 left-0 z-30">
        {navContent}
      </aside>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-10">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};
