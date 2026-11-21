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
      subtitle="Inspect lab runtime configuration, database connectivity, and provider telemetry."
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
    >
      <div className="space-y-6">
        {/* Environment & Backend Service */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader
              title="Backend & Runtime Environment"
              subtitle="Current host runtime parameters"
              icon={<Server className="w-4 h-4 text-lab-text-secondary" />}
            />
            <CardContent className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-lab-borderSubtle">
                <span className="text-lab-text-muted">Environment Mode</span>
                <span className="font-mono text-lab-text-primary capitalize">
                  {statusOverview?.environment || 'development'}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-lab-borderSubtle">
                <span className="text-lab-text-muted">Debug Mode</span>
                <span className="font-mono text-lab-text-primary">
                  {statusOverview?.debug ? 'true' : 'false'}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-lab-borderSubtle">
                <span className="text-lab-text-muted">API Version</span>
                <span className="font-mono text-lab-text-primary">
                  v{statusOverview?.version || '0.1.0'} (/api/v1)
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-lab-text-muted">Roadmap Target</span>
                <span className="font-mono text-lab-accent-lime">
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
              icon={<Database className="w-4 h-4 text-lab-text-secondary" />}
            />
            <CardContent className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-1.5 border-b border-lab-borderSubtle">
                <span className="text-lab-text-muted">Connection Status</span>
                <div className="flex items-center gap-1.5">
                  <StatusIndicator status={db?.status || 'unknown'} size="sm" />
                  <span className="font-medium text-lab-text-primary capitalize">
                    {db?.status?.replace('_', ' ') || 'Unknown'}
                  </span>
                </div>
              </div>
              <div className="flex justify-between py-1.5 border-b border-lab-borderSubtle">
                <span className="text-lab-text-muted">Configured Target</span>
                <span className="font-mono text-lab-text-muted truncate max-w-xs">
                  {db?.target || 'None (Awaiting configuration)'}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-lab-text-muted">Migration State</span>
                <span className="font-mono text-lab-text-primary">
                  Alembic 0001_initial_foundation
                </span>
              </div>

              {db?.status !== 'operational' && (
                <div className="mt-3 p-3 bg-lab-surface rounded border border-lab-borderSubtle font-mono text-[11px] text-lab-text-muted space-y-1">
                  <div className="text-lab-text-secondary font-medium">
                    To connect local PostgreSQL:
                  </div>
                  <div>1. Set DATABASE_URL in backend/.env:</div>
                  <div className="text-lab-text-primary">
                    DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/llm_eval_lab
                  </div>
                  <div>2. Run migrations:</div>
                  <div className="text-lab-accent-lime">cd backend && alembic upgrade head</div>
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
            icon={<KeyRound className="w-4 h-4 text-lab-text-secondary" />}
          />
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(statusOverview?.providers || []).map((provider) => (
                <div
                  key={provider.provider}
                  className="p-3 bg-lab-surface rounded-lg border border-lab-borderSubtle space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-lab-text-primary">
                      {provider.label}
                    </span>
                    <Badge
                      variant={provider.configured ? 'verified' : 'not_configured'}
                      size="xs"
                    >
                      {provider.configured ? 'Key Configured' : 'Not Set'}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-lab-text-muted">
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
            icon={<Layers className="w-4 h-4 text-lab-text-secondary" />}
          />
          <CardContent className="space-y-4">
            {workspaceError && (
              <div className="p-3 rounded bg-rose-950/40 border border-rose-800/40 text-xs text-rose-300">
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
                className="bg-lab-surface border border-lab-border rounded-md px-3 py-1.5 text-xs text-lab-text-primary focus:outline-none focus:border-lab-accent-lime flex-1"
                disabled={db?.status !== 'operational'}
              />
              <input
                type="text"
                placeholder="Optional Description..."
                value={newWorkspaceDesc}
                onChange={(e) => setNewWorkspaceDesc(e.target.value)}
                className="bg-lab-surface border border-lab-border rounded-md px-3 py-1.5 text-xs text-lab-text-primary focus:outline-none focus:border-lab-accent-lime flex-1"
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
              <div className="p-4 rounded border border-dashed border-lab-border text-center text-xs text-lab-text-muted bg-lab-surface/30">
                <Database className="w-5 h-5 mx-auto mb-2 text-lab-text-faint" />
                <p className="font-medium text-lab-text-secondary">
                  Database Offline or Unconfigured
                </p>
                <p className="text-[11px] text-lab-text-muted mt-1 max-w-md mx-auto">
                  Workspace persistence requires a connected PostgreSQL database. Once configured and migrated, workspaces created here will group future experiments and benchmarks.
                </p>
              </div>
            ) : workspaces.length === 0 ? (
              <div className="p-4 rounded border border-dashed border-lab-border text-center text-xs text-lab-text-muted">
                No custom workspaces created yet. Use the form above to add your first research workspace.
              </div>
            ) : (
              <div className="divide-y divide-lab-borderSubtle text-xs">
                {workspaces.map((ws) => (
                  <div key={ws.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-lab-text-primary">{ws.name}</div>
                      {ws.description && (
                        <p className="text-lab-text-muted text-[11px] mt-0.5">{ws.description}</p>
                      )}
                    </div>
                    <span className="font-mono text-[10px] text-lab-text-faint">{ws.slug}</span>
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
