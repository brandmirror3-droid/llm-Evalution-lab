import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../components/layout/PageContainer';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { StatusIndicator } from '../../components/ui/StatusIndicator';
import { getLabStatus, getWorkspaces, createWorkspace } from '../../api/system';
import { LabStatusOverview, Workspace } from '../../types';
import {
  Database,
  Server,
  KeyRound,
  Layers,
  Plus,
  RefreshCw,
  Terminal,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [statusOverview, setStatusOverview] = useState<LabStatusOverview | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [newWorkspaceDesc, setNewWorkspaceDesc] = useState('');
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);
  const [workspaceError, setWorkspaceError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const statusData = await getLabStatus();
      setStatusOverview(statusData);

      try {
        const wsData = await getWorkspaces();
        setWorkspaces(wsData);
      } catch {
        // If DB is offline, workspaces will fail gracefully
        setWorkspaces([]);
      }
    } catch {
      // Ignored
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkspaceName.trim()) return;

    setIsCreatingWorkspace(true);
    setWorkspaceError(null);
    try {
      const created = await createWorkspace({
        name: newWorkspaceName.trim(),
        description: newWorkspaceDesc.trim() || undefined,
      });
      setWorkspaces((prev) => [...prev, created]);
      setNewWorkspaceName('');
      setNewWorkspaceDesc('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create workspace.';
      setWorkspaceError(msg);
    } finally {
      setIsCreatingWorkspace(false);
    }
  };

  const db = statusOverview?.subsystems.database;

  return (
    <PageContainer
      title="System Settings & Environment"
      subtitle="Inspect lab runtime configuration, storage subsystem connectivity, and provider telemetry."
      badge={<Badge variant="verified">Phase 1 Foundation</Badge>}
      actions={
        <Button
          variant="secondary"
          size="sm"
          onClick={loadData}
          icon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
        >
          Refresh Settings
        </Button>
      }
      maxWidth="wide"
    >
      <div className="space-y-6">
        {/* Environment & Backend Service */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader
              title="Backend & Runtime Environment"
              subtitle="Current host runtime parameters"
              icon={<Server className="w-4 h-4 text-sky-600" />}
            />
            <CardContent className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Environment Mode</span>
                <span className="font-mono text-slate-800 capitalize font-medium">
                  {statusOverview?.environment || 'development'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Debug Telemetry</span>
                <span className="font-mono text-slate-800 font-medium">
                  {statusOverview?.debug ? 'true' : 'false'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">API Gateway Version</span>
                <span className="font-mono text-slate-800 font-medium">
                  v{statusOverview?.version || '0.1.0'} (/api/v1)
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500">Roadmap Phase</span>
                <span className="font-mono text-sky-700 font-semibold">
                  {statusOverview?.phase || 'Phase 1: Lab Foundation'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Database Configuration */}
          <Card>
            <CardHeader
              title="PostgreSQL Storage Subsystem"
              subtitle="Connection status and migration harness"
              icon={<Database className="w-4 h-4 text-sky-600" />}
            />
            <CardContent className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-500">Connection Status</span>
                <div className="flex items-center gap-2">
                  <StatusIndicator status={db?.status || 'unknown'} size="sm" />
                  <span className="font-medium text-slate-800 capitalize">
                    {db?.status?.replace('_', ' ') || 'Unknown'}
                  </span>
                </div>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Configured Target</span>
                <span className="font-mono text-slate-600 truncate max-w-xs">
                  {db?.target || 'None (Awaiting configuration)'}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500">Migration State</span>
                <span className="font-mono text-slate-800 font-medium">
                  Alembic 0001_initial_foundation
                </span>
              </div>

              {db?.status !== 'operational' && (
                <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200 font-mono text-[11px] text-slate-700 space-y-1">
                  <div className="text-slate-900 font-semibold flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-slate-500" />
                    To connect local PostgreSQL:
                  </div>
                  <div className="text-slate-500">1. Set DATABASE_URL in backend/.env:</div>
                  <div className="text-slate-800 font-mono select-all">
                    DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/llm_eval_lab
                  </div>
                  <div className="text-slate-500">2. Run migrations:</div>
                  <div className="text-sky-700 font-semibold">cd backend && alembic upgrade head</div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Model Provider Configuration (Telemetry) */}
        <Card>
          <CardHeader
            title="Model Provider Credential Telemetry"
            subtitle="Provider environment keys for Phase 2 readiness (keys are never exposed to the frontend)"
            icon={<KeyRound className="w-4 h-4 text-sky-600" />}
          />
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(statusOverview?.providers || []).map((provider) => (
                <div
                  key={provider.provider}
                  className="p-3.5 bg-slate-50/70 rounded-lg border border-slate-200 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">
                      {provider.label}
                    </span>
                    <Badge
                      variant={provider.configured ? 'verified' : 'not_configured'}
                      size="xs"
                    >
                      {provider.configured ? 'Key Configured' : 'Not Set'}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {provider.configured
                      ? 'Environment variable detected. Ready for Phase 2 integration.'
                      : 'Missing from .env. Configure before Phase 2 playground.'}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Foundational Workspaces */}
        <Card>
          <CardHeader
            title="Research Workspaces"
            subtitle="Phase 1 foundational workspace organization"
            icon={<Layers className="w-4 h-4 text-sky-600" />}
          />
          <CardContent className="space-y-4">
            {workspaceError && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800">
                {workspaceError}
              </div>
            )}

            {/* Create Workspace Form */}
            <form onSubmit={handleCreateWorkspace} className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="text"
                placeholder="New Workspace Name..."
                value={newWorkspaceName}
                onChange={(e) => setNewWorkspaceName(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 flex-1 font-sans"
                disabled={db?.status !== 'operational'}
              />
              <input
                type="text"
                placeholder="Optional Description..."
                value={newWorkspaceDesc}
                onChange={(e) => setNewWorkspaceDesc(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 flex-1 font-sans"
                disabled={db?.status !== 'operational'}
              />
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={isCreatingWorkspace}
                disabled={!newWorkspaceName.trim() || db?.status !== 'operational'}
                icon={<Plus className="w-3.5 h-3.5" />}
              >
                Create Workspace
              </Button>
            </form>

            {db?.status !== 'operational' ? (
              <div className="p-6 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-500 bg-slate-50/50">
                <Database className="w-6 h-6 mx-auto mb-2 text-slate-400" />
                <p className="font-semibold text-slate-800">
                  Storage Subsystem Offline or Unconfigured
                </p>
                <p className="text-[11px] text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
                  Workspace persistence requires a connected PostgreSQL database. Once configured and migrated, workspaces created here will group future experiments and benchmarks.
                </p>
              </div>
            ) : workspaces.length === 0 ? (
              <div className="p-6 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-500">
                No custom workspaces created yet. Use the form above to add your first research workspace.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 text-xs">
                {workspaces.map((ws) => (
                  <div key={ws.id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-900">{ws.name}</div>
                      {ws.description && (
                        <p className="text-slate-500 text-[11px] mt-0.5">{ws.description}</p>
                      )}
                    </div>
                    <span className="font-mono text-[11px] text-slate-400">{ws.slug}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};
