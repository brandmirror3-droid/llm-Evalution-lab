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
        <div className="w-8 h-8 rounded-sm bg-[#1C1F22] border border-[#35393D] flex items-center justify-center text-[#929BA3] mb-2">
          {icon}
        </div>
      )}
      <h4 className="text-xs font-semibold text-[#D9DEE2] font-mono uppercase tracking-wider">
        {title}
      </h4>
      {displayDescription && (
        <p className="text-[11px] text-[#929BA3] mt-1 max-w-sm leading-relaxed">
          {displayDescription}
        </p>
      )}

      {displayPhase && (
        <div className="mt-2 text-[10px] text-cyan-400 font-mono bg-cyan-950/40 px-2 py-0.5 rounded-sm border border-cyan-800/50">
          {displayPhase}
        </div>
      )}

      {/* Action CTA */}
      {(action || (actionLabel && onAction)) && (
        <div className="mt-3">
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
