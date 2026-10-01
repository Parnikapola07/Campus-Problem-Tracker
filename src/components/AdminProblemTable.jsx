import React from 'react';
import { Link } from 'react-router-dom';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { ArrowUpRight, MapPin, User, Calendar } from 'lucide-react';

export const AdminProblemTable = ({ problems = [] }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Ticket ID</th>
              <th className="py-3.5 px-4">Problem Title</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Location</th>
              <th className="py-3.5 px-4">Reporter</th>
              <th className="py-3.5 px-4">Priority</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Assigned Dept</th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {problems.map((problem) => {
              const locationText = typeof problem.location === 'object' && problem.location !== null
                ? `${problem.location.building} (${problem.location.floor})`
                : problem.location || 'Campus Facility';

              const createdDate = new Date(problem.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              });

              return (
                <tr key={problem.id || problem.ticket_id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-indigo-600 whitespace-nowrap">
                    {problem.ticket_id}
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-slate-900 max-w-xs truncate" title={problem.title}>
                    {problem.title}
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                    {problem.category_name || problem.category}
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate" title={locationText}>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{locationText}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                    <div className="flex items-center gap-1 font-medium">
                      <User className="w-3 h-3 text-slate-400" />
                      <span>{problem.reporter_id || problem.reporter_name || 'Student'}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <PriorityBadge priority={problem.current_priority || problem.user_priority} />
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <StatusBadge status={problem.status} />
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                    <span className="text-[11px] font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      {problem.assigned_department || 'Unassigned'}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <Link
                      to={`/admin/problems/${problem.id || problem.ticket_id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 font-semibold text-xs rounded-lg transition-colors"
                    >
                      <span>Manage</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
