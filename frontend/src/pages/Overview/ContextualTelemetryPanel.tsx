import React from 'react';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Badge, BadgeVariant } from '../../components/ui/Badge';
import { StatusIndicator } from '../../components/ui/StatusIndicator';
import { Skeleton } from '../../components/ui/Skeleton';
import { SubsystemHealth, ProviderConfigStatus, ReadinessItem } from '../../types';
import {
  Server,
  Cpu,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from 'lucide-react';

interface ContextualTelemetryPanelProps {
  subsystems: Record<string, SubsystemHealth>;
  providers: ProviderConfigStatus[];
  readinessChecklist: ReadinessItem[];
  isLoading: boolean;
  onRefresh: () => void;
}

export const ContextualTelemetryPanel: React.FC<ContextualTelemetryPanelProps> = ({
  subsystems,
  providers,
  readinessChecklist,
  isLoading,
  onRefresh,
}) => {
  const envSub = subsystems.environment;
  const dbSub = subsystems.database;
  const expSub = subsystems.experiment_infrastructure;

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
        return 'Planned';
      case 'awaiting_setup':
        return 'Awaiting setup';
      default:
        return 'Unknown';
    }
  };

  if (isLoading && Object.keys(subsystems).length === 0) {
    return (
      <div className="space-y-4">
        <Skeleton variant="card" className="h-48" />
        <Skeleton variant="card" className="h-44" />
        <Skeleton variant="card" className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* 1. Subsystem Telemetry Card */}
      <Card>
        <CardHeader
          title="Subsystem Telemetry"
          subtitle="Real-time live infrastructure probes"
          icon={<Server className="w-4 h-4 text-slate-500" />}
          action={
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Re-probe subsystems"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          }
        />
        <CardContent className="space-y-3.5 text-xs divide-y divide-slate-100 p-4 sm:p-5">
          {/* Runtime */}
          <div className="pt-0 flex items-start justify-between gap-3">
            <div>
              <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                <StatusIndicator status={envSub?.status || 'unknown'} size="sm" />
                <span>Runtime Environment</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                {envSub?.message || 'Probing runtime...'}
              </p>
            </div>
            <Badge variant={mapBadgeVariant(envSub?.status)} size="xs">
              {formatStatusText(envSub?.status)}
            </Badge>
          </div>

          {/* Database */}
          <div className="pt-3 flex items-start justify-between gap-3">
            <div>
              <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                <StatusIndicator
                  status={dbSub?.status || 'unknown'}
                  size="sm"
                  withPulse={dbSub?.status === 'operational'}
                />
                <span>PostgreSQL Storage</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                {dbSub?.message || 'Awaiting connection.'}
              </p>
              {dbSub?.target && (
                <span className="font-mono text-[10px] text-slate-400 block mt-0.5 truncate max-w-[200px]">
                  {dbSub.target}
                </span>
              )}
            </div>
            <Badge variant={mapBadgeVariant(dbSub?.status)} size="xs">
              {formatStatusText(dbSub?.status)}
            </Badge>
          </div>

          {/* Execution Engine */}
          <div className="pt-3 flex items-start justify-between gap-3">
            <div>
              <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                <StatusIndicator status={expSub?.status || 'unknown'} size="sm" />
                <span>Execution Engine</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                {expSub?.message || 'Queue scheduled for Phase 2/3.'}
              </p>
            </div>
            <Badge variant="not_implemented" size="xs">
              Phase 2 Target
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* 2. Model Provider Credentials */}
      <Card>
        <CardHeader
          title="Provider Telemetry"
          subtitle="Model keys detected in environment"
          icon={<Cpu className="w-4 h-4 text-slate-500" />}
        />
        <CardContent className="p-4 sm:p-5 space-y-2 text-xs">
          <div className="grid grid-cols-1 gap-2">
            {providers.map((p) => (
              <div
                key={p.provider}
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200/80"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                  <span className="font-medium text-slate-800">{p.label}</span>
                </div>
                <Badge variant={p.configured ? 'operational' : 'not_configured'} size="xs">
                  {p.configured ? 'Configured' : 'Not Set'}
                </Badge>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
            Keys are checked strictly for configuration presence. Values are never exposed to the frontend.
          </p>
        </CardContent>
      </Card>

      {/* 3. Platform Readiness Audit Checklist */}
      <Card>
        <CardHeader
          title="Platform Readiness Audit"
          subtitle="Foundational milestone verification"
          icon={<ShieldCheck className="w-4 h-4 text-slate-500" />}
        />
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100 text-xs">
            {readinessChecklist.slice(0, 5).map((item, idx) => (
              <div key={idx} className="p-3.5 flex items-start justify-between gap-2.5">
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-1.5">
                    {item.status === 'verified' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    ) : item.status === 'awaiting_setup' ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    )}
                    <span className="font-medium text-slate-900 truncate">
                      {item.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug pl-5">
                    {item.details}
                  </p>
                </div>
                <Badge
                  variant={
                    item.status === 'verified'
                      ? 'verified'
                      : item.status === 'awaiting_setup'
                      ? 'awaiting_setup'
                      : 'pending'
                  }
                  size="xs"
                >
                  {item.status === 'verified'
                    ? 'Verified'
                    : item.status === 'awaiting_setup'
                    ? 'Setup'
                    : 'Planned'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
