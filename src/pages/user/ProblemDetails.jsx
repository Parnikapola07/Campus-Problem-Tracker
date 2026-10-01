import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import { StatusBadge } from '../../components/StatusBadge';
import { PriorityBadge } from '../../components/PriorityBadge';
import { StatusTimeline } from '../../components/StatusTimeline';
import { DetailsSkeleton } from '../../components/LoadingSkeleton';
import { 
  ArrowLeft, 
  MapPin, 
  Tag, 
  Calendar, 
  Building2, 
  CheckCircle2, 
  Star, 
  MessageSquare,
  Image as ImageIcon
} from 'lucide-react';

export const ProblemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const result = await apiService.getProblemById(id);
        if (result.success && result.problem) {
          setProblem(result.problem);
        } else {
          setError('Problem ticket not found.');
        }
      } catch (err) {
        setError(err.message || 'Failed to load ticket details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

  if (loading) return <DetailsSkeleton />;

  if (error || !problem) {
    return (
      <div className="max-w-md mx-auto my-12 text-center p-8 bg-white rounded-2xl border border-slate-200 shadow-xs">
        <h3 className="text-lg font-bold text-slate-800 mb-2">Ticket Not Found</h3>
        <p className="text-xs text-slate-500 mb-6">{error || 'The requested problem ticket could not be found.'}</p>
        <button
          onClick={() => navigate('/my-problems')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
        >
          Back to My Problems
        </button>
      </div>
    );
  }

  const createdDate = new Date(problem.created_at).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const updatedDate = new Date(problem.updated_at).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const locationText = typeof problem.location === 'object' && problem.location !== null
    ? `${problem.location.building} • ${problem.location.floor} ${problem.location.room ? `(${problem.location.room})` : ''}`
    : problem.location || 'Campus Facility';

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Back button */}
      <Link
        to="/my-problems"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to My Problems</span>
      </Link>

      {/* Main Ticket Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-lg">
              {problem.ticket_id}
            </span>
            <StatusBadge status={problem.status} />
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Calendar className="w-3.5 h-3.5" />
            <span>Updated: {updatedDate}</span>
          </div>
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
            {problem.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed whitespace-pre-line">
            {problem.description}
          </p>
        </div>

        {/* Key Metadata Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-400 font-medium block text-[10px] uppercase tracking-wider">Category</span>
            <div className="flex items-center gap-1.5 text-slate-800 font-semibold mt-0.5">
              <Tag className="w-3.5 h-3.5 text-indigo-600" />
              <span>{problem.category_name || problem.category}</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-400 font-medium block text-[10px] uppercase tracking-wider">Location</span>
            <div className="flex items-center gap-1.5 text-slate-800 font-semibold mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span className="truncate">{locationText}</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-400 font-medium block text-[10px] uppercase tracking-wider">Priority</span>
            <div className="flex items-center gap-2 mt-1">
              <PriorityBadge priority={problem.current_priority || problem.user_priority} />
              {problem.user_priority && problem.current_priority !== problem.user_priority && (
                <span className="text-[10px] text-slate-400 font-medium">(Admin updated)</span>
              )}
            </div>
          </div>
        </div>

        {/* Department Assignment notice if available */}
        {problem.assigned_department && (
          <div className="p-3.5 bg-indigo-50/60 border border-indigo-100 rounded-xl flex items-center gap-3 text-xs text-indigo-900">
            <Building2 className="w-4 h-4 text-indigo-600 shrink-0" />
            <div>
              <span className="font-semibold">Assigned Maintenance Unit:</span> {problem.assigned_department}
            </div>
          </div>
        )}

        {/* Attached Photo Preview if available */}
        {problem.image_url && (
          <div className="pt-2">
            <p className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-indigo-600" />
              <span>Attached Photo Evidence</span>
            </p>
            <div className="rounded-xl overflow-hidden border border-slate-200 max-w-md bg-slate-50">
              <img
                src={problem.image_url}
                alt="Problem Attachment"
                className="w-full max-h-64 object-cover"
              />
            </div>
          </div>
        )}
      </div>

      {/* Status Timeline Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
          Progress Timeline
        </h2>
        <StatusTimeline currentStatus={problem.status} timeline={problem.timeline || []} />
      </div>

      {/* Resolution & Feedback Section (Only if RESOLVED) */}
      {problem.status === 'RESOLVED' && (
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            <div>
              <h3 className="text-base font-bold text-emerald-950">Problem Resolved</h3>
              <p className="text-xs text-emerald-700">
                {problem.resolution?.resolved_at
                  ? `Completed on ${new Date(problem.resolution.resolved_at).toLocaleDateString()}`
                  : 'Resolution confirmed by maintenance department.'}
              </p>
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl border border-emerald-100 text-xs space-y-2">
            <p className="font-semibold text-slate-800">Resolution Details:</p>
            <p className="text-slate-600 leading-relaxed">
              {problem.resolution?.details || 'The issue has been physically inspected and repaired by campus maintenance personnel.'}
            </p>
            {problem.resolution?.resolved_by && (
              <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                Handled by: <span className="font-medium text-slate-600">{problem.resolution.resolved_by}</span>
              </p>
            )}
          </div>

          {/* Feedback section inside resolution card */}
          <div className="pt-2">
            {problem.feedback ? (
              <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Your Submitted Feedback</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= problem.feedback.rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                {problem.feedback.comment && (
                  <p className="text-xs text-slate-600 italic">"{problem.feedback.comment}"</p>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-between gap-4 p-4 bg-white rounded-xl border border-emerald-200">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">How was your resolution experience?</h4>
                  <p className="text-[11px] text-slate-500">Provide 1-5 star feedback to help improve campus response quality.</p>
                </div>
                <Link
                  to={`/problems/${problem.id || problem.ticket_id}/feedback`}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 shrink-0"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Give Feedback</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
