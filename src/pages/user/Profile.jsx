import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PageHeader } from '../../components/PageHeader';
import { 
  User, 
  Mail, 
  BookOpen, 
  ShieldCheck, 
  Calendar, 
  LogOut, 
  Lock,
  Building
} from 'lucide-react';

export const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      <PageHeader
        title="My Campus Profile"
        subtitle="Manage your authorized account identity details and security status."
      />

      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="w-20 h-20 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-3xl shadow-lg shadow-indigo-600/30 shrink-0">
          {user?.name ? user.name.charAt(0) : 'U'}
        </div>

        <div className="space-y-2 text-center sm:text-left flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">{user?.name || 'Student Name'}</h2>
              <p className="text-xs font-mono text-indigo-600 font-bold mt-0.5">ID: {user?.college_id || 'CS24001'}</p>
            </div>
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold self-center sm:self-auto">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Campus User</span>
            </span>
          </div>

          <p className="text-xs text-slate-500">
            {user?.department || 'Department of Computer Science & Engineering'}
          </p>
        </div>
      </div>

      {/* Detail Fields Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
          Account Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl space-y-1">
            <span className="text-slate-400 font-semibold text-[10px] uppercase flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-600" />
              Full Name
            </span>
            <p className="font-semibold text-slate-800 text-sm">{user?.name || 'Student Name'}</p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl space-y-1">
            <span className="text-slate-400 font-semibold text-[10px] uppercase flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              College ID
            </span>
            <p className="font-mono font-bold text-slate-800 text-sm">{user?.college_id || 'CS24001'}</p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl space-y-1">
            <span className="text-slate-400 font-semibold text-[10px] uppercase flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-indigo-600" />
              Email Address
            </span>
            <p className="font-semibold text-slate-800 text-sm">{user?.email || 'student@college.edu'}</p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl space-y-1">
            <span className="text-slate-400 font-semibold text-[10px] uppercase flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-indigo-600" />
              Department / Role
            </span>
            <p className="font-semibold text-slate-800 text-sm capitalize">{user?.role || 'Student'} ({user?.department || 'CSE'})</p>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 italic pt-2">
          * Note: Profile credentials are synced with your official university enrollment directory. Contact Campus Administration to update primary identity details.
        </p>
      </div>

      {/* Security & Action Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
          Session & Security
        </h3>

        <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl text-xs">
          <div className="flex items-center gap-3">
            <Lock className="w-4 h-4 text-indigo-600" />
            <div>
              <p className="font-semibold text-slate-800">Password & Authentication</p>
              <p className="text-[11px] text-slate-500">Managed by Campus Central LDAP / OAuth backend service.</p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Active Session
          </span>
        </div>

        <div className="pt-2">
          <button
            onClick={handleLogout}
            className="w-full py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs rounded-xl border border-rose-200 flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out of Account</span>
          </button>
        </div>
      </div>
    </div>
  );
};
