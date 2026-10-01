import React from 'react';

const skeletonBase = 'bg-slate-200 dark:bg-slate-700 rounded';

export const CardSkeleton = () => (
  <div className="bg-[var(--bg-surface)] rounded-xl border border-[var(--bg-border)] p-5 animate-pulse space-y-4">
    <div className="flex justify-between items-center">
      <div className={`h-5 ${skeletonBase} w-24`}></div>
      <div className={`h-5 ${skeletonBase} rounded-full w-20`}></div>
    </div>
    <div className={`h-6 ${skeletonBase} w-3/4`}></div>
    <div className="space-y-2">
      <div className={`h-3 ${skeletonBase} w-full`}></div>
      <div className={`h-3 ${skeletonBase} w-5/6`}></div>
    </div>
    <div className="pt-4 border-t border-[var(--bg-border)] flex justify-between">
      <div className={`h-4 ${skeletonBase} w-28`}></div>
      <div className={`h-4 ${skeletonBase} w-20`}></div>
    </div>
  </div>
);

export const SummarySkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {[1, 2, 3, 4].map(i => (
      <div key={i} className="bg-[var(--bg-surface)] p-5 rounded-2xl border border-[var(--bg-border)] animate-pulse flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl ${skeletonBase} shrink-0`}></div>
        <div className="space-y-2 flex-1">
          <div className={`h-3 ${skeletonBase} w-16`}></div>
          <div className={`h-6 ${skeletonBase} w-10`}></div>
        </div>
      </div>
    ))}
  </div>
);

export const DetailsSkeleton = () => (
  <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
    <div className="bg-[var(--bg-surface)] p-6 rounded-2xl border border-[var(--bg-border)] space-y-4">
      <div className={`h-6 ${skeletonBase} w-32`}></div>
      <div className={`h-8 ${skeletonBase} w-2/3`}></div>
      <div className="flex gap-3">
        <div className={`h-6 ${skeletonBase} rounded-full w-20`}></div>
        <div className={`h-6 ${skeletonBase} rounded-full w-24`}></div>
      </div>
    </div>
    <div className="bg-[var(--bg-surface)] p-6 rounded-2xl border border-[var(--bg-border)] space-y-3">
      <div className={`h-5 ${skeletonBase} w-40`}></div>
      <div className={`h-4 ${skeletonBase} w-full`}></div>
      <div className={`h-4 ${skeletonBase} w-4/5`}></div>
    </div>
  </div>
);
