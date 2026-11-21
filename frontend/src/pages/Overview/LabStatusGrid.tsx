import React from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge, BadgeVariant } from '../../components/ui/Badge';
import { StatusIndicator } from '../../components/ui/StatusIndicator';
import { Skeleton } from '../../components/ui/Skeleton';
import { SubsystemHealth, ProviderConfigStatus } from '../../types';
import {
  Server,
  Database,
  Cpu,
  Layers,
  RefreshCw,
} from 'lucide-react';

interface LabStatusGridProps {
  subsystems: Record<string, SubsystemHealth>;
  providers: ProviderConfigStatus[];
  isLoading: boolean;
  onRefresh: () => void;
}

export const LabStatusGrid: React.FC<LabStatusGridProps> = ({
  subsystems,
  providers,
  isLoading,
  onRefresh,
}) => {
  const envSubsystem = subsystems.environment;
  const dbSubsystem = subsystems.database;
  const expSubsystem = subsystems.experiment_infrastructure;

  const mapBadgeVariant = (status?: string): BadgeVariant => {
    switch (status) {
      case 'operational':
        return 'operational';
      case 'degraded':
        return 'degraded';
      case 'disconnected':
        return 'disconnected';
      case 'not_configured':
        return 'not_configured';
      case 'not_implemented':
        return 'not_implemented';
      case 'awaiting_setup':
        return 'awaiting_setup';
      default:
        return 'default';
    }
  };

  const formatStatusText = (status?: string): string => {
    switch (status) {
      case 'operational':
        return 'Operational';
      case 'degraded':
        return 'Degraded';
      case 'disconnected':
        return 'Disconnected';
      case 'not_configured':
        return 'Not configured';
      case 'not_implemented':
        return 'Not implemented';
      case 'awaiting_setup':
        return 'Awaiting setup';
      default:
        return 'Unknown';
    }
  };

  if (isLoading && Object.keys(subsystems).length === 0) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="w-40 h-4" />
          <Skeleton className="w-16 h-4" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton variant="card" />
          <Skeleton variant="card" />
          <Skeleton variant="card" />
          <Skeleton variant="card" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-mono font-semibold text-lab-text-muted uppercase tracking-wider">
          Lab Subsystems & Live Probes
        </h3>
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="group flex items-center gap-1.5 text-xs text-lab-text-muted hover:text-lab-text-primary transition-colors disabled:opacity-40"
          title="Re-probe subsystems"
        >
          <RefreshCw className={`w-3.5 h-3.5 transition-transform duration-300 ease-apple ${isLoading ? 'animate-spin' : 'group-hover:rotate-180'}`} />
          <span className="font-mono text-[11px]">Re-probe</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Runtime Environment */}
        <Card hoverable>
          <CardContent className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-lab-text-secondary">
                <Server className="w-4 h-4 text-lab-text-muted group-hover:text-lab-accent-lime transition-colors" />
                <span className="text-xs font-medium">Environment</span>
              </div>
              <Badge variant={mapBadgeVariant(envSubsystem?.status)} size="xs">
                {formatStatusText(envSubsystem?.status)}
              </Badge>
            </div>
            <div>
              <div className="text-sm font-semibold text-lab-text-primary">
                {envSubsystem?.name || 'FastAPI Core'}
              </div>
              <p className="text-[11px] text-lab-text-muted mt-1 truncate leading-tight">
                {envSubsystem?.message || 'Probing runtime...'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 2. Database Status */}
        <Card hoverable>
          <CardContent className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-lab-text-secondary">
                <Database className="w-4 h-4 text-lab-text-muted group-hover:text-lab-accent-lime transition-colors" />
                <span className="text-xs font-medium">Database</span>
              </div>
              <Badge variant={mapBadgeVariant(dbSubsystem?.status)} size="xs">
                {formatStatusText(dbSubsystem?.status)}
              </Badge>
            </div>
            <div>
              <div className="text-sm font-semibold text-lab-text-primary flex items-center gap-1.5">
                <StatusIndicator status={dbSubsystem?.status || 'unknown'} size="sm" withPulse={dbSubsystem?.status === 'operational'} />
                <span>PostgreSQL</span>
              </div>
              <p className="text-[11px] text-lab-text-muted mt-1 leading-tight line-clamp-2">
                {dbSubsystem?.message || 'Awaiting connection probe.'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 3. Model Provider Telemetry */}
        <Card hoverable>
          <CardContent className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-lab-text-secondary">
                <Cpu className="w-4 h-4 text-lab-text-muted group-hover:text-lab-accent-lime transition-colors" />
                <span className="text-xs font-medium">Model Providers</span>
              </div>
              <Badge variant="not_implemented" size="xs">
                Phase 2 Target
              </Badge>
            </div>
            <div>
              <div className="text-sm font-semibold text-lab-text-primary">
                {providers.filter((p) => p.configured).length} of {providers.length} Keys Detected
              </div>
              <div className="flex items-center gap-1.5 mt-1.5">
                {providers.map((p) => (
                  <span
                    key={p.provider}
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded border transition-colors ${
                      p.configured
                        ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40'
                        : 'bg-lab-surface text-lab-text-faint border-lab-borderSubtle'
                    }`}
                    title={`${p.label}: ${p.configured ? 'Key detected in environment' : 'Not configured'}`}
                  >
                    {p.label}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 4. Experiment Infrastructure */}
        <Card hoverable>
          <CardContent className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-lab-text-secondary">
                <Layers className="w-4 h-4 text-lab-text-muted group-hover:text-lab-accent-lime transition-colors" />
                <span className="text-xs font-medium">Execution Engine</span>
              </div>
              <Badge variant={mapBadgeVariant(expSubsystem?.status)} size="xs">
                {formatStatusText(expSubsystem?.status)}
              </Badge>
            </div>
            <div>
              <div className="text-sm font-semibold text-lab-text-primary">
                Experiment Harness
              </div>
              <p className="text-[11px] text-lab-text-muted mt-1 leading-tight line-clamp-2">
                {expSubsystem?.message || 'Execution queue scheduled for Phase 2/3.'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
