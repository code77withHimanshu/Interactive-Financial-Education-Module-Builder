import React from 'react';
import { clsx } from 'clsx';
import type { Category, Difficulty } from '../../types';

type BadgeVariant = 'category' | 'difficulty' | 'published' | 'draft' | 'custom';

interface BadgeProps {
  variant?: BadgeVariant;
  category?: Category;
  difficulty?: Difficulty;
  children: React.ReactNode;
  className?: string;
}

const categoryColors: Record<Category, string> = {
  budgeting: 'bg-blue-100 text-blue-800',
  investing: 'bg-emerald-100 text-emerald-800',
  debt: 'bg-red-100 text-red-800',
  savings: 'bg-amber-100 text-amber-800',
  taxes: 'bg-purple-100 text-purple-800',
  retirement: 'bg-indigo-100 text-indigo-800',
};

const difficultyColors: Record<Difficulty, string> = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-yellow-100 text-yellow-800',
  advanced: 'bg-red-100 text-red-800',
};

export function Badge({ variant = 'custom', category, difficulty, children, className }: BadgeProps) {
  let colorClass = 'bg-slate-100 text-slate-700';

  if (variant === 'category' && category) {
    colorClass = categoryColors[category];
  } else if (variant === 'difficulty' && difficulty) {
    colorClass = difficultyColors[difficulty];
  } else if (variant === 'published') {
    colorClass = 'bg-emerald-100 text-emerald-800';
  } else if (variant === 'draft') {
    colorClass = 'bg-slate-100 text-slate-600';
  }

  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize',
        colorClass,
        className
      )}
    >
      {children}
    </span>
  );
}
