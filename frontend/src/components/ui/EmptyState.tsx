import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  note?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  note,
  action,
  className = '',
}) => {
  return (
    <div
      className={`border border-dashed border-lab-border rounded-lg p-8 flex flex-col items-center justify-center text-center bg-lab-surface/20 ${className}`}
    >
      {icon && (
        <div className="w-10 h-10 rounded-full bg-lab-surface border border-lab-border flex items-center justify-center text-lab-text-muted mb-3">
          {icon}
        </div>
      )}
      <h4 className="text-sm font-semibold text-lab-text-primary tracking-tight">
        {title}
      </h4>
      <p className="text-xs text-lab-text-muted mt-1.5 max-w-sm leading-relaxed">
        {description}
      </p>
      {note && (
        <span className="inline-block mt-2 text-[11px] font-mono text-lab-text-faint bg-lab-surface/50 px-2 py-0.5 rounded border border-lab-borderSubtle">
          {note}
        </span>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};
