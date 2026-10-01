import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import { StatusBadge } from '../../components/StatusBadge';
import { PriorityBadge } from '../../components/PriorityBadge';
import { StatusTimeline } from '../../components/StatusTimeline';
import { DetailsSkeleton } from '../../components/LoadingSkeleton';
import { ConfirmModal } from '../../components/ConfirmModal';
import {
  ArrowLeft,
  MapPin,
  Tag,
  Calendar,
  User,
  Building2,
  CheckCircle2,
  XCircle,
  Clock,
  Flame,
  AlertTriangle,
  Star,
  Check,
  Image as ImageIcon
} from 'lucide-react';

export const ProblemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [problem, setProblem] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [staffList, setStaffList] = useState([]);

  // Form states for admin controls
  const [adminPriority, setAdminPriority] = useState('MEDIUM');
  const [selectedDeptId, setSelectedDeptId] = useState('');
  const [selectedStaffId, setSelectedStaffId] = useState('');

  // Modals
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [resolutionNote, setResolutionNote] = useState('');

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const fetchProblemData = async () => {
    setLoading(true);
    try {
      const [probRes, deptRes] = await Promise.all([
        apiService.getProblemById(id),
        apiService.getDepartments()
      ]);

      if (probRes.success && probRes.problem) {
        const p = probRes.problem;
        setProblem(p);
        setAdminPriority(p.current_priority || p.user_priority || 'MEDIUM');
        setSelectedDeptId(p.assigned_department_id || '');
        setSelectedStaffId(p.assigned_staff_id || '');
      }
      if (deptRes.success) {
        setDepartments(deptRes.departments || []);
      }
    } catch (err) {
      console.error('Failed to load problem:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblemData();
  }, [id]);

  // Load staff when department selection changes
  useEffect(() => {
    if (selectedDeptId) {
      apiService.getStaff(selectedDeptId).then(res => {
        if (res.success) setStaffList(res.staff || []);
      });
    } else {
      setStaffList([]);
    }
  }, [selectedDeptId]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Admin Actions
  const handleUpdatePriority = async () => {
    setActionLoading(true);
    try {
      const res = await apiService.updateProblemPriority(id, adminPriority);
      if (res.success) {
        setProblem(res.problem);
        showToast('Priority updated successfully.');
      }
    } catch (err) {
      alert(err.message || 'Failed to update priority');
    } finally {
      setActionLoading(false);
    }
  };

  const handleVerify = async () => {
    setActionLoading(true);
    try {
      const res = await apiService.updateProblemStatus(id, 'VERIFIED', 'Ticket verified by Admin.');
      if (res.success) {
        setProblem(res.problem);
        showToast('Problem ticket verified successfully.');
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) return;
    setActionLoading(true);
    try {
      const res = await apiService.updateProblemStatus(id, 'REJECTED', '', rejectReason.trim());
      if (res.success) {
        setProblem(res.problem);
        setRejectModalOpen(false);
        showToast('Ticket rejected.');
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedDeptId) return;
    setActionLoading(true);
    try {
      const res = await apiService.assignProblem(id, selectedDeptId, selectedStaffId);
      if (res.success) {
        setProblem(res.problem);
        showToast('Department and Staff assigned successfully.');
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleStartProgress = async () => {
    setActionLoading(true);
    try {
      const res = await apiService.updateProblemStatus(id, 'IN_PROGRESS', 'Maintenance team dispatched and work in progress.');
      if (res.success) {
        setProblem(res.problem);
        showToast('Status updated to In Progress.');
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleResolve = async () => {
    if (!resolutionNote.trim()) return;
    setActionLoading(true);
    try {
      const res = await apiService.updateProblemStatus(id, 'RESOLVED', resolutionNote.trim());
      if (res.success) {
        setProblem(res.problem);
        setResolveModalOpen(false);
        showToast('Problem marked as RESOLVED.');
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <DetailsSkeleton />;
  if (!problem) return <div className="p-8 text-center text-slate-500">Problem not found.</div>;

  const locationText = typeof problem.location === 'object' && problem.location !== null
    ? `${problem.location.building} • ${problem.location.floor} ${problem.location.room ? `(${problem.location.room})` : ''}`
    : problem.location || 'Campus Facility';

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-slate-900 text-white text-xs font-semibold rounded-xl shadow-xl flex items-center gap-2 border border-slate-700">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/problems"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Problems</span>
        </Link>
      </div>

      {/* Ticket Master Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1 rounded-lg">
              {problem.ticket_id}
            </span>
            <StatusBadge status={problem.status} />
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>Reported by: <strong className="text-slate-800">{problem.reporter_id || 'CS24001'}</strong></span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{new Date(problem.created_at).toLocaleDateString()}</span>
            </div>
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

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-400 font-semibold text-[10px] uppercase">Category</span>
            <p className="font-semibold text-slate-800 mt-0.5">{problem.category_name || problem.category}</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-400 font-semibold text-[10px] uppercase">Location</span>
            <p className="font-semibold text-slate-800 mt-0.5 truncate">{locationText}</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-400 font-semibold text-[10px] uppercase">Current Priority</span>
            <div className="mt-1">
              <PriorityBadge priority={problem.current_priority || problem.user_priority} />
            </div>
          </div>
        </div>

        {/* Attached Image Preview */}
        {problem.image_url && (
          <div className="pt-2">
            <p className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-indigo-600" />
              <span>User Attached Photo Evidence</span>
            </p>
            <div className="rounded-xl overflow-hidden border border-slate-200 max-w-md bg-slate-50">
              <img src={problem.image_url} alt="Proof" className="w-full max-h-64 object-cover" />
            </div>
          </div>
        )}
      </div>

      {/* ADMIN CONTROLS SECTION */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-rose-400" />
            <span>Administrator Action & Workflow Controls</span>
          </h2>
          <span className="text-[10px] font-mono font-bold bg-slate-800 text-rose-300 px-2.5 py-1 rounded border border-slate-700">
            Current Status: {problem.status}
          </span>
        </div>

        {/* Workflow Action 1: Verify or Reject */}
        {problem.status === 'REPORTED' && (
          <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Step 1: Initial Verification</h3>
            <p className="text-xs text-slate-400">Review ticket validity. Verify to queue for maintenance assignment or reject if invalid/duplicate.</p>
            
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={handleVerify}
                disabled={actionLoading}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Verify Problem Ticket</span>
              </button>

              <button
                onClick={() => setRejectModalOpen(true)}
                disabled={actionLoading}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject Ticket</span>
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Admin Priority Adjustment */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200">Admin Priority Control</label>
              <span className="text-[11px] text-slate-400">User Suggested: <strong>{problem.user_priority}</strong></span>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={adminPriority}
                onChange={(e) => setAdminPriority(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="LOW">LOW — Minor Inconvenience</option>
                <option value="MEDIUM">MEDIUM — Normal Maintenance</option>
                <option value="HIGH">HIGH — Significant Impact</option>
                <option value="CRITICAL">CRITICAL — Urgent Hazard</option>
              </select>

              <button
                onClick={handleUpdatePriority}
                disabled={actionLoading || adminPriority === problem.current_priority}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs rounded-xl transition-all"
              >
                Set Priority
              </button>
            </div>
          </div>

          {/* Department & Staff Assignment */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-3">
            <label className="block text-xs font-bold text-slate-200">Assign Maintenance Unit & Staff</label>

            <div className="space-y-2">
              <select
                value={selectedDeptId}
                onChange={(e) => setSelectedDeptId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="">-- Select Department --</option>
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>

              {selectedDeptId && (
                <select
                  value={selectedStaffId}
                  onChange={(e) => setSelectedStaffId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="">-- Select Staff Officer (Optional) --</option>
                  {staffList.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.staff_id})</option>
                  ))}
                </select>
              )}

              <button
                onClick={handleAssign}
                disabled={actionLoading || !selectedDeptId}
                className="w-full py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-semibold text-xs rounded-xl transition-all"
              >
                Save Department Assignment
              </button>
            </div>
          </div>
        </div>

        {/* Progress Transitions & Resolution Trigger */}
        {problem.status !== 'RESOLVED' && problem.status !== 'REJECTED' && (
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-white">Status Workflow State</p>
              <p className="text-[11px] text-slate-400">Advance progress to In Progress or complete ticket resolution.</p>
            </div>

            <div className="flex items-center gap-3">
              {problem.status !== 'IN_PROGRESS' && (
                <button
                  onClick={handleStartProgress}
                  disabled={actionLoading}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-all"
                >
                  <Clock className="w-4 h-4" />
                  <span>Start Progress</span>
                </button>
              )}

              <button
                onClick={() => setResolveModalOpen(true)}
                disabled={actionLoading}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow-md transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark as Resolved</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Progress Timeline Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
          Complete Ticket Audit Trail & Timeline
        </h2>
        <StatusTimeline currentStatus={problem.status} timeline={problem.timeline || []} />
      </div>

      {/* User Feedback Preview (If present) */}
      {problem.feedback && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">Student Resolution Rating</h3>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${star <= problem.feedback.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`}
                />
              ))}
            </div>
          </div>
          {problem.feedback.comment && (
            <p className="text-xs text-slate-600 italic">"{problem.feedback.comment}"</p>
          )}
          <p className="text-[10px] text-slate-400 pt-1">
            Submitted on {new Date(problem.feedback.submitted_at).toLocaleString()}
          </p>
        </div>
      )}

      {/* Rejection Modal */}
      <ConfirmModal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reject Problem Ticket"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600">
            Please enter an official reason for rejecting ticket <strong className="font-mono">{problem.ticket_id}</strong>. This reason will be logged and visible to the reporter.
          </p>
          <textarea
            rows={3}
            placeholder="e.g. Duplicate report already being serviced under CPT-2026-0001."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setRejectModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleReject}
              disabled={!rejectReason.trim()}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-semibold text-xs rounded-xl"
            >
              Confirm Rejection
            </button>
          </div>
        </div>
      </ConfirmModal>

      {/* Resolution Modal */}
      <ConfirmModal
        isOpen={resolveModalOpen}
        onClose={() => setResolveModalOpen(false)}
        title="Mark Problem as Resolved"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600">
            Provide resolution details explaining how the issue was fixed for ticket <strong className="font-mono">{problem.ticket_id}</strong>.
          </p>
          <textarea
            rows={4}
            placeholder="e.g. Faulty network switch replaced on Block C 2nd floor. Connectivity tested and verified."
            value={resolutionNote}
            onChange={(e) => setResolutionNote(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setResolveModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleResolve}
              disabled={!resolutionNote.trim()}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-xs rounded-xl"
            >
              Confirm Resolution
            </button>
          </div>
        </div>
      </ConfirmModal>
    </div>
  );
};
