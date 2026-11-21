import React from 'react';

export type BadgeVariant =
  | 'operational'
  | 'degraded'
  | 'disconnected'
  | 'not_configured'
  | 'not_implemented'
  | 'awaiting_setup'
  | 'verified'
  | 'pending'
  | 'in_progress'
  | 'default'
  | 'accent'
  | 'lime'
  | 'error';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  className = '',
}) => {
  const variantStyles: Record<BadgeVariant, string> = {
    operational: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    verified: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    lime: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    degraded: 'bg-amber-50 text-amber-700 border-amber-200/80',
    awaiting_setup: 'bg-amber-50 text-amber-700 border-amber-200/80',
    disconnected: 'bg-rose-50 text-rose-700 border-rose-200/80',
    error: 'bg-rose-50 text-rose-700 border-rose-200/80',
    not_configured: 'bg-slate-100 text-slate-600 border-slate-200',
    not_implemented: 'bg-slate-100 text-slate-600 border-slate-200',
    pending: 'bg-slate-100 text-slate-600 border-slate-200',
    in_progress: 'bg-sky-50 text-sky-700 border-sky-200',
    accent: 'bg-sky-50 text-sky-700 border-sky-200',
    default: 'bg-white text-slate-700 border-slate-200',
  };

  const sizeStyles: Record<'xs' | 'sm' | 'md', string> = {
    xs: 'px-1.5 py-0.5 text-[10px] leading-tight font-medium',
    sm: 'px-2 py-0.5 text-[11px] leading-snug font-medium',
    md: 'px-2.5 py-1 text-xs leading-normal font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded border ${variantStyles[variant]} ${sizeStyles[size]} transition-colors duration-150 ${className}`}
    >
      {children}
    </span>
  );
};
