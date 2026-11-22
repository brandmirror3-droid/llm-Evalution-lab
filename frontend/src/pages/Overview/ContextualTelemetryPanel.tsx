import React from 'react';
import { SubsystemHealth, ProviderConfigStatus, ReadinessItem } from '../../types';
import {
  Server,
  RefreshCw,
  CheckCircle2,
  Clock,
  Terminal,
} from 'lucide-react';
import { Skeleton } from '../../components/ui/Skeleton';

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

  if (isLoading && Object.keys(subsystems).length === 0) {
    return (
      <div className="space-y-4">
        <Skeleton variant="card" className="h-40" />
        <Skeleton variant="card" className="h-36" />
      </div>
    );
  }

  const isDbOperational = dbSub?.status === 'operational';
  const isEnvOperational = envSub?.status === 'operational';

  return (
    <div className="space-y-4">
      {/* 1. Infrastructure Status */}
      <div className="bg-white border border-slate-200 rounded-lg p-3.5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-slate-400" />
            <h3 className="text-xs font-semibold text-slate-900">
              Infrastructure Status
            </h3>
          </div>
          <button
            onClick={onRefresh}
            className="p-1 rounded text-slate-400 hover:text-slate-600 transition-colors"
            title="Refresh status"
          >
            <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">API Gateway</span>
            <div className="flex items-center gap-1.5 font-medium">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isEnvOperational ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
              />
              <span className={isEnvOperational ? 'text-slate-800' : 'text-rose-600'}>
                {isEnvOperational ? 'Operational' : 'Offline'}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">PostgreSQL Database</span>
            <div className="flex items-center gap-1.5 font-medium">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isDbOperational ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
              <span className={isDbOperational ? 'text-slate-800' : 'text-amber-700'}>
                {isDbOperational ? 'Connected' : 'Offline (Setup needed)'}
              </span>
            </div>
          </div>

          {!isDbOperational && (
            <div className="mt-2 p-2 rounded bg-slate-50 border border-slate-200 font-mono text-[10px] text-slate-600 space-y-0.5">
              <div className="flex items-center gap-1 text-slate-500 font-sans font-medium">
                <Terminal className="w-3 h-3" />
                <span>To connect PostgreSQL:</span>
              </div>
              <div className="text-slate-700 select-all">
                cd backend && alembic upgrade head
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Provider API Key Detection */}
      <div className="bg-white border border-slate-200 rounded-lg p-3.5 space-y-2.5">
        <h3 className="text-xs font-semibold text-slate-900 pb-2 border-b border-slate-100">
          Model Provider Keys
        </h3>
        <div className="space-y-1.5 text-xs">
          {providers.length === 0 ? (
            <div className="text-[11px] text-slate-400">No provider status available.</div>
          ) : (
            providers.map((p) => (
              <div key={p.provider} className="flex items-center justify-between py-0.5">
                <span className="text-slate-600">{p.label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                    p.configured
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-50 text-slate-400 border border-slate-200'
                  }`}
                >
                  {p.configured ? 'Configured' : 'Not set'}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 3. Phase 1 Architecture Integrity */}
      <div className="bg-white border border-slate-200 rounded-lg p-3.5 space-y-2.5">
        <h3 className="text-xs font-semibold text-slate-900 pb-2 border-b border-slate-100">
          Phase 1 Architecture Status
        </h3>
        <div className="space-y-1.5 text-xs text-slate-600">
          {readinessChecklist && readinessChecklist.length > 0 ? (
            readinessChecklist.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 truncate">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="truncate">{item.title}</span>
                </span>
                <span className="text-[11px] font-mono text-emerald-700 capitalize shrink-0 ml-1">
                  {item.status}
                </span>
              </div>
            ))
          ) : (
            <>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Lab Core Harness</span>
                </span>
                <span className="text-[11px] font-mono text-emerald-700">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Schema & Migrations</span>
                </span>
                <span className="text-[11px] font-mono text-emerald-700">Ready</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Model Execution (P2)</span>
                </span>
                <span className="text-[11px] font-mono text-amber-700">Gated (501)</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
