import React, { useEffect, useState } from 'react';
import { apiService } from '../../services/api';
import { PageHeader } from '../../components/PageHeader';
import { ConfirmModal } from '../../components/ConfirmModal';
import { MapPin, Plus, Building } from 'lucide-react';

export const Locations = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [building, setBuilding] = useState('');
  const [floor, setFloor] = useState('');
  const [room, setRoom] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchLocs = async () => {
    setLoading(true);
    try {
      const res = await apiService.getLocations();
      if (res.success) setLocations(res.locations || []);
    } catch (err) {
      console.error('Failed to load locations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocs();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!building.trim()) return;

    setSubmitting(true);
    try {
      const res = await apiService.createLocation({ building: building.trim(), floor: floor.trim() || '1st Floor', room: room.trim() });
      if (res.success) {
        setModalOpen(false);
        setBuilding('');
        setFloor('');
        setRoom('');
        fetchLocs();
      }
    } catch (err) {
      alert(err.message || 'Failed to add location');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      <PageHeader
        title="Campus Locations"
        subtitle="Manage building, block, floor, and room records for campus maintenance dispatch."
        action={
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Location</span>
          </button>
        }
      />

      {loading ? (
        <div className="p-8 text-center text-slate-500">Loading locations...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {locations.map(loc => (
            <div key={loc.id} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{loc.building}</h3>
                  <p className="text-xs text-slate-500">{loc.floor} {loc.room ? `• ${loc.room}` : ''}</p>
                </div>
              </div>

              <div className="px-2.5 py-1 bg-slate-100 rounded-lg text-xs font-semibold text-slate-700 shrink-0">
                {loc.problem_count || 0} Tickets
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      <ConfirmModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Campus Location"
      >
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Building / Block Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Block D - Innovation Center"
              value={building}
              onChange={(e) => setBuilding(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Floor Level</label>
            <input
              type="text"
              placeholder="e.g. 1st Floor"
              value={floor}
              onChange={(e) => setFloor(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Specific Room / Area</label>
            <input
              type="text"
              placeholder="e.g. Auditorium Hall"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
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
              {submitting ? 'Adding...' : 'Add Location'}
            </button>
          </div>
        </form>
      </ConfirmModal>
    </div>
  );
};
