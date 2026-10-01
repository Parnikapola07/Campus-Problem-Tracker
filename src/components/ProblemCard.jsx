import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { MapPin, Calendar, ArrowRight, Tag } from 'lucide-react';

export const ProblemCard = ({ problem }) => {
  const formattedDate = new Date(problem.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const locationText = typeof problem.location === 'object' && problem.location !== null
    ? `${problem.location.building} • ${problem.location.floor}`
    : problem.location || 'Campus Property';

  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="bg-[var(--bg-surface)] rounded-xl border border-[var(--bg-border)] shadow-sm hover:shadow-md transition-all duration-200 p-5 flex flex-col justify-between"
    >
      <div>
        {/* Top bar: Ticket ID & Status */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2.5 py-1 rounded-md border border-indigo-100 dark:border-indigo-800/50">
              {problem.ticket_id}
            </span>
            <PriorityBadge priority={problem.current_priority || problem.user_priority} />
          </div>
          <StatusBadge status={problem.status} />
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-[var(--text-primary)] line-clamp-2 mb-2 leading-snug">
          {problem.title}
        </h3>

        {/* Description snippet */}
        <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mb-4">
          {problem.description}
        </p>
      </div>

      <div>
        {/* Meta Info */}
        <div className="space-y-1.5 pt-3 border-t border-[var(--bg-border)] text-xs text-[var(--text-muted)] mb-4">
          <div className="flex items-center gap-2">
            <Tag className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate font-medium text-[var(--text-secondary)]">{problem.category_name || problem.category || 'General Issue'}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{locationText}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span>Reported on {formattedDate}</span>
          </div>
        </div>

        {/* Action Button */}
        <Link
          to={`/problems/${problem.id || problem.ticket_id}`}
          className="inline-flex items-center justify-center gap-2 w-full py-2 px-3 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50/60 dark:bg-indigo-900/20 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white rounded-lg transition-all duration-200 border border-indigo-100 dark:border-indigo-800/40 hover:border-indigo-600"
        >
          <span>View Problem Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </motion.div>
  );
};
