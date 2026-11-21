import React, { useState, useEffect, useCallback } from 'react';
import { PageContainer } from '../../components/layout/PageContainer';
import { WelcomeBanner } from './WelcomeBanner';
import { VisualWorkflowPipeline } from '../../components/visualization/VisualWorkflowPipeline';
import { QuickActions } from './QuickActions';
import { ResearchWorkspace } from './ResearchWorkspace';
import { ContextualTelemetryPanel } from './ContextualTelemetryPanel';
import { getLabStatus } from '../../api/system';
import { LabStatusOverview } from '../../types';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';

export const OverviewPage: React.FC = () => {
  const [statusOverview, setStatusOverview] = useState<LabStatusOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRoadmapModalOpen, setIsRoadmapModalOpen] = useState(false);

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
    <PageContainer maxWidth="wide" className="pb-12">
      {/* Offline/Error notification if backend is unreachable */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-rose-700">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <Button
            variant="outline"
            size="xs"
            onClick={loadStatus}
            icon={<RefreshCw className="w-3 h-3" />}
          >
            Retry Telemetry Probe
          </Button>
        </div>
      )}

      {/* Asymmetric Research Workspace Layout: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Research Column (~68% width on large screens) */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. Welcome & Empirical Mission */}
          <WelcomeBanner onOpenRoadmap={() => setIsRoadmapModalOpen(true)} />

          {/* 2. Visual Workflow Language: Input -> Model -> Evaluator -> Analysis -> Result */}
          <VisualWorkflowPipeline />

          {/* 3. Scientific Module Launchers */}
          <QuickActions />

          {/* 4. Research Workspace & Activity */}
          <ResearchWorkspace />
        </div>

        {/* Contextual Information Column (~32% width on large screens) */}
        <div className="lg:col-span-4 space-y-6">
          <ContextualTelemetryPanel
            subsystems={statusOverview?.subsystems || {}}
            providers={statusOverview?.providers || []}
            readinessChecklist={statusOverview?.readiness_checklist || []}
            isLoading={isLoading}
            onRefresh={loadStatus}
          />
        </div>
      </div>

      {/* Roadmap Inspection Modal */}
      <Modal
        isOpen={isRoadmapModalOpen}
        onClose={() => setIsRoadmapModalOpen(false)}
        title="LLM Evaluation Lab — 12-Phase Architecture Progression"
        subtitle="Current active milestone: Phase 1 — Lab Foundation & Architecture."
        maxWidth="lg"
      >
        <div className="space-y-3 text-xs text-slate-600">
          <div className="p-3.5 bg-sky-50 rounded-xl border border-sky-200/80 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">Phase 1: Lab Foundation & Architecture</span>
              <Badge variant="verified" size="xs">Active / Verified</Badge>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Monorepo architecture, FastAPI v1 endpoints, SQLAlchemy 2 async database foundations, light research workstation UI, and live telemetry.
            </p>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800">Phase 2: Model Playground & Integration</span>
              <Badge variant="pending" size="xs">Planned</Badge>
            </div>
            <p className="text-[11px] text-slate-500">
              Multi-model streaming, provider adapters (OpenAI, Anthropic, Gemini), and experiment tracking.
            </p>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800">Phase 3: Benchmark & Dataset Engine</span>
              <Badge variant="pending" size="xs">Planned</Badge>
            </div>
            <p className="text-[11px] text-slate-500">
              Standardized research benchmark suite execution (MMLU-Pro, GSM8K, ARC, HumanEval) and dataset catalog.
            </p>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800">Phase 4: Evaluation & Scoring Engine</span>
              <Badge variant="pending" size="xs">Planned</Badge>
            </div>
            <p className="text-[11px] text-slate-500">
              Automated scoring engines, rule-based validators, semantic similarity evaluators, and LLM-as-a-Judge pipelines.
            </p>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1 opacity-75">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800">Phases 5–12: Advanced Intelligence & Robustness</span>
              <Badge variant="pending" size="xs">Roadmap</Badge>
            </div>
            <p className="text-[11px] text-slate-500">
              Hallucination detection, failure clustering, adversarial stress-testing, Pareto frontiers, calibration analysis, and regression tests.
            </p>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
};
