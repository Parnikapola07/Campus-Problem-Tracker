import React from 'react';
import { Link } from 'react-router-dom';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { ArrowUpRight, MapPin, User } from 'lucide-react';

export const AdminProblemTable = ({ problems = [] }) => {
  return (
    <div className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--bg-border)] shadow-xs overflow-hidden transition-colors duration-200">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-[var(--text-secondary)]">
          <thead className="bg-[var(--bg-surface-2)] border-b border-[var(--bg-border)] text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
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
          <tbody className="divide-y divide-[var(--bg-border)]">
            {problems.map((problem) => {
              const locationText = typeof problem.location === 'object' && problem.location !== null
                ? `${problem.location.building} (${problem.location.floor})`
                : problem.location || 'Campus Facility';

              const createdDate = new Date(problem.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              });

              return (
                <tr key={problem.id || problem.ticket_id} className="hover:bg-[var(--bg-surface-2)] transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
                    {problem.ticket_id}
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-[var(--text-primary)] max-w-xs truncate" title={problem.title}>
                    {problem.title}
                  </td>

                  <td className="py-3.5 px-4 text-[var(--text-secondary)] whitespace-nowrap">
                    {problem.category_name || problem.category}
                  </td>

                  <td className="py-3.5 px-4 text-[var(--text-secondary)] max-w-xs truncate" title={locationText}>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[var(--text-muted)] shrink-0" />
                      <span className="truncate">{locationText}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-[var(--text-secondary)] whitespace-nowrap">
                    <div className="flex items-center gap-1 font-medium">
                      <User className="w-3 h-3 text-[var(--text-muted)]" />
                      <span>{problem.reporter_id || problem.reporter_name || 'Student'}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <PriorityBadge priority={problem.current_priority || problem.user_priority} />
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <StatusBadge status={problem.status} />
                  </td>

                  <td className="py-3.5 px-4 text-[var(--text-secondary)] whitespace-nowrap">
                    <span className="text-[11px] font-medium text-[var(--text-secondary)] bg-[var(--bg-surface-2)] border border-[var(--bg-border)] px-2 py-0.5 rounded">
                      {problem.assigned_department || 'Unassigned'}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <Link
                      to={`/admin/problems/${problem.id || problem.ticket_id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-600 hover:text-white text-indigo-700 dark:text-indigo-300 font-semibold text-xs rounded-lg transition-colors border border-indigo-200 dark:border-indigo-800/50 hover:border-indigo-600"
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
