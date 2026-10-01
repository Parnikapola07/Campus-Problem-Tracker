import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiService } from '../../services/api';
import { PageHeader } from '../../components/PageHeader';
import { DetailsSkeleton } from '../../components/LoadingSkeleton';
import { Star, ArrowLeft, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';

export const Feedback = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [problem, setProblem] = useState(null);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const result = await apiService.getProblemById(id);
        if (result.success && result.problem) {
          if (result.problem.status !== 'RESOLVED') {
            setError('Feedback can only be submitted for RESOLVED problem tickets.');
          } else if (result.problem.feedback) {
            setRating(result.problem.feedback.rating);
            setComment(result.problem.feedback.comment || '');
          }
          setProblem(result.problem);
        } else {
          setError('Problem ticket not found.');
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch ticket info.');
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) return;

    setSubmitting(true);
    try {
      const result = await apiService.submitFeedback(id, { rating, comment: comment.trim() });
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate(`/problems/${id}`);
        }, 1500);
      }
    } catch (err) {
      setError(err.message || 'Failed to submit feedback.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <DetailsSkeleton />;

  if (error && !problem) {
    return (
      <div className="max-w-md mx-auto my-12 text-center p-8 bg-white rounded-2xl border border-slate-200 shadow-xs">
        <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-800 mb-2">Notice</h3>
        <p className="text-xs text-slate-500 mb-6">{error}</p>
        <button
          onClick={() => navigate('/my-problems')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
        >
          Back to My Problems
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-16">
      <Link
        to={`/problems/${id}`}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Ticket #{problem?.ticket_id}</span>
      </Link>

      <PageHeader
        title="Resolution Feedback"
        subtitle={`Was ticket ${problem?.ticket_id} resolved to your satisfaction?`}
      />

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Thank You For Your Feedback!</h3>
          <p className="text-xs text-slate-500">Redirecting back to ticket details...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          {/* Ticket Context */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
              {problem?.ticket_id}
            </span>
            <h3 className="text-sm font-semibold text-slate-800 mt-2">{problem?.title}</h3>
            <p className="text-xs text-slate-500 mt-0.5">Resolved by {problem?.resolution?.resolved_by || 'Campus Maintenance'}</p>
          </div>

          {/* Star Rating Section */}
          <div className="space-y-2 text-center py-2">
            <label className="block text-xs font-bold text-slate-800">
              Rate your resolution experience <span className="text-rose-500">*</span>
            </label>
            
            <div className="flex items-center justify-center gap-2 pt-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const active = star <= (hoverRating || rating);
                return (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="p-1 transition-transform hover:scale-110 focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        active
                          ? 'text-amber-400 fill-amber-400 drop-shadow-xs'
                          : 'text-slate-200 hover:text-amber-200'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
            
            <p className="text-xs text-slate-400 font-medium pt-1">
              {rating === 5 && 'Outstanding service'}
              {rating === 4 && 'Good resolution'}
              {rating === 3 && 'Average experience'}
              {rating === 2 && 'Needs improvement'}
              {rating === 1 && 'Unsatisfactory'}
            </p>
          </div>

          {/* Comment textarea */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Optional Comments or Suggestions
            </label>
            <textarea
              rows={4}
              placeholder="Tell us more about how the maintenance team handled your ticket..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate(`/problems/${id}`)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 disabled:opacity-70"
            >
              {submitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
