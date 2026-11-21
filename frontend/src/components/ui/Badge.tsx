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
  | 'lime';

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
    operational: 'bg-emerald-950/60 text-emerald-400 border-emerald-800/50',
    verified: 'bg-emerald-950/60 text-emerald-400 border-emerald-800/50',
    degraded: 'bg-amber-950/60 text-amber-400 border-amber-800/50',
    awaiting_setup: 'bg-amber-950/50 text-amber-400 border-amber-800/40',
    disconnected: 'bg-rose-950/60 text-rose-400 border-rose-800/50',
    not_configured: 'bg-lab-surface text-lab-text-muted border-lab-border',
    not_implemented: 'bg-neutral-900 text-neutral-400 border-neutral-800',
    pending: 'bg-neutral-900 text-neutral-400 border-neutral-800',
    in_progress: 'bg-cyan-950/60 text-cyan-400 border-cyan-800/50',
    lime: 'bg-lime-950/50 text-lime-400 border-lime-800/40',
    default: 'bg-lab-surface text-lab-text-secondary border-lab-border',
  };

  const sizeStyles: Record<'xs' | 'sm' | 'md', string> = {
    xs: 'text-[10px] px-1.5 py-0.5 tracking-wider uppercase font-mono',
    sm: 'text-xs px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-medium',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${variantStyles[variant] || variantStyles.default} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};
