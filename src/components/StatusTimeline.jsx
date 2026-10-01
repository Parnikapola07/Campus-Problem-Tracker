import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, FileText, UserCheck, CheckCircle, XCircle } from 'lucide-react';

const STANDARD_STEPS = [
  { status: 'REPORTED', label: 'Reported', icon: FileText, desc: 'Problem ticket submitted by user' },
  { status: 'VERIFIED', label: 'Verified', icon: CheckCircle2, desc: 'Verified by Campus Helpdesk' },
  { status: 'ASSIGNED', label: 'Assigned', icon: UserCheck, desc: 'Assigned to maintenance team' },
  { status: 'IN_PROGRESS', label: 'In Progress', icon: Clock, desc: 'Technicians resolving issue' },
  { status: 'RESOLVED', label: 'Resolved', icon: CheckCircle, desc: 'Issue completely resolved' }
];

export const StatusTimeline = ({ currentStatus = 'REPORTED', timeline = [] }) => {
  const isRejected = currentStatus?.toUpperCase() === 'REJECTED';

  // Map timeline entries by status key
  const timelineMap = {};
  timeline.forEach(item => {
    timelineMap[item.status?.toUpperCase()] = item;
  });

  const getStepIndex = (status) => {
    const order = ['REPORTED', 'VERIFIED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED'];
    return order.indexOf(status?.toUpperCase());
  };

  const currentIndex = getStepIndex(currentStatus);

  if (isRejected) {
    const rejectedItem = timelineMap['REJECTED'] || {};
    return (
      <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 flex items-start gap-3">
        <XCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-sm">Ticket Rejected</h4>
          <p className="text-xs text-rose-700 mt-1">
            This problem report was evaluated and closed as rejected by the administration.
          </p>
          {rejectedItem.timestamp && (
            <p className="text-[11px] text-rose-500 mt-1">
              Rejected on: {new Date(rejectedItem.timestamp).toLocaleString()}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="py-2">
      <div className="relative flex flex-col space-y-6">
        {STANDARD_STEPS.map((step, idx) => {
          const StepIcon = step.icon;
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const isPending = idx > currentIndex;
          const timelineEntry = timelineMap[step.status];

          return (
            <motion.div
              key={step.status}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="relative flex items-start group"
            >
              {/* Connecting vertical line */}
              {idx !== STANDARD_STEPS.length - 1 && (
                <div
                  className={`absolute left-4 top-8 -bottom-6 w-0.5 transition-colors ${
                    idx < currentIndex ? 'bg-emerald-500' : 'bg-slate-200'
                  }`}
                />
              )}

              {/* Step indicator circle */}
              <div
                className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${
                  isCompleted
                    ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm'
                    : isCurrent
                    ? 'bg-indigo-600 border-indigo-600 text-white ring-4 ring-indigo-100 animate-pulse'
                    : 'bg-white border-slate-300 text-slate-400'
                }`}
              >
                <StepIcon className="w-4 h-4" />
              </div>

              {/* Content box */}
              <div className="ml-4 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <h4
                    className={`text-sm font-semibold ${
                      isCurrent
                        ? 'text-indigo-600'
                        : isCompleted
                        ? 'text-slate-800'
                        : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </h4>
                  {timelineEntry?.timestamp && (
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {new Date(timelineEntry.timestamp).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 mt-0.5">
                  {timelineEntry?.note || step.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
