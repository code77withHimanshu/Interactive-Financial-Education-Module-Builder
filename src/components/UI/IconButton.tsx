import React from 'react';
import { clsx } from 'clsx';

type Variant = 'default' | 'danger' | 'success';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: Variant;
  size?: 'sm' | 'md';
}

const variantClasses: Record<Variant, string> = {
  default: 'text-slate-500 hover:text-slate-700 hover:bg-slate-100 focus-visible:ring-slate-400',
  danger: 'text-red-500 hover:text-red-700 hover:bg-red-50 focus-visible:ring-red-400',
  success: 'text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 focus-visible:ring-emerald-400',
};

const sizeClasses = {
  sm: 'p-1 rounded-md',
  md: 'p-1.5 rounded-lg',
};

export function IconButton({
  label,
  variant = 'default',
  size = 'md',
  children,
  className,
  ...props
}: IconButtonProps) {
  return (
    <button
      {...props}
      aria-label={label}
      className={clsx(
        'inline-flex items-center justify-center transition-colors duration-150',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </button>
  );
}
