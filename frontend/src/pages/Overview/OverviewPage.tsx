import React, { useState, useEffect, useCallback } from 'react';
import { PageContainer } from '../../components/layout/PageContainer';
import { WelcomeBanner } from './WelcomeBanner';
import { VisualWorkflowPipeline } from '../../components/visualization/VisualWorkflowPipeline';
import { QuickActions } from './QuickActions';
import { ResearchWorkspace } from './ResearchWorkspace';
import { ContextualTelemetryPanel } from './ContextualTelemetryPanel';
import { getLabStatus } from '../../api/system';
import { LabStatusOverview } from '../../types';
import { AlertCircle, RefreshCw, Layers, FlaskConical, CheckSquare, Activity } from 'lucide-react';
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

  const isOnline = !error && !!statusOverview;

  return (
    <PageContainer maxWidth="wide" className="space-y-5 pb-8">
      {/* Offline/Error notification if backend is unreachable */}
      {error && (
        <div className="p-3 rounded-md bg-rose-50 border border-rose-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 text-xs text-rose-700">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>API Gateway offline: {error}</span>
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

      {/* 1. Compact Header */}
      <WelcomeBanner onNewExperiment={() => setIsExperimentModalOpen(true)} />

      {/* 2. Top Metric Strip (Inspired by Rhesis AI & VerifyWise) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3 rounded-lg border border-slate-200 bg-white space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium">
            <Layers className="w-3.5 h-3.5" />
            <span>Active Project</span>
          </div>
          <div className="text-sm font-semibold text-slate-900">
            Default Lab <span className="text-[10px] text-slate-400 font-mono">v0.1.0</span>
          </div>
        </div>

        <div className="p-3 rounded-lg border border-slate-200 bg-white space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium">
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Experiments</span>
          </div>
          <div className="text-sm font-semibold text-slate-900">
            0 <span className="text-[11px] text-slate-400 font-normal">runs recorded</span>
          </div>
        </div>

        <div className="p-3 rounded-lg border border-slate-200 bg-white space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium">
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Evaluators</span>
          </div>
          <div className="text-sm font-semibold text-slate-900">
            5 <span className="text-[11px] text-slate-400 font-normal">suites calibrated</span>
          </div>
        </div>

        <div className="p-3 rounded-lg border border-slate-200 bg-white space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium">
            <Activity className="w-3.5 h-3.5" />
            <span>Backend Status</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-900">
            <span
              className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-rose-500'}`}
            />
            <span>{isOnline ? 'Operational' : 'Offline'}</span>
          </div>
        </div>
      </div>

      {/* 3. Asymmetric Layout: 70% Left Main / 30% Right Contextual */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Main Column (~70% width) */}
        <div className="lg:col-span-8 space-y-5">
          {/* Research Activity Workbench */}
          <ResearchWorkspace onNewExperiment={() => setIsExperimentModalOpen(true)} />

          {/* Visual Workflow Pipeline */}
          <VisualWorkflowPipeline />

          {/* Scientific Module Launchers */}
          <QuickActions />
        </div>

        {/* Contextual Telemetry Sidebar (~30% width) */}
        <div className="lg:col-span-4 space-y-5">
          <ContextualTelemetryPanel
            subsystems={statusOverview?.subsystems || {}}
            providers={statusOverview?.providers || []}
            readinessChecklist={statusOverview?.readiness_checklist || []}
            isLoading={isLoading}
            onRefresh={loadStatus}
          />
        </div>
      </div>

      {/* New Experiment Phase 1 Gate Modal */}
      <Modal
        isOpen={isExperimentModalOpen}
        onClose={() => setIsExperimentModalOpen(false)}
        title="New Experiment Run"
        subtitle="Experiment execution harness is scheduled for Phase 2."
      >
        <div className="space-y-3 text-xs text-slate-600">
          <p className="leading-relaxed">
            Phase 1 provides the foundational architecture and schema validation. In Phase 2, the experiment tracking engine will execute prompts across models, capture streaming tokens, and persist output artifacts.
          </p>
          <div className="p-3 rounded bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-700 space-y-1">
            <div className="text-slate-400">// Inactivity Gate Status</div>
            <div>POST /api/v1/modules/experiments/execute → <span className="text-amber-600 font-semibold">501 Not Implemented</span></div>
            <div>Phase Target: Phase 2 (Model Playground & Integration)</div>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
};
