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
      title="Facility Settings & Telemetry"
      subtitle="Host runtime environment, database connectivity telemetry, and inference provider credential status."
      actions={
        <Button
          variant="secondary"
          size="sm"
          onClick={loadData}
          icon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#06b6d4]' : ''}`} />}
        >
          Refresh Telemetry
        </Button>
      }
      maxWidth="wide"
    >
      <div className="bg-[#1C1F22] border border-[#35393D] rounded-sm p-5 sm:p-6 space-y-6">
        {/* Section 1: Runtime Environment */}
        <div className="space-y-3 pb-5 border-b border-[#35393D]">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-[#06b6d4]" />
            <h3 className="text-xs font-semibold text-[#D9DEE2] uppercase tracking-wider font-mono">
              Runtime & Environment
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
            <div className="p-3 bg-[#101214] rounded-sm border border-[#35393D]">
              <span className="text-[10px] text-[#687179] font-mono block">Environment Mode</span>
              <span className="font-mono text-[#D9DEE2] font-semibold capitalize">
                {statusOverview?.environment || 'development'}
              </span>
            </div>
            <div className="p-3 bg-[#101214] rounded-sm border border-[#35393D]">
              <span className="text-[10px] text-[#687179] font-mono block">API Gateway</span>
              <span className="font-mono text-[#06b6d4] font-semibold">
                v{statusOverview?.version || '0.1.0'} (/api/v1)
              </span>
            </div>
            <div className="p-3 bg-[#101214] rounded-sm border border-[#35393D]">
              <span className="text-[10px] text-[#687179] font-mono block">Active Milestone</span>
              <span className="font-mono text-[#10b981] font-semibold">
                {statusOverview?.phase || 'Phase 1: Lab Foundation'}
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Storage Subsystem */}
        <div className="space-y-3 pb-5 border-b border-[#35393D]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-[#06b6d4]" />
              <h3 className="text-xs font-semibold text-[#D9DEE2] uppercase tracking-wider font-mono">
                PostgreSQL Storage Subsystem
              </h3>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono">
              <span
                className={`w-2 h-2 rounded-full ${
                  db?.status === 'operational' ? 'bg-[#10b981]' : 'bg-[#f59e0b]'
                }`}
              />
              <span className="text-[#D9DEE2] capitalize">
                {db?.status?.replace('_', ' ') || 'Checking status...'}
              </span>
            </div>
          </div>

          <div className="text-xs space-y-1.5 text-[#D9DEE2] font-mono">
            <div className="flex justify-between py-1 border-b border-[#35393D]">
              <span className="text-[#687179]">Configured Target:</span>
              <span className="text-[#929BA3] truncate max-w-md">
                {db?.target || 'postgresql+asyncpg://localhost:5432/llm_eval_lab (Default pool)'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#35393D]">
              <span className="text-[#687179]">Migration State:</span>
              <span className="text-[#10b981]">
                Alembic 0001_initial_foundation (Applied)
              </span>
            </div>
          </div>

          {db?.status !== 'operational' && (
            <div className="p-3 bg-[#101214] rounded-sm border border-[#35393D] font-mono text-[11px] text-[#D9DEE2] space-y-1">
              <div className="text-[#D9DEE2] font-sans font-semibold flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-[#06b6d4]" />
                <span>To connect local PostgreSQL:</span>
              </div>
              <div className="text-[#687179]">1. Set DATABASE_URL in backend/.env:</div>
              <div className="text-[#D9DEE2] select-all bg-[#17191B] p-1.5 rounded-sm border border-[#35393D]">
                DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/llm_eval_lab
              </div>
              <div className="text-[#687179]">2. Run database migrations:</div>
              <div className="text-[#06b6d4] font-semibold">cd backend && alembic upgrade head</div>
            </div>
          )}
        </div>

        {/* Section 3: Model Provider Credentials */}
        <div className="space-y-3 pb-5 border-b border-[#35393D]">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-[#8b5cf6]" />
            <h3 className="text-xs font-semibold text-[#D9DEE2] uppercase tracking-wider font-mono">
              Model Provider Credential Telemetry
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(statusOverview?.providers || []).map((provider) => (
              <div
                key={provider.provider}
                className="p-3 bg-[#101214] rounded-sm border border-[#35393D] space-y-1 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#D9DEE2] font-mono">{provider.label}</span>
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.2 rounded-sm ${
                      provider.configured
                        ? 'bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30'
                        : 'bg-[#17191B] text-[#687179] border border-[#35393D]'
                    }`}
                  >
                    {provider.configured ? 'Key Configured' : 'Not Set'}
                  </span>
                </div>
                <p className="text-[11px] text-[#929BA3] leading-snug">
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
            <Layers className="w-4 h-4 text-[#06b6d4]" />
            <h3 className="text-xs font-semibold text-[#D9DEE2] uppercase tracking-wider font-mono">
              Research Workspaces
            </h3>
          </div>

          {workspaceError && (
            <div className="p-2.5 rounded-sm bg-[#ef4444]/10 border border-[#ef4444]/30 text-xs text-[#ef4444] font-mono">
              {workspaceError}
            </div>
          )}

          <form onSubmit={handleCreateWorkspace} className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="New Workspace Name..."
              value={newWorkspaceName}
              onChange={(e) => setNewWorkspaceName(e.target.value)}
              className="bg-[#101214] border border-[#35393D] rounded-sm px-3 py-1.5 text-xs text-[#D9DEE2] placeholder-[#687179] focus:outline-none focus:border-[#06b6d4] flex-1 font-mono"
              disabled={db?.status !== 'operational'}
            />
            <input
              type="text"
              placeholder="Optional Description..."
              value={newWorkspaceDesc}
              onChange={(e) => setNewWorkspaceDesc(e.target.value)}
              className="bg-[#101214] border border-[#35393D] rounded-sm px-3 py-1.5 text-xs text-[#D9DEE2] placeholder-[#687179] focus:outline-none focus:border-[#06b6d4] flex-1 font-sans"
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
            <div className="divide-y divide-[#35393D] text-xs pt-1 font-mono">
              {workspaces.map((ws) => (
                <div key={ws.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-[#D9DEE2]">{ws.name}</div>
                    {ws.description && (
                      <p className="text-[#929BA3] font-sans text-[11px] mt-0.5">{ws.description}</p>
                    )}
                  </div>
                  <span className="text-[10px] text-[#687179] bg-[#101214] px-2 py-0.5 rounded-sm border border-[#35393D]">
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
