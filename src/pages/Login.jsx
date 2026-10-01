import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldAlert, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

export const Login = () => {
  const [collegeId, setCollegeId] = useState('CS24001');
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  // Redirect if already logged in
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!collegeId.trim()) {
      setError('Please enter your College ID.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setSubmitting(true);
    try {
      await login(collegeId.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid College ID or Password. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-app)] flex items-center justify-center p-4 sm:p-6 lg:p-8 transition-colors duration-200">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-5xl bg-[var(--bg-surface)] rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px] transition-colors duration-200"
      >
        {/* Left Section: Branding & Campus Visual */}
        <div className="lg:col-span-6 bg-gradient-to-br from-indigo-700 via-indigo-800 to-slate-900 p-8 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle background graphics */}
          <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute left-10 top-1/3 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg">
                <ShieldAlert className="w-6 h-6 text-indigo-300" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold tracking-tight text-white">Campus Problem Tracker</h1>
                <span className="text-xs text-indigo-200 font-medium">Student & Staff Portal</span>
              </div>
            </div>

            <div className="space-y-4 max-w-md">
              <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight text-white">
                Report & Track Campus Issues Seamlessly.
              </h2>
              <p className="text-sm text-indigo-100/80 leading-relaxed">
                Empowering students and faculty to submit infrastructure, IT, hostel, and maintenance problems directly to campus authorities with real-time status tracking.
              </p>
            </div>
          </div>

          {/* Key Feature Highlights */}
          <div className="relative z-10 mt-10 pt-8 border-t border-indigo-700/60 space-y-3">
            <div className="flex items-center gap-2.5 text-xs text-indigo-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Instant ticket generation with unique tracking ID</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-indigo-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Real-time resolution timeline & department updates</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-indigo-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>In-app notifications for verified progress steps</span>
            </div>
          </div>
        </div>

        {/* Right Section: Login Form */}
        <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-center bg-[var(--bg-surface)] transition-colors duration-200">
          <div className="max-w-md w-full mx-auto">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-[var(--text-primary)]">Welcome Back</h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
                Please sign in with your authorized college credentials.
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-xs"
              >
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">{error}</div>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* College ID */}
              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1.5">
                  College ID / Registration No.
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={collegeId}
                    onChange={(e) => setCollegeId(e.target.value)}
                    placeholder="e.g. CS24001"
                    className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-surface-2)] border border-[var(--bg-border)] rounded-xl text-xs font-medium text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-[var(--bg-surface)] transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-[var(--bg-surface-2)] border border-[var(--bg-border)] rounded-xl text-xs font-medium text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-[var(--bg-surface)] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-semibold text-xs rounded-xl shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Info Pill */}
            <div className="mt-8 p-3 rounded-xl bg-[var(--bg-surface-2)] border border-[var(--bg-border)] text-[11px] text-[var(--text-secondary)] text-center">
              <span className="font-semibold text-[var(--text-primary)]">Demo Login:</span> Use College ID <code className="bg-[var(--bg-border)] px-1.5 py-0.5 rounded font-mono text-[var(--text-primary)]">CS24001</code> with any password.
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
