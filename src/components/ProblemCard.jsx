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
      className="bg-white rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 p-5 flex flex-col justify-between"
    >
      <div>
        {/* Top bar: Ticket ID & Status */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
              {problem.ticket_id}
            </span>
            <PriorityBadge priority={problem.current_priority || problem.user_priority} />
          </div>
          <StatusBadge status={problem.status} />
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-slate-900 line-clamp-2 mb-2 leading-snug group-hover:text-indigo-600 transition-colors">
          {problem.title}
        </h3>

        {/* Description snippet */}
        <p className="text-xs text-slate-600 line-clamp-2 mb-4">
          {problem.description}
        </p>
      </div>

      <div>
        {/* Meta Info */}
        <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs text-slate-500 mb-4">
          <div className="flex items-center gap-2">
            <Tag className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate font-medium text-slate-700">{problem.category_name || problem.category || 'General Issue'}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{locationText}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Reported on {formattedDate}</span>
          </div>
        </div>

        {/* Action Button */}
        <Link
          to={`/problems/${problem.id || problem.ticket_id}`}
          className="inline-flex items-center justify-center gap-2 w-full py-2 px-3 text-xs font-semibold text-indigo-600 bg-indigo-50/60 hover:bg-indigo-600 hover:text-white rounded-lg transition-all duration-200"
        >
          <span>View Problem Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </motion.div>
  );
};
