import React from 'react';
import { clsx } from 'clsx';

interface SkeletonProps {
  className?: string;
  count?: number;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={clsx(
        'animate-pulse bg-slate-200 rounded-md',
        className
      )}
    />
  );
}

export function ModuleCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 space-y-3" aria-hidden="true">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      <div className="flex justify-between pt-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
    </div>
  );
}

export function SkeletonList({ count = 6 }: SkeletonProps) {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      role="status"
      aria-label="Loading modules"
    >
      {Array.from({ length: count }).map((_, i) => (
        <ModuleCardSkeleton key={i} />
      ))}
    </div>
  );
}
