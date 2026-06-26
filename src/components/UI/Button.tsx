import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-blue-800 text-white hover:bg-blue-900 focus-visible:ring-blue-800 border border-transparent',
  secondary:
    'bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-emerald-600 border border-transparent',
  danger:
    'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600 border border-transparent',
  ghost:
    'bg-transparent text-slate-700 hover:bg-slate-100 focus-visible:ring-slate-400 border border-transparent',
  outline:
    'bg-white text-slate-700 hover:bg-slate-50 focus-visible:ring-slate-400 border border-slate-300',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      {...props}
      disabled={isDisabled}
      className={twMerge(
        clsx(
          'inline-flex items-center justify-center font-medium rounded-lg',
          'transition-colors duration-150',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variantClasses[variant],
          sizeClasses[size],
          className
        )
      )}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {!loading && icon && iconPosition === 'left' && (
        <span aria-hidden="true">{icon}</span>
      )}
      {children}
      {!loading && icon && iconPosition === 'right' && (
        <span aria-hidden="true">{icon}</span>
      )}
    </button>
  );
}
