import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-[#EFE5D3]/70 border border-[#D8C4A8]/40 ${className}`}
    />
  );
};

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-[#FFFCF7] rounded-3xl p-6 border border-[#8C5A3C]/16 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="w-24 h-4" />
        <Skeleton className="w-16 h-6 rounded-full" />
      </div>
      <Skeleton className="w-3/4 h-6" />
      <Skeleton className="w-full h-12" />
      <div className="pt-4 border-t border-[#D8C4A8]/40 flex justify-between">
        <Skeleton className="w-20 h-4" />
        <Skeleton className="w-24 h-4" />
      </div>
    </div>
  );
};

export const SkeletonChart: React.FC = () => {
  return (
    <div className="bg-[#FFFCF7] rounded-3xl p-6 sm:p-8 border border-[#8C5A3C]/16 space-y-4">
      <div className="flex items-center justify-between pb-4 border-b border-[#D8C4A8]/60">
        <Skeleton className="w-48 h-6" />
        <Skeleton className="w-24 h-8 rounded-xl" />
      </div>
      <Skeleton className="w-full h-64 rounded-2xl" />
    </div>
  );
};
