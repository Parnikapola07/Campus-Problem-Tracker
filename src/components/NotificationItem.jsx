import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, CheckCircle2, Info, ArrowUpRight, Check } from 'lucide-react';

export const NotificationItem = ({ notification, onMarkRead }) => {
  const formattedTime = new Date(notification.created_at).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div
      className={`p-4 rounded-xl border transition-all duration-200 flex items-start justify-between gap-3 ${
        notification.read
          ? 'bg-white border-slate-200 text-slate-700'
          : 'bg-indigo-50/40 border-indigo-200 text-slate-900 shadow-xs ring-1 ring-indigo-500/10'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`p-2.5 rounded-lg shrink-0 ${
            notification.read ? 'bg-slate-100 text-slate-500' : 'bg-indigo-100 text-indigo-600'
          }`}
        >
          {notification.type === 'resolution' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          ) : (
            <Bell className="w-5 h-5" />
          )}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold">{notification.title}</h4>
            {!notification.read && (
              <span className="inline-block w-2 h-2 rounded-full bg-indigo-600"></span>
            )}
          </div>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notification.message}</p>
          <span className="text-[11px] text-slate-400 mt-2 inline-block">{formattedTime}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {notification.problem_id && (
          <Link
            to={`/problems/${notification.problem_id}`}
            className="p-1.5 text-xs text-indigo-600 hover:bg-indigo-100 rounded-md transition-colors flex items-center gap-1 font-medium"
            title="View Ticket"
          >
            <span>View</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        )}

        {!notification.read && onMarkRead && (
          <button
            onClick={() => onMarkRead(notification.id)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
            title="Mark as read"
          >
            <Check className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
