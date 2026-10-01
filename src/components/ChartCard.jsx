import React from 'react';

export const ChartCard = ({ title, subtitle, children, className = '' }) => {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between ${className}`}>
      <div className="mb-4">
        <h3 className="text-base font-bold text-slate-900">{title}</h3>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      <div className="w-full flex-1 min-h-[260px]">
        {children}
      </div>
    </div>
  );
};
