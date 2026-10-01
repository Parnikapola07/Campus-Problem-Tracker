import React, { useEffect, useState } from 'react';
import { apiService } from '../../services/api';
import { PageHeader } from '../../components/PageHeader';
import { StatCard } from '../../components/StatCard';
import { Star, MessageSquare, CheckCircle2, User, Building2 } from 'lucide-react';

export const Feedback = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbackData = async () => {
      setLoading(true);
      try {
        const res = await apiService.getProblems({ isAdmin: true, status: 'RESOLVED' });
        if (res.success) setProblems(res.problems || []);
      } catch (err) {
        console.error('Failed to load feedback:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbackData();
  }, []);

  const feedbackProblems = problems.filter(p => p.feedback);
  const totalFeedbackCount = feedbackProblems.length;

  const totalRatingSum = feedbackProblems.reduce((sum, p) => sum + (p.feedback.rating || 0), 0);
  const avgRating = totalFeedbackCount > 0 ? (totalRatingSum / totalFeedbackCount).toFixed(1) : '5.0';

  const fiveStarCount = feedbackProblems.filter(p => p.feedback.rating === 5).length;
  const fourStarCount = feedbackProblems.filter(p => p.feedback.rating === 4).length;

  return (
    <div className="space-y-6 pb-16">
      <PageHeader
        title="Student & Staff Feedback Directory"
        subtitle="Review ratings and comments submitted by users following ticket resolution."
      />

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Average Rating" count={`${avgRating} / 5.0`} icon={Star} iconBg="bg-amber-500" />
        <StatCard title="Total Feedback Logged" count={totalFeedbackCount} icon={MessageSquare} iconBg="bg-indigo-600" />
        <StatCard title="5-Star Ratings" count={fiveStarCount} icon={CheckCircle2} iconBg="bg-emerald-600" />
        <StatCard title="4-Star Ratings" count={fourStarCount} icon={CheckCircle2} iconBg="bg-blue-600" />
      </div>

      {/* Feedback Logs List */}
      {loading ? (
        <div className="p-8 text-center text-slate-500">Loading user feedback logs...</div>
      ) : feedbackProblems.length === 0 ? (
        <div className="p-10 bg-white rounded-2xl border border-slate-200 text-center text-slate-500">
          No user feedback records available yet.
        </div>
      ) : (
        <div className="space-y-4">
          {feedbackProblems.map(p => (
            <div key={p.id || p.ticket_id} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded">
                    {p.ticket_id}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">{p.title}</h3>
                </div>

                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${star <= p.feedback.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`}
                    />
                  ))}
                  <span className="text-xs font-bold text-slate-800 ml-1">({p.feedback.rating}/5)</span>
                </div>
              </div>

              {p.feedback.comment && (
                <p className="text-xs text-slate-700 italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                  "{p.feedback.comment}"
                </p>
              )}

              <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-1">
                <div className="flex items-center gap-3">
                  <span>Student: <strong>{p.reporter_id || 'CS24001'}</strong></span>
                  <span>•</span>
                  <span>Resolved by: <strong>{p.assigned_department || 'Maintenance Unit'}</strong></span>
                </div>
                {p.feedback.submitted_at && (
                  <span>Submitted on {new Date(p.feedback.submitted_at).toLocaleString()}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
