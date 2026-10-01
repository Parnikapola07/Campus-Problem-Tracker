import React from 'react';

export const ChartCard = ({ title, subtitle, children, className = '' }) => {
  return (
    <div className={`bg-[var(--bg-surface)] rounded-2xl border border-[var(--bg-border)] p-6 shadow-xs flex flex-col justify-between transition-colors duration-200 ${className}`}>
      <div className="mb-4">
        <h3 className="text-base font-bold text-[var(--text-primary)]">{title}</h3>
        {subtitle && <p className="text-xs text-[var(--text-secondary)] mt-0.5">{subtitle}</p>}
      </div>
      <div className="w-full flex-1 min-h-[260px]">
        {children}
      </div>
    </div>
  );
};
