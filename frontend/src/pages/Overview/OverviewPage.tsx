import React, { useState, useEffect, useCallback } from 'react';
import { PageContainer } from '../../components/layout/PageContainer';
import { ResearchControlRoom } from './ResearchControlRoom';
import { VisualWorkflowPipeline } from '../../components/visualization/VisualWorkflowPipeline';
import { QuickActions } from './QuickActions';
import { getLabStatus } from '../../api/system';
import { LabStatusOverview } from '../../types';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';

export const OverviewPage: React.FC = () => {
  const [statusOverview, setStatusOverview] = useState<LabStatusOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExperimentModalOpen, setIsExperimentModalOpen] = useState(false);

  const loadStatus = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getLabStatus();
      setStatusOverview(data);
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : 'Unable to connect to lab status service.';
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  return (
    <PageContainer maxWidth="wide" className="space-y-4 pb-8">
      {/* Offline Notification if backend is unreachable */}
      {error && (
        <div className="p-3 rounded bg-rose-950/60 border border-rose-800/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 text-xs text-rose-300 font-mono">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>BACKEND_COMMUNICATION_FAULT: {error}</span>
          </div>
          <Button
            variant="outline"
            size="xs"
            onClick={loadStatus}
            icon={<RefreshCw className="w-3 h-3" />}
          >
            Retry Connection
          </Button>
        </div>
      )}

      {/* Primary Reference: Research Overview Control Room (Matching Image 7) */}
      <ResearchControlRoom
        statusOverview={statusOverview}
        isLoading={isLoading}
        onRefresh={loadStatus}
        onNewExperiment={() => setIsExperimentModalOpen(true)}
      />

      {/* Computational Workflow Pipeline (Image 2 & 5 Reference) */}
      <VisualWorkflowPipeline />

      {/* Facility Research Launchers */}
      <QuickActions />

      {/* New Experiment Phase 1 Gate Modal */}
      <Modal
        isOpen={isExperimentModalOpen}
        onClose={() => setIsExperimentModalOpen(false)}
        title="Experiment Harness Execution Gate"
        subtitle="Multi-model automated runner activates in Phase 2."
      >
        <div className="space-y-3 text-xs font-mono text-slate-300">
          <p className="leading-relaxed font-sans text-slate-400">
            Phase 1 provides the foundational laboratory architecture, schema validation, and telemetry diagnostics. In Phase 2, the experiment orchestration engine will dispatch live prompt variations across model endpoints and persist immutable run records.
          </p>
          <div className="p-3 rounded bg-[#080c14] border border-slate-800 text-[11px] text-slate-300 space-y-1">
            <div className="text-slate-500">// Gated Endpoint Contract</div>
            <div>
              POST /api/v1/modules/experiments/execute →{' '}
              <span className="text-amber-400 font-semibold">501 Not Implemented</span>
            </div>
            <div>Phase Target: Phase 2 (Model Playground & Integration)</div>
            <div>Status: Architecture & Schema Spec Verified</div>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
};
