import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../../services/api';
import { PageHeader } from '../../components/PageHeader';
import { StatusBadge } from '../../components/StatusBadge';
import { CardSkeleton } from '../../components/LoadingSkeleton';
import { Flame, AlertTriangle, AlertCircle, Info, ArrowUpRight, MapPin } from 'lucide-react';

export const PriorityQueue = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQueue = async () => {
      setLoading(true);
      try {
        const res = await apiService.getProblems({ isAdmin: true });
        if (res.success) setProblems(res.problems || []);
      } catch (err) {
        console.error('Failed to fetch priority queue:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQueue();
  }, []);

  const criticalGroup = problems.filter(p => (p.current_priority || p.user_priority) === 'CRITICAL');
  const highGroup = problems.filter(p => (p.current_priority || p.user_priority) === 'HIGH');
  const mediumGroup = problems.filter(p => (p.current_priority || p.user_priority) === 'MEDIUM');
  const lowGroup = problems.filter(p => (p.current_priority || p.user_priority) === 'LOW');

  const renderQueueSection = (title, items, icon, colorStyle, badgeStyle) => {
    const Icon = icon;
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${badgeStyle}`}>
              <Icon className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900">{title} Priority Queue</h2>
          </div>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${badgeStyle}`}>
            {items.length} Ticket{items.length !== 1 ? 's' : ''}
          </span>
        </div>

        {items.length === 0 ? (
          <p className="text-xs text-slate-400 py-3 italic text-center">No active tickets in {title.toLowerCase()} priority queue.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map(problem => {
              const locationText = typeof problem.location === 'object' && problem.location !== null
                ? `${problem.location.building} • ${problem.location.floor}`
                : problem.location || 'Campus Facility';

              return (
                <div
                  key={problem.id || problem.ticket_id}
                  className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${colorStyle}`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-100">
                        {problem.ticket_id}
                      </span>
                      <StatusBadge status={problem.status} />
                    </div>

                    <h4 className="text-sm font-semibold text-slate-900 line-clamp-2 mb-2">{problem.title}</h4>
                    
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{locationText}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">
                      Dept: <strong className="text-slate-800">{problem.assigned_department || 'Unassigned'}</strong>
                    </span>
                    <Link
                      to={`/admin/problems/${problem.id || problem.ticket_id}`}
                      className="px-3 py-1 bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 font-semibold rounded-lg transition-colors flex items-center gap-1"
                    >
                      <span>Manage</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-16">
      <PageHeader
        title="Priority Dispatch Queue"
        subtitle="Manage and process campus maintenance problems grouped by urgency severity."
      />

      {loading ? (
        <div className="space-y-4">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : (
        <div className="space-y-6">
          {renderQueueSection('Critical', criticalGroup, Flame, 'bg-rose-50/50 border-rose-200', 'bg-rose-100 text-rose-800')}
          {renderQueueSection('High', highGroup, AlertTriangle, 'bg-amber-50/50 border-amber-200', 'bg-amber-100 text-amber-800')}
          {renderQueueSection('Medium', mediumGroup, AlertCircle, 'bg-blue-50/30 border-slate-200', 'bg-blue-100 text-blue-800')}
          {renderQueueSection('Low', lowGroup, Info, 'bg-slate-50 border-slate-200', 'bg-slate-200 text-slate-700')}
        </div>
      )}
    </div>
  );
};
