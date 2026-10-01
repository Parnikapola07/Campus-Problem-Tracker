import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { ProblemCard } from '../../components/ProblemCard';
import { SummarySkeleton, CardSkeleton } from '../../components/LoadingSkeleton';
import { EmptyState } from '../../components/EmptyState';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  PlusCircle, 
  ArrowRight,
  Bell,
  AlertTriangle,
  Layers
} from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuth();
  const [problems, setProblems] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [probRes, notifRes] = await Promise.all([
          apiService.getProblems(),
          apiService.getNotifications()
        ]);
        if (probRes.success) setProblems(probRes.problems || []);
        if (notifRes.success) setNotifications(notifRes.notifications || []);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Compute summary metrics
  const totalCount = problems.length;
  const reportedCount = problems.filter(p => p.status === 'REPORTED' || p.status === 'VERIFIED').length;
  const inProgressCount = problems.filter(p => p.status === 'IN_PROGRESS' || p.status === 'ASSIGNED').length;
  const resolvedCount = problems.filter(p => p.status === 'RESOLVED').length;

  const unreadNotifs = notifications.filter(n => !n.read);
  const recentProblems = problems.slice(0, 4);

  const stats = [
    {
      title: 'Total Problems',
      count: totalCount,
      icon: Layers,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      iconBg: 'bg-indigo-600 text-white'
    },
    {
      title: 'Reported',
      count: reportedCount,
      icon: FileText,
      color: 'bg-blue-50 text-blue-600 border-blue-100',
      iconBg: 'bg-blue-600 text-white'
    },
    {
      title: 'In Progress',
      count: inProgressCount,
      icon: Clock,
      color: 'bg-amber-50 text-amber-600 border-amber-100',
      iconBg: 'bg-amber-500 text-white'
    },
    {
      title: 'Resolved',
      count: resolvedCount,
      icon: CheckCircle2,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      iconBg: 'bg-emerald-600 text-white'
    }
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Top Banner Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Good morning, {user?.name?.split(' ')[0] || 'Student'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200/90 font-medium">
            Track and manage the problems you've reported on campus.
          </p>
        </div>

        <Link
          to="/report-problem"
          className="relative z-10 inline-flex items-center justify-center gap-2 px-5 py-3 bg-indigo-500 hover:bg-indigo-400 active:scale-95 text-white font-semibold text-xs rounded-xl shadow-md transition-all duration-200 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report New Problem</span>
        </Link>
      </div>

      {/* Summary Cards */}
      {loading ? (
        <SummarySkeleton />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.08 }}
                className={`p-5 rounded-2xl border bg-[var(--bg-surface)] shadow-xs flex items-center justify-between transition-transform hover:-translate-y-1`}
              >
                <div>
                  <p className="text-xs font-semibold text-[var(--text-secondary)]">{stat.title}</p>
                  <p className="text-2xl font-black text-[var(--text-primary)] mt-1">{stat.count}</p>
                </div>
                <div className={`w-11 h-11 rounded-xl ${stat.iconBg} flex items-center justify-center shadow-md shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Main Grid: Recent Problems + Right Sidebar Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Problems */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[var(--text-primary)]">Recent Problems</h2>
              <p className="text-xs text-[var(--text-secondary)]">Tickets submitted by you recently</p>
            </div>

            <Link
              to="/my-problems"
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 group"
            >
              <span>View All ({problems.length})</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : recentProblems.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No Problems Reported Yet"
              description="Have you noticed an issue on campus? Report it now to alert our campus maintenance teams."
              actionText="Report a Problem"
              actionLink="/report-problem"
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recentProblems.map(problem => (
                <ProblemCard key={problem.id || problem.ticket_id} problem={problem} />
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Notification Preview & Quick Tips */}
        <div className="lg:col-span-4 space-y-6">
          {/* Notifications Card Preview */}
          <div className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--bg-border)] p-5 shadow-xs transition-colors duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--bg-border)] mb-4">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-sm font-bold text-[var(--text-primary)]">Notifications</h3>
              </div>
              {unreadNotifs.length > 0 && (
                <span className="text-[10px] font-bold bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 px-2 py-0.5 rounded-full">
                  {unreadNotifs.length} Unread
                </span>
              )}
            </div>

            {notifications.length === 0 ? (
              <p className="text-xs text-[var(--text-muted)] text-center py-4">No notifications yet.</p>
            ) : (
              <div className="space-y-3">
                {notifications.slice(0, 3).map(notif => (
                  <Link
                    key={notif.id}
                    to="/notifications"
                    className="block p-3 rounded-xl bg-[var(--bg-surface-2)] hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border border-[var(--bg-border)] transition-colors"
                  >
                    <p className="text-xs font-semibold text-[var(--text-primary)] line-clamp-1">{notif.title}</p>
                    <p className="text-[11px] text-[var(--text-secondary)] line-clamp-2 mt-0.5">{notif.message}</p>
                  </Link>
                ))}
                
                <Link
                  to="/notifications"
                  className="block text-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 pt-2"
                >
                  View Notification Center →
                </Link>
              </div>
            )}
          </div>

          {/* Quick Notice Box */}
          <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 space-y-2 transition-colors duration-200">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-400">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-500 shrink-0" />
              <span>Priority Notice</span>
            </div>
            <p className="text-xs text-amber-800/80 dark:text-amber-400/80 leading-relaxed">
              When reporting a problem, your selected priority is a suggestion. The admin department will review and finalize the urgency based on campus safety guidelines.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
