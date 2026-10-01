import React from 'react';
import { Link } from 'react-router-dom';
import { Inbox } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = Inbox,
  title = "No data found",
  description = "There are no items to display at this time.",
  actionText,
  actionLink,
  onActionClick
}) => {
  return (
    <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-10 text-center flex flex-col items-center justify-center max-w-lg mx-auto my-8">
      <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 shadow-inner">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">{description}</p>
      
      {actionText && actionLink && (
        <Link
          to={actionLink}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-sm hover:shadow transition-all duration-200"
        >
          {actionText}
        </Link>
      )}

      {actionText && !actionLink && onActionClick && (
        <button
          onClick={onActionClick}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-sm hover:shadow transition-all duration-200"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
