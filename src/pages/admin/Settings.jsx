import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { PageHeader } from '../../components/PageHeader';
import { ShieldCheck, Server, Database, Key, HardDrive, RefreshCw } from 'lucide-react';

export const Settings = () => {
  const { user } = useAuth();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      <PageHeader
        title="Admin Settings & System Configuration"
        subtitle="Manage console privileges, REST API connectors, and security architecture."
      />

      {/* Admin Profile Overview */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-rose-600" />
          <span>Administrator Profile</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl space-y-1">
            <span className="text-slate-400 font-semibold text-[10px] uppercase">Admin Name</span>
            <p className="font-bold text-slate-800 text-sm">{user?.name || 'Dr. Robert Vance'}</p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl space-y-1">
            <span className="text-slate-400 font-semibold text-[10px] uppercase">Admin ID</span>
            <p className="font-mono font-bold text-slate-800 text-sm">{user?.college_id || 'ADMIN001'}</p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl space-y-1">
            <span className="text-slate-400 font-semibold text-[10px] uppercase">Email</span>
            <p className="font-semibold text-slate-800 text-sm">{user?.email || 'admin.vance@campus.edu'}</p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl space-y-1">
            <span className="text-slate-400 font-semibold text-[10px] uppercase">Role Privileges</span>
            <p className="font-bold text-rose-600 text-sm uppercase">Full Campus Superadmin</p>
          </div>
        </div>
      </div>

      {/* API & System Connectivity */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Server className="w-4 h-4 text-indigo-600" />
          <span>Backend REST API Connector & Database Architecture</span>
        </h3>

        <div className="space-y-3 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-800">Target REST API Base Endpoint</p>
              <code className="text-indigo-600 font-mono text-[11px]">{apiBaseUrl}</code>
            </div>
            <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-700 text-[10px] font-bold">
              Active
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-800">Shared Database Target</p>
              <p className="text-slate-500 text-[11px]">Flask PyMongo Adapter ➔ MongoDB Database (campus_problem_tracker)</p>
            </div>
            <span className="px-2.5 py-1 rounded bg-indigo-100 text-indigo-700 text-[10px] font-bold">
              Shared DB
            </span>
          </div>
        </div>
      </div>

      {/* Application System Information */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-3 text-xs">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-slate-600" />
          <span>System Information</span>
        </h3>
        
        <div className="space-y-2 text-slate-600">
          <p><strong>System Title:</strong> Campus Problem Tracker — Integrated Student & Admin Suite</p>
          <p><strong>Version:</strong> 2.5.0 (Production Release)</p>
          <p><strong>Frontend Stack:</strong> React.js, Vite 6, Tailwind CSS v4, Framer Motion, Recharts</p>
        </div>
      </div>
    </div>
  );
};
