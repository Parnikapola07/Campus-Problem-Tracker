import React, { useEffect, useState } from 'react';
import { apiService } from '../../services/api';
import { PageHeader } from '../../components/PageHeader';
import { ConfirmModal } from '../../components/ConfirmModal';
import { Users, Plus, Mail, Building2, UserCheck } from 'lucide-react';

export const Staff = () => {
  const [staff, setStaff] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  // Add Staff Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [deptId, setDeptId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchStaffData = async () => {
    setLoading(true);
    try {
      const [staffRes, deptRes] = await Promise.all([
        apiService.getStaff(selectedDeptFilter === 'ALL' ? null : selectedDeptFilter),
        apiService.getDepartments()
      ]);
      if (staffRes.success) setStaff(staffRes.staff || []);
      if (deptRes.success) setDepartments(deptRes.departments || []);
    } catch (err) {
      console.error('Failed to load staff:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffData();
  }, [selectedDeptFilter]);

  const handleAddStaff = async (e) => {
    e.preventDefault();
    if (!name.trim() || !deptId) return;

    setSubmitting(true);
    try {
      const deptObj = departments.find(d => d.id === deptId);
      const res = await apiService.createStaff({
        name: name.trim(),
        email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@campus.edu`,
        department_id: deptId,
        department_name: deptObj ? deptObj.name : 'Maintenance'
      });

      if (res.success) {
        setModalOpen(false);
        setName('');
        setEmail('');
        setDeptId('');
        fetchStaffData();
      }
    } catch (err) {
      alert(err.message || 'Failed to add staff.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      <PageHeader
        title="Campus Staff Management"
        subtitle="Manage maintenance engineers, technicians, and departmental staff officers."
        action={
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Staff Officer</span>
          </button>
        }
      />

      {/* Department Filter Bar */}
      <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200">
        <span className="text-xs font-bold text-slate-700">Filter Department:</span>
        <select
          value={selectedDeptFilter}
          onChange={(e) => setSelectedDeptFilter(e.target.value)}
          className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none"
        >
          <option value="ALL">All Departments</option>
          {departments.map(d => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-500">Loading staff directory...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {staff.map((member) => (
            <div key={member.id} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm shrink-0">
                  {member.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 truncate">{member.name}</h3>
                  <span className="text-[10px] font-mono text-slate-400 font-semibold">{member.staff_id}</span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate font-medium text-slate-800">{member.department_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{member.email}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-center text-xs">
                <div className="p-2 bg-amber-50/60 rounded-lg">
                  <span className="text-slate-500 text-[10px] block font-medium">Assigned Load</span>
                  <span className="font-bold text-amber-700">{member.active_problems || 0} Tickets</span>
                </div>
                <div className="p-2 bg-emerald-50/60 rounded-lg">
                  <span className="text-slate-500 text-[10px] block font-medium">Resolved</span>
                  <span className="font-bold text-emerald-700">{member.resolved_problems || 0} Tickets</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Staff Modal */}
      <ConfirmModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Staff Member"
      >
        <form onSubmit={handleAddStaff} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Suresh Kumar"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Department *</label>
            <select
              required
              value={deptId}
              onChange={(e) => setDeptId(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              <option value="">-- Choose Department --</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              placeholder="e.g. suresh.k@campus.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl"
            >
              {submitting ? 'Adding...' : 'Add Staff'}
            </button>
          </div>
        </form>
      </ConfirmModal>
    </div>
  );
};
