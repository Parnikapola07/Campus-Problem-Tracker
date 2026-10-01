import React, { useEffect, useState } from 'react';
import { apiService } from '../../services/api';
import { PageHeader } from '../../components/PageHeader';
import { ConfirmModal } from '../../components/ConfirmModal';
import { Building2, Plus, Users, CheckCircle2, Clock } from 'lucide-react';

export const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add Dept Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchDepts = async () => {
    setLoading(true);
    try {
      const res = await apiService.getDepartments();
      if (res.success) setDepartments(res.departments || []);
    } catch (err) {
      console.error('Failed to load departments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepts();
  }, []);

  const handleAddDepartment = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    try {
      const res = await apiService.createDepartment({ name: name.trim(), code: code.trim() });
      if (res.success) {
        setModalOpen(false);
        setName('');
        setCode('');
        fetchDepts();
      }
    } catch (err) {
      alert(err.message || 'Failed to create department.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      <PageHeader
        title="Campus Departments"
        subtitle="Manage maintenance units responsible for campus problem resolution."
        action={
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Department</span>
          </button>
        }
      />

      {loading ? (
        <div className="p-8 text-center text-slate-500">Loading departments...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {departments.map((dept) => (
            <div key={dept.id} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{dept.name}</h3>
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">{dept.code}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center text-xs">
                <div className="p-2 bg-amber-50/60 rounded-lg">
                  <span className="text-slate-500 text-[10px] block font-medium">Active</span>
                  <span className="font-extrabold text-amber-700 text-sm">{dept.active_problems || 0}</span>
                </div>
                <div className="p-2 bg-emerald-50/60 rounded-lg">
                  <span className="text-slate-500 text-[10px] block font-medium">Resolved</span>
                  <span className="font-extrabold text-emerald-700 text-sm">{dept.resolved_problems || 0}</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg">
                  <span className="text-slate-500 text-[10px] block font-medium">Staff</span>
                  <span className="font-extrabold text-slate-800 text-sm">{dept.staff_count || 1}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Department Modal */}
      <ConfirmModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create New Department"
      >
        <form onSubmit={handleAddDepartment} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Department Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Environmental Sanitation Services"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Department Code</label>
            <input
              type="text"
              placeholder="e.g. SANITATION"
              value={code}
              onChange={(e) => setCode(e.target.value)}
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
              {submitting ? 'Creating...' : 'Create Department'}
            </button>
          </div>
        </form>
      </ConfirmModal>
    </div>
  );
};
