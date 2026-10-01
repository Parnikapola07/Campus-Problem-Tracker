import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { apiService } from '../../services/api';
import { StatCard } from '../../components/StatCard';
import { ChartCard } from '../../components/ChartCard';
import { AdminProblemTable } from '../../components/AdminProblemTable';
import { SummarySkeleton } from '../../components/LoadingSkeleton';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { 
  Layers, 
  FileText, 
  CheckCircle2, 
  UserCheck, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Flame, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

const PRIORITY_COLORS = {
  CRITICAL: '#e11d48', // rose-600
  HIGH: '#f59e0b',     // amber-500
  MEDIUM: '#3b82f6',   // blue-500
  LOW: '#64748b'       // slate-500
};

const STATUS_COLORS = {
  REPORTED: '#3b82f6',
  VERIFIED: '#06b6d4',
  ASSIGNED: '#6366f1',
  IN_PROGRESS: '#f59e0b',
  RESOLVED: '#10b981',
  REJECTED: '#f43f5e'
};

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const res = await apiService.getProblems({ isAdmin: true });
        if (res.success) {
          setProblems(res.problems || []);
        }
      } catch (err) {
        console.error('Failed to load admin dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Compute Statistics
  const totalCount = problems.length;
  const reportedCount = problems.filter(p => p.status === 'REPORTED').length;
  const verifiedCount = problems.filter(p => p.status === 'VERIFIED').length;
  const assignedCount = problems.filter(p => p.status === 'ASSIGNED').length;
  const inProgressCount = problems.filter(p => p.status === 'IN_PROGRESS').length;
  const resolvedCount = problems.filter(p => p.status === 'RESOLVED').length;
  const rejectedCount = problems.filter(p => p.status === 'REJECTED').length;
  const criticalCount = problems.filter(p => (p.current_priority || p.user_priority) === 'CRITICAL' && p.status !== 'RESOLVED' && p.status !== 'REJECTED').length;

  // Chart Data Preparation
  const priorityChartData = [
    { name: 'Critical', value: problems.filter(p => (p.current_priority || p.user_priority) === 'CRITICAL').length, color: PRIORITY_COLORS.CRITICAL },
    { name: 'High', value: problems.filter(p => (p.current_priority || p.user_priority) === 'HIGH').length, color: PRIORITY_COLORS.HIGH },
    { name: 'Medium', value: problems.filter(p => (p.current_priority || p.user_priority) === 'MEDIUM').length, color: PRIORITY_COLORS.MEDIUM },
    { name: 'Low', value: problems.filter(p => (p.current_priority || p.user_priority) === 'LOW').length, color: PRIORITY_COLORS.LOW },
  ].filter(d => d.value > 0);

  const statusChartData = [
    { status: 'Reported', count: reportedCount, fill: STATUS_COLORS.REPORTED },
    { status: 'Verified', count: verifiedCount, fill: STATUS_COLORS.VERIFIED },
    { status: 'Assigned', count: assignedCount, fill: STATUS_COLORS.ASSIGNED },
    { status: 'In Progress', count: inProgressCount, fill: STATUS_COLORS.IN_PROGRESS },
    { status: 'Resolved', count: resolvedCount, fill: STATUS_COLORS.RESOLVED },
    { status: 'Rejected', count: rejectedCount, fill: STATUS_COLORS.REJECTED },
  ];

  const criticalIssues = problems.filter(p => (p.current_priority || p.user_priority) === 'CRITICAL' && p.status !== 'RESOLVED' && p.status !== 'REJECTED');
  const recentProblems = problems.slice(0, 5);

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg border border-slate-800 relative overflow-hidden">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase tracking-wider">
              Admin Operations
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Good morning, Admin 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            Monitor, assign, and manage reported campus infrastructure & service tickets.
          </p>
        </div>

        <Link
          to="/admin/problems"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl shadow-md transition-all shrink-0"
        >
          <span>Manage All Tickets</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Statistics Cards Grid */}
      {loading ? (
        <SummarySkeleton />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          <StatCard title="Total" count={totalCount} icon={Layers} iconBg="bg-indigo-600" onClick={() => navigate('/admin/problems')} />
          <StatCard title="Reported" count={reportedCount} icon={FileText} iconBg="bg-blue-600" onClick={() => navigate('/admin/problems?status=REPORTED')} />
          <StatCard title="Verified" count={verifiedCount} icon={CheckCircle2} iconBg="bg-cyan-600" onClick={() => navigate('/admin/problems?status=VERIFIED')} />
          <StatCard title="Assigned" count={assignedCount} icon={UserCheck} iconBg="bg-indigo-500" onClick={() => navigate('/admin/problems?status=ASSIGNED')} />
          <StatCard title="Progress" count={inProgressCount} icon={Clock} iconBg="bg-amber-500" onClick={() => navigate('/admin/problems?status=IN_PROGRESS')} />
          <StatCard title="Resolved" count={resolvedCount} icon={CheckCircle} iconBg="bg-emerald-600" onClick={() => navigate('/admin/problems?status=RESOLVED')} />
          <StatCard title="Rejected" count={rejectedCount} icon={XCircle} iconBg="bg-rose-500" onClick={() => navigate('/admin/problems?status=REJECTED')} />
          <StatCard title="Critical" count={criticalCount} icon={Flame} iconBg="bg-rose-700" onClick={() => navigate('/admin/priority')} />
        </div>
      )}

      {/* Critical Issues Notice Banner */}
      {criticalIssues.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-2xl bg-rose-950/40 border border-rose-800/80 text-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold shrink-0">
              <Flame className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {criticalIssues.length} Critical Issue{criticalIssues.length > 1 ? 's' : ''} Require Immediate Attention
              </h3>
              <p className="text-xs text-rose-300/80 mt-0.5">
                Urgent safety or campus infrastructure failures queued in the priority matrix.
              </p>
            </div>
          </div>

          <Link
            to="/admin/priority"
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl shadow-xs shrink-0"
          >
            Open Priority Queue →
          </Link>
        </motion.div>
      )}

      {/* Visual Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Donut Chart: Priority Overview */}
        <div className="lg:col-span-5">
          <ChartCard title="Priority Distribution" subtitle="Active ticket breakdown by priority severity">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={priorityChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {priorityChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', borderColor: '#334155', color: '#fff', fontSize: '12px' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Bar Chart: Status Distribution */}
        <div className="lg:col-span-7">
          <ChartCard title="Status Pipeline" subtitle="Count of tickets in each stage of lifecycle">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={statusChartData} margin={{ top: 20, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="status" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', borderColor: '#334155', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {statusChartData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* Recent Problems Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent Campus Tickets</h2>
            <p className="text-xs text-slate-500">Latest problem reports submitted across all campus departments</p>
          </div>

          <Link
            to="/admin/problems"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            <span>View All ({problems.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <AdminProblemTable problems={recentProblems} />
      </div>
    </div>
  );
};
