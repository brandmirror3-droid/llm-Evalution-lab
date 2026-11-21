import React from 'react';
import { Badge } from './Badge';
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
  expectedData,
  enablingCapability,
  enablingPhase,
  currentActionText,
  currentAction,
  action,
  actionLabel,
  onAction,
  className = '',
}) => {
  const displayDescription = description || purpose || '';
  const displayPhase = enablingPhase || enablingCapability;
  const displayActionText = currentAction || currentActionText;

  return (
    <div
      className={`border border-dashed border-slate-200 rounded-xl p-6 sm:p-8 flex flex-col items-center justify-center text-center bg-slate-50/50 ${className}`}
    >
      {icon && (
        <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 shadow-subtle flex items-center justify-center text-slate-500 mb-3.5">
          {icon}
        </div>
      )}
      <h4 className="text-sm font-semibold text-slate-900 tracking-tight">
        {title}
      </h4>
      {displayDescription && (
        <p className="text-xs text-slate-500 mt-1.5 max-w-md leading-relaxed">
          {displayDescription}
        </p>
      )}

      {/* 4-part structured breakdown if provided */}
      {(purpose || expectedData || displayPhase || displayActionText) && (
        <div className="mt-5 w-full max-w-lg bg-white border border-slate-200/90 rounded-lg p-3.5 text-left text-xs space-y-2 shadow-subtle">
          {purpose && (
            <div className="flex items-start gap-2">
              <span className="font-semibold text-slate-700 w-24 shrink-0">Purpose:</span>
              <span className="text-slate-600 leading-snug">{purpose}</span>
            </div>
          )}
          {expectedData && (
            <div className="flex items-start gap-2">
              <span className="font-semibold text-slate-700 w-24 shrink-0">Expected:</span>
              <span className="text-slate-600 leading-snug">{expectedData}</span>
            </div>
          )}
          {displayPhase && (
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700 w-24 shrink-0">Roadmap:</span>
              <Badge variant="not_implemented" size="xs">
                {displayPhase}
              </Badge>
            </div>
          )}
          {displayActionText && (
            <div className="flex items-start gap-2">
              <span className="font-semibold text-slate-700 w-24 shrink-0">Action:</span>
              <span className="text-slate-600 leading-snug">{displayActionText}</span>
            </div>
          )}
        </div>
      )}

      {/* Action CTA */}
      {(action || (actionLabel && onAction)) && (
        <div className="mt-5">
          {action || (
            <Button variant="outline" size="sm" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
