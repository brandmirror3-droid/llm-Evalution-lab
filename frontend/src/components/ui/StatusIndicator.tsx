import React from 'react';
import { SubsystemState } from '../../types';

interface StatusIndicatorProps {
  status: SubsystemState | 'healthy' | 'unhealthy' | 'unknown';
  size?: 'sm' | 'md' | 'lg';
  withPulse?: boolean;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  size = 'md',
  withPulse = false,
}) => {
  let color = 'bg-slate-400';
  let pulseColor = 'bg-slate-300';

  if (status === 'operational' || status === 'healthy') {
    color = 'bg-emerald-600';
    pulseColor = 'bg-emerald-400';
  } else if (status === 'degraded' || status === 'awaiting_setup') {
    color = 'bg-amber-600';
    pulseColor = 'bg-amber-400';
  } else if (status === 'disconnected' || status === 'unhealthy') {
    color = 'bg-rose-600';
    pulseColor = 'bg-rose-400';
  } else if (status === 'not_configured' || status === 'not_implemented') {
    color = 'bg-slate-400';
    pulseColor = 'bg-slate-300';
  }

  const sizeClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };

  return (
    <span className="relative flex items-center justify-center">
      {withPulse && (
        <span
          className={`absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping ${pulseColor}`}
        />
      )}
      <span className={`relative inline-flex rounded-full ${color} ${sizeClasses[size]}`} />
    </span>
  );
};
