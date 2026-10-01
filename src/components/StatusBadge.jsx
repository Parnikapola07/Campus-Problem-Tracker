import React from 'react';
import { 
  FileText, 
  CheckCircle2, 
  UserCheck, 
  Clock, 
  CheckCircle, 
  XCircle 
} from 'lucide-react';

const STATUS_CONFIG = {
  REPORTED: {
    label: 'Reported',
    bg: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: FileText,
    dot: 'bg-blue-500'
  },
  VERIFIED: {
    label: 'Verified',
    bg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    icon: CheckCircle2,
    dot: 'bg-cyan-500'
  },
  ASSIGNED: {
    label: 'Assigned',
    bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    icon: UserCheck,
    dot: 'bg-indigo-500'
  },
  IN_PROGRESS: {
    label: 'In Progress',
    bg: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: Clock,
    dot: 'bg-amber-500 font-semibold animate-pulse'
  },
  RESOLVED: {
    label: 'Resolved',
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: CheckCircle,
    dot: 'bg-emerald-500'
  },
  REJECTED: {
    label: 'Rejected',
    bg: 'bg-rose-50 text-rose-700 border-rose-200',
    icon: XCircle,
    dot: 'bg-rose-500'
  }
};

export const StatusBadge = ({ status, showIcon = true, className = '' }) => {
  const config = STATUS_CONFIG[status?.toUpperCase()] || STATUS_CONFIG.REPORTED;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.bg} ${className}`}>
      {showIcon && <Icon className="w-3.5 h-3.5" />}
      {config.label}
    </span>
  );
};
