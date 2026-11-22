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
        <div className="w-8 h-8 rounded bg-[#131b28] border border-slate-800 flex items-center justify-center text-slate-400 mb-2">
          {icon}
        </div>
      )}
      <h4 className="text-xs font-semibold text-slate-200 tracking-tight">
        {title}
      </h4>
      {displayDescription && (
        <p className="text-[11px] text-slate-400 mt-1 max-w-sm leading-relaxed">
          {displayDescription}
        </p>
      )}

      {displayPhase && (
        <div className="mt-2 text-[10px] text-sky-400/90 font-mono bg-sky-950/40 px-2 py-0.5 rounded border border-sky-800/50">
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
