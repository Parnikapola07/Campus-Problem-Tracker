import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { apiService } from '../../services/api';
import { PageHeader } from '../../components/PageHeader';
import { ImageUpload } from '../../components/ImageUpload';
import { ConfirmModal } from '../../components/ConfirmModal';
import { 
  FileText, 
  MapPin, 
  Tag, 
  AlertTriangle, 
  UploadCloud, 
  CheckCircle2, 
  ArrowRight,
  Info,
  AlertCircle
} from 'lucide-react';

export const ReportProblem = () => {
  const navigate = useNavigate();

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [building, setBuilding] = useState('');
  const [floor, setFloor] = useState('');
  const [room, setRoom] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [image, setImage] = useState(null);

  // Dynamic Options & UI State
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Success Modal
  const [submittedTicket, setSubmittedTicket] = useState(null);

  useEffect(() => {
    const fetchOptions = async () => {
      setLoadingOptions(true);
      try {
        const [catRes, locRes] = await Promise.all([
          apiService.getCategories(),
          apiService.getLocations()
        ]);
        if (catRes.success) setCategories(catRes.categories || []);
        if (locRes.success) setLocations(locRes.locations || []);
      } catch (err) {
        console.error('Failed to load categories/locations:', err);
      } finally {
        setLoadingOptions(false);
      }
    };

    fetchOptions();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Please enter a problem title.';
    else if (title.trim().length < 5) newErrors.title = 'Title must be at least 5 characters long.';

    if (!description.trim()) newErrors.description = 'Please describe the problem details.';
    else if (description.trim().length < 15) newErrors.description = 'Description should be at least 15 characters to explain the issue clearly.';

    if (!categoryId) newErrors.categoryId = 'Please select a category.';

    if (!building.trim()) newErrors.building = 'Please select or enter a building / block.';
    if (!floor.trim()) newErrors.floor = 'Please specify the floor.';

    if (!priority) newErrors.priority = 'Please select a priority level.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const selectedCatObj = categories.find(c => c.id === categoryId);
      const payload = {
        title: title.trim(),
        description: description.trim(),
        category_id: categoryId,
        category_name: selectedCatObj ? selectedCatObj.name : 'General',
        building: building.trim(),
        floor: floor.trim(),
        room: room.trim() || 'General Area',
        priority: priority,
        image_url: image
      };

      const result = await apiService.createProblem(payload);
      if (result.success) {
        setSubmittedTicket(result.problem || { ticket_id: result.ticket_id, id: result.ticket_id });
      }
    } catch (err) {
      setErrors({ form: err.message || 'Failed to submit problem. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const priorityOptions = [
    { value: 'LOW', label: 'Low', desc: 'Minor inconvenience, non-blocking' },
    { value: 'MEDIUM', label: 'Medium', desc: 'Affects normal usage, needs fix' },
    { value: 'HIGH', label: 'High', desc: 'Significantly affects daily operations' },
    { value: 'CRITICAL', label: 'Critical', desc: 'Urgent safety / infrastructure hazard' }
  ];

  return (
    <div className="max-w-4xl mx-auto pb-16">
      <PageHeader
        title="Report a Campus Problem"
        subtitle="Submit issues occurring inside campus facilities for quick maintenance intervention."
      />

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Global Error Alert */}
        {errors.form && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3 text-xs">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>{errors.form}</div>
          </div>
        )}

        {/* Section 1: Problem Information */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <FileText className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">1. Problem Details</h2>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Problem Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Wi-Fi connection failing in Block C 2nd Floor"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors({ ...errors, title: null });
              }}
              className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all ${
                errors.title ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
              }`}
            />
            {errors.title && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Full Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="Provide specific details about the issue, symptoms, exact spot, or any error message..."
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors({ ...errors, description: null });
              }}
              className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all ${
                errors.description ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
              }`}
            />
            {errors.description && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.description}</p>}
          </div>
        </div>

        {/* Section 2: Category */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Tag className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">2. Issue Category</h2>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Category <span className="text-rose-500">*</span>
            </label>
            <select
              value={categoryId}
              onChange={(e) => {
                setCategoryId(e.target.value);
                if (errors.categoryId) setErrors({ ...errors, categoryId: null });
              }}
              className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all ${
                errors.categoryId ? 'border-rose-400' : 'border-slate-200'
              }`}
            >
              <option value="">-- Choose Category --</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            {errors.categoryId && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.categoryId}</p>}
          </div>
        </div>

        {/* Section 3: Location */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <MapPin className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">3. Location Information</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Building / Block <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Block C"
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all ${
                  errors.building ? 'border-rose-400' : 'border-slate-200'
                }`}
              />
              {errors.building && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.building}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Floor <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 2nd Floor"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all ${
                  errors.floor ? 'border-rose-400' : 'border-slate-200'
                }`}
              />
              {errors.floor && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.floor}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Room / Area (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Room C204 / Hallway"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Suggested Priority */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">4. Suggested Priority</h2>
            </div>
          </div>

          <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-xl text-xs text-indigo-900 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <p>
              <span className="font-bold">Note:</span> Your selected priority is a suggestion. The maintenance admin has final authority to review and update priority upon ticket verification.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {priorityOptions.map((opt) => (
              <label
                key={opt.value}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  priority === opt.value
                    ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-600/20'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{opt.label}</span>
                  <input
                    type="radio"
                    name="priority"
                    value={opt.value}
                    checked={priority === opt.value}
                    onChange={(e) => setPriority(e.target.value)}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">{opt.desc}</p>
              </label>
            ))}
          </div>
        </div>

        {/* Section 5: Image Upload */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <UploadCloud className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">5. Attach Photo Evidence (Optional)</h2>
          </div>

          <ImageUpload
            image={image}
            onChange={setImage}
            onError={(msg) => setErrors({ ...errors, image: msg })}
          />
          {errors.image && <p className="text-xs text-rose-600 font-medium">{errors.image}</p>}
        </div>

        {/* Section 6: Submit */}
        <div className="flex items-center justify-end gap-4">
          <Link
            to="/dashboard"
            className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-semibold text-xs rounded-xl shadow-md shadow-indigo-600/20 flex items-center gap-2 transition-all disabled:opacity-70"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Submitting Ticket...</span>
              </>
            ) : (
              <>
                <span>Submit Problem Report</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Success Ticket Modal */}
      <ConfirmModal
        isOpen={!!submittedTicket}
        onClose={() => navigate('/dashboard')}
        title="Problem Reported Successfully"
      >
        <div className="text-center space-y-4 py-2">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <p className="text-xs text-slate-600">
            Your problem report has been submitted to the maintenance department. Your tracking ticket ID is:
          </p>

          <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
            <span className="font-mono text-xl font-extrabold text-indigo-700">
              {submittedTicket?.ticket_id}
            </span>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => navigate(`/problems/${submittedTicket?.id || submittedTicket?.ticket_id}`)}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl transition-colors"
            >
              View Problem Details
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </ConfirmModal>
    </div>
  );
};
