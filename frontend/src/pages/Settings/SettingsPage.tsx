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
      // Handled
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
      subtitle="Host runtime environment, database connectivity telemetry, and inference provider configurations."
      actions={
        <Button
          variant="secondary"
          size="sm"
          onClick={loadData}
          icon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-sky-400' : ''}`} />}
        >
          Refresh Telemetry
        </Button>
      }
      maxWidth="wide"
    >
      <div className="bg-[#0c111a] border border-[#1e293b] rounded-lg p-5 sm:p-6 space-y-6">
        {/* Section 1: Runtime Environment */}
        <div className="space-y-3 pb-5 border-b border-[#1e293b]">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-sky-400" />
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
              Runtime & Environment
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-[#101622] rounded border border-[#1e293b]">
              <span className="text-[10px] text-slate-400 font-mono block">Environment Mode</span>
              <span className="font-mono text-slate-200 font-semibold capitalize">
                {statusOverview?.environment || 'development'}
              </span>
            </div>
            <div className="p-3 bg-[#101622] rounded border border-[#1e293b]">
              <span className="text-[10px] text-slate-400 font-mono block">API Gateway</span>
              <span className="font-mono text-sky-400 font-semibold">
                v{statusOverview?.version || '0.1.0'} (/api/v1)
              </span>
            </div>
            <div className="p-3 bg-[#101622] rounded border border-[#1e293b]">
              <span className="text-[10px] text-slate-400 font-mono block">Active Milestone</span>
              <span className="font-mono text-emerald-400 font-semibold">
                {statusOverview?.phase || 'Phase 1: Lab Foundation'}
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Storage Subsystem */}
        <div className="space-y-3 pb-5 border-b border-[#1e293b]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-sky-400" />
              <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
                PostgreSQL Storage Subsystem
              </h3>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono">
              <span
                className={`w-2 h-2 rounded-full ${
                  db?.status === 'operational' ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' : 'bg-amber-400'
                }`}
              />
              <span className="text-slate-200 capitalize">
                {db?.status?.replace('_', ' ') || 'Checking status...'}
              </span>
            </div>
          </div>

          <div className="text-xs space-y-1.5 text-slate-300 font-mono">
            <div className="flex justify-between py-1 border-b border-[#1e293b]">
              <span className="text-slate-400">Configured Target:</span>
              <span className="text-slate-300 truncate max-w-md">
                {db?.target || 'postgresql+asyncpg://localhost:5432/llm_eval_lab (Default pool)'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#1e293b]">
              <span className="text-slate-400">Migration State:</span>
              <span className="text-emerald-400">
                Alembic 0001_initial_foundation (Applied)
              </span>
            </div>
          </div>

          {db?.status !== 'operational' && (
            <div className="p-3 bg-[#080c14] rounded border border-[#1e293b] font-mono text-[11px] text-slate-300 space-y-1">
              <div className="text-slate-200 font-sans font-semibold flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-sky-400" />
                <span>To connect local PostgreSQL:</span>
              </div>
              <div className="text-slate-500">1. Set DATABASE_URL in backend/.env:</div>
              <div className="text-slate-300 select-all bg-[#101622] p-1.5 rounded border border-[#1e293b]">
                DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/llm_eval_lab
              </div>
              <div className="text-slate-500">2. Run database migrations:</div>
              <div className="text-sky-400 font-semibold">cd backend && alembic upgrade head</div>
            </div>
          )}
        </div>

        {/* Section 3: Model Provider Credentials */}
        <div className="space-y-3 pb-5 border-b border-[#1e293b]">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
              Model Provider Credential Telemetry
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(statusOverview?.providers || []).map((provider) => (
              <div
                key={provider.provider}
                className="p-3 bg-[#101622] rounded border border-[#1e293b] space-y-1 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200 font-mono">{provider.label}</span>
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
                      provider.configured
                        ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/60'
                        : 'bg-[#080c14] text-slate-500 border border-[#1e293b]'
                    }`}
                  >
                    {provider.configured ? 'Key Configured' : 'Not Set'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  {provider.configured
                    ? 'Environment API key detected in .env.'
                    : 'Missing key. Set in backend/.env before Phase 2.'}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Workspaces */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-sky-400" />
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
              Research Workspaces
            </h3>
          </div>

          {workspaceError && (
            <div className="p-2.5 rounded bg-rose-950/30 border border-rose-900/50 text-xs text-rose-300 font-mono">
              {workspaceError}
            </div>
          )}

          <form onSubmit={handleCreateWorkspace} className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="New Workspace Name..."
              value={newWorkspaceName}
              onChange={(e) => setNewWorkspaceName(e.target.value)}
              className="bg-[#101622] border border-[#1e293b] rounded px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 flex-1 font-mono"
              disabled={db?.status !== 'operational'}
            />
            <input
              type="text"
              placeholder="Optional Description..."
              value={newWorkspaceDesc}
              onChange={(e) => setNewWorkspaceDesc(e.target.value)}
              className="bg-[#101622] border border-[#1e293b] rounded px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 flex-1 font-sans"
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
            <div className="divide-y divide-[#1e293b] text-xs pt-1 font-mono">
              {workspaces.map((ws) => (
                <div key={ws.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-200">{ws.name}</div>
                    {ws.description && (
                      <p className="text-slate-400 font-sans text-[11px] mt-0.5">{ws.description}</p>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 bg-[#101622] px-2 py-0.5 rounded border border-[#1e293b]">
                    {ws.slug}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
};