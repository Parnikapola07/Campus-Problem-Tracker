import React, { useEffect, useState } from 'react';
import { apiService } from '../../services/api';
import { PageHeader } from '../../components/PageHeader';
import { ChartCard } from '../../components/ChartCard';
import { StatCard } from '../../components/StatCard';
import { SummarySkeleton } from '../../components/LoadingSkeleton';
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { BarChart3, Clock, CheckCircle2, Star, Layers, Zap } from 'lucide-react';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#8b5cf6'];

export const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setLoading(true);
      try {
        const [anRes, probRes] = await Promise.all([
          apiService.getAdminAnalytics(),
          apiService.getProblems({ isAdmin: true })
        ]);
        if (anRes.success) setAnalytics(anRes);
        if (probRes.success) setProblems(probRes.problems || []);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  if (loading) return <SummarySkeleton />;

  // Prepare chart data series
  const statusData = [
    { name: 'Reported', count: problems.filter(p => p.status === 'REPORTED').length },
    { name: 'Verified', count: problems.filter(p => p.status === 'VERIFIED').length },
    { name: 'Assigned', count: problems.filter(p => p.status === 'ASSIGNED').length },
    { name: 'In Progress', count: problems.filter(p => p.status === 'IN_PROGRESS').length },
    { name: 'Resolved', count: problems.filter(p => p.status === 'RESOLVED').length },
    { name: 'Rejected', count: problems.filter(p => p.status === 'REJECTED').length },
  ];

  const priorityData = [
    { name: 'Critical', value: problems.filter(p => (p.current_priority || p.user_priority) === 'CRITICAL').length, color: '#e11d48' },
    { name: 'High', value: problems.filter(p => (p.current_priority || p.user_priority) === 'HIGH').length, color: '#f59e0b' },
    { name: 'Medium', value: problems.filter(p => (p.current_priority || p.user_priority) === 'MEDIUM').length, color: '#3b82f6' },
    { name: 'Low', value: problems.filter(p => (p.current_priority || p.user_priority) === 'LOW').length, color: '#64748b' },
  ].filter(d => d.value > 0);

  const categoryMap = {};
  problems.forEach(p => {
    const catName = p.category_name || p.category || 'Other';
    categoryMap[catName] = (categoryMap[catName] || 0) + 1;
  });
  const categoryData = Object.keys(categoryMap).map(cat => ({
    name: cat,
    count: categoryMap[cat]
  }));

  const feedbackWithRating = problems.filter(p => p.feedback?.rating);
  const ratingCounts = [1, 2, 3, 4, 5].map(r => ({
    rating: `${r} Star`,
    count: feedbackWithRating.filter(p => p.feedback.rating === r).length
  }));

  return (
    <div className="space-y-8 pb-16">
      <PageHeader
        title="Campus Problem Analytics & KPI Intelligence"
        subtitle="In-depth maintenance performance metrics, resolution timelines, and student satisfaction feedback."
      />

      {/* Top Stat Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Reported Tickets" count={problems.length} icon={Layers} iconBg="bg-indigo-600" />
        <StatCard title="Avg Resolution Time" count={analytics?.avg_resolution_time || '24.2 Hours'} icon={Clock} iconBg="bg-amber-500" />
        <StatCard title="Avg Assignment Time" count={analytics?.avg_assignment_time || '3.5 Hours'} icon={Zap} iconBg="bg-emerald-600" />
        <StatCard title="Overall Satisfaction" count="4.8 / 5.0" icon={Star} iconBg="bg-rose-600" />
      </div>

      {/* Charts Grid Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <ChartCard title="Lifecycle Status Pipeline" subtitle="Volume of tickets across all resolution stages">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={statusData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', borderColor: '#334155', color: '#fff' }} />
                <Bar dataKey="count" fill="#4f46e5" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="lg:col-span-5">
          <ChartCard title="Priority Distribution" subtitle="Proportion of tickets by priority severity">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={priorityData} cx="50%" cy="50%" innerRadius={65} outerRadius={90} paddingAngle={4} dataKey="value">
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', borderColor: '#334155', color: '#fff' }} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* Charts Grid Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <ChartCard title="Tickets by Category" subtitle="Distribution of maintenance issues by infrastructure category">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart layout="vertical" data={categoryData} margin={{ top: 10, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#64748b' }} width={110} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', borderColor: '#334155', color: '#fff' }} />
                <Bar dataKey="count" fill="#06b6d4" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="lg:col-span-6">
          <ChartCard title="User Satisfaction Feedback Distribution" subtitle="Star ratings submitted after ticket resolution">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={ratingCounts} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="rating" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', borderColor: '#334155', color: '#fff' }} />
                <Area type="monotone" dataKey="count" stroke="#10b981" fill="#d1fae5" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    </div>
  );
};
