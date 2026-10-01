import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldCheck,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  ShieldAlert
} from 'lucide-react';

export const AdminLogin = () => {
  const [adminId, setAdminId] = useState('ADMIN001');
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { adminLogin, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin/dashboard';
  const locationError = location.state?.error;

  React.useEffect(() => {
    if (isAuthenticated && isAdmin) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!adminId.trim()) {
      setError('Please enter your Admin ID.');
      return;
    }
    if (!password) {
      setError('Please enter your admin password.');
      return;
    }

    setSubmitting(true);
    try {
      await adminLogin(adminId.trim(), password);
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid Admin ID or Password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]"
      >
        {/* Left Side Branding */}
        <div className="lg:col-span-6 bg-gradient-to-br from-rose-950 via-slate-950 to-slate-900 p-8 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800">
          <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-11 h-11 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-600/30">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold tracking-tight text-white">Campus Problem Tracker</h1>
                <span className="text-xs text-rose-400 font-extrabold tracking-wider uppercase">ADMIN PORTAL</span>
              </div>
            </div>

            <div className="space-y-4 max-w-md">
              <h2 className="text-3xl sm:text-4xl font-black leading-tight tracking-tight text-white">
                Campus Maintenance Operations Control
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Authorized administration portal for reviewing, assigning, prioritizing, and resolving infrastructure and service issues reported across campus.
              </p>
            </div>
          </div>

          <div className="relative z-10 mt-10 pt-6 border-t border-slate-800 text-xs text-slate-400 space-y-2">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Restricted to authorized campus administrative officers only.</span>
            </div>
            <div className="pt-2">
              <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold underline">
                Are you a student or faculty member? Switch to Student Login →
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side Login Form */}
        <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-center bg-slate-900">
          <div className="max-w-md w-full mx-auto">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white">Admin Sign In</h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Enter your administrative credentials to access the console.
              </p>
            </div>

            {(error || locationError) && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-200 text-xs flex items-start gap-3"
              >
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>{error || locationError}</div>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Admin ID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                    placeholder="e.g. ADMIN001"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:bg-slate-900 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Admin Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:bg-slate-900 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-4 bg-rose-600 hover:bg-rose-700 active:scale-[0.99] text-white font-semibold text-xs rounded-xl shadow-lg shadow-rose-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-70"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying Admin Access...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Admin Console</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 text-center">
              <span className="font-semibold text-slate-300">Demo Admin Login:</span> Use ID <code className="bg-slate-800 px-1.5 py-0.5 rounded font-mono text-rose-300">ADMIN001</code> with any password.
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
