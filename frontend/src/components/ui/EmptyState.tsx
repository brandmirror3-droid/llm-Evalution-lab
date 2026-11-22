import React from 'react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  purpose?: string;
  expectedData?: string;
  enablingCapability?: string;
  enablingPhase?: string;
  currentActionText?: string;
  currentAction?: string;
  action?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  purpose,
  enablingPhase,
  enablingCapability,
  action,
  actionLabel,
  onAction,
  className = '',
}) => {
  const displayDescription = description || purpose || '';
  const displayPhase = enablingPhase || enablingCapability;

  return (
    <div
      className={`py-8 px-4 flex flex-col items-center justify-center text-center ${className}`}
    >
      {icon && (
        <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 mb-2.5">
          {icon}
        </div>
      )}
      <h4 className="text-xs font-semibold text-slate-900 tracking-tight">
        {title}
      </h4>
      {displayDescription && (
        <p className="text-[11px] text-slate-500 mt-1 max-w-sm leading-relaxed">
          {displayDescription}
        </p>
      )}

      {displayPhase && (
        <div className="mt-2 text-[10px] text-slate-400 font-mono">
          {displayPhase}
        </div>
      )}

      {/* Action CTA */}
      {(action || (actionLabel && onAction)) && (
        <div className="mt-3.5">
          {action || (
            <Button variant="primary" size="xs" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
