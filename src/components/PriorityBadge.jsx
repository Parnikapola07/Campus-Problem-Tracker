import React from 'react';
import { AlertCircle, AlertTriangle, Flame, Info } from 'lucide-react';

const PRIORITY_CONFIG = {
  LOW: {
    label: 'Low',
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: Info
  },
  MEDIUM: {
    label: 'Medium',
    bg: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: AlertCircle
  },
  HIGH: {
    label: 'High',
    bg: 'bg-amber-50 text-amber-800 border-amber-300',
    icon: AlertTriangle
  },
  CRITICAL: {
    label: 'Critical',
    bg: 'bg-rose-100 text-rose-800 border-rose-300 font-bold',
    icon: Flame
  }
};

export const PriorityBadge = ({ priority, isSuggestion = false, className = '' }) => {
  const normalized = (priority || 'MEDIUM').toUpperCase();
  const config = PRIORITY_CONFIG[normalized] || PRIORITY_CONFIG.MEDIUM;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium border ${config.bg} ${className}`}>
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{config.label}</span>
      {isSuggestion && <span className="text-[10px] text-slate-400 font-normal ml-0.5">(Suggested)</span>}
    </span>
  );
};
