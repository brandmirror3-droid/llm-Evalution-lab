import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../components/layout/PageContainer';
import { Button } from '../../components/ui/Button';
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
      title="Settings"
      subtitle="Host runtime environment, storage subsystem connectivity, and model provider telemetry."
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
      <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 space-y-6">
        {/* Section 1: Runtime Environment */}
        <div className="space-y-3 pb-5 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-slate-400" />
            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
              Runtime & Environment
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-md border border-slate-200/80">
              <span className="text-[11px] text-slate-500 block">Environment</span>
              <span className="font-mono text-slate-900 font-semibold capitalize">
                {statusOverview?.environment || 'development'}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-md border border-slate-200/80">
              <span className="text-[11px] text-slate-500 block">API Gateway</span>
              <span className="font-mono text-slate-900 font-semibold">
                v{statusOverview?.version || '0.1.0'} (/api/v1)
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-md border border-slate-200/80">
              <span className="text-[11px] text-slate-500 block">Active Milestone</span>
              <span className="font-mono text-slate-900 font-semibold">
                {statusOverview?.phase || 'Phase 1: Lab Foundation'}
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Storage Subsystem */}
        <div className="space-y-3 pb-5 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-slate-400" />
              <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                PostgreSQL Storage Subsystem
              </h3>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <span
                className={`w-2 h-2 rounded-full ${
                  db?.status === 'operational' ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
              <span className="font-medium text-slate-800 capitalize">
                {db?.status?.replace('_', ' ') || 'Unknown'}
              </span>
            </div>
          </div>

          <div className="text-xs space-y-1.5 text-slate-600">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Configured Target:</span>
              <span className="font-mono text-slate-700 truncate max-w-md">
                {db?.target || 'None (Awaiting configuration)'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Migration State:</span>
              <span className="font-mono text-slate-700">
                Alembic 0001_initial_foundation
              </span>
            </div>
          </div>

          {db?.status !== 'operational' && (
            <div className="p-3 bg-slate-50 rounded-md border border-slate-200 font-mono text-[11px] text-slate-700 space-y-1">
              <div className="text-slate-900 font-sans font-semibold flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-slate-400" />
                <span>To connect local PostgreSQL:</span>
              </div>
              <div className="text-slate-500">1. Set DATABASE_URL in backend/.env:</div>
              <div className="text-slate-800 select-all">
                DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/llm_eval_lab
              </div>
              <div className="text-slate-500">2. Run database migrations:</div>
              <div className="text-sky-700 font-semibold">cd backend && alembic upgrade head</div>
            </div>
          )}
        </div>

        {/* Section 3: Model Provider Credentials */}
        <div className="space-y-3 pb-5 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-slate-400" />
            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
              Model Provider Credential Telemetry
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(statusOverview?.providers || []).map((provider) => (
              <div
                key={provider.provider}
                className="p-3 bg-slate-50 rounded-md border border-slate-200 space-y-1 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">{provider.label}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                      provider.configured
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-white text-slate-400 border border-slate-200'
                    }`}
                  >
                    {provider.configured ? 'Key Configured' : 'Not Set'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  {provider.configured
                    ? 'Environment key detected in .env.'
                    : 'Missing key. Set in backend/.env before Phase 2.'}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Workspaces */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-400" />
            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
              Research Workspaces
            </h3>
          </div>

          {workspaceError && (
            <div className="p-2.5 rounded-md bg-rose-50 border border-rose-200 text-xs text-rose-700">
              {workspaceError}
            </div>
          )}

          <form onSubmit={handleCreateWorkspace} className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="New Workspace Name..."
              value={newWorkspaceName}
              onChange={(e) => setNewWorkspaceName(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 flex-1 font-sans"
              disabled={db?.status !== 'operational'}
            />
            <input
              type="text"
              placeholder="Optional Description..."
              value={newWorkspaceDesc}
              onChange={(e) => setNewWorkspaceDesc(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 flex-1 font-sans"
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

          {workspaces.length > 0 && (
            <div className="divide-y divide-slate-100 text-xs pt-1">
              {workspaces.map((ws) => (
                <div key={ws.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-900">{ws.name}</div>
                    {ws.description && (
                      <p className="text-slate-500 text-[11px] mt-0.5">{ws.description}</p>
                    )}
                  </div>
                  <span className="font-mono text-[10px] text-slate-400">{ws.slug}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
};
