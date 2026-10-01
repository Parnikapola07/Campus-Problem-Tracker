import React from 'react';
import { motion } from 'framer-motion';

export const StatCard = ({ title, count, icon: Icon, color = 'bg-slate-900', iconBg = 'bg-indigo-600', subtitle, onClick }) => {
  return (
    <motion.div
      whileHover={onClick ? { y: -2 } : {}}
      onClick={onClick}
      className={`p-5 rounded-2xl border border-[var(--bg-border)] bg-[var(--bg-surface)] shadow-xs flex items-center justify-between transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md' : ''
      }`}
    >
      <div className="space-y-1">
        <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-black text-[var(--text-primary)]">{count}</p>
        {subtitle && <p className="text-[11px] text-[var(--text-muted)]">{subtitle}</p>}
      </div>
      <div className={`w-11 h-11 rounded-xl ${iconBg} text-white flex items-center justify-center shadow-md shrink-0`}>
        <Icon className="w-5 h-5" />
      </div>
    </motion.div>
  );
};
