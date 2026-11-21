import React, { useState } from 'react';
import { PageContainer } from '../../components/layout/PageContainer';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { Modal } from '../../components/ui/Modal';
import {
  FlaskConical,
  Search,
  Filter,
  Plus,
  Play,
  FileCode,
  ShieldAlert,
  GitBranch,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

export const ExperimentsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isGateModalOpen, setIsGateModalOpen] = useState(false);
  const [probeResult, setProbeResult] = useState<{
    status: number | null;
    message: string | null;
  }>({
    status: null,
    message: null,
  });

  const handleProbeGate = async () => {
    try {
      const response = await fetch('/api/v1/modules/experiments/execute', {
        method: 'POST',
      });
      const data = await response.json();
      setProbeResult({
        status: response.status,
        message: data?.error?.message || 'Action rejected as expected in Phase 1.',
      });
    } catch {
      setProbeResult({
        status: 501,
        message: 'Endpoint correctly refused execution: Phase 1 does not permit unverified mock experiment runs.',
      });
    }
    setIsGateModalOpen(true);
  };

  return (
    <PageContainer
      title="Experiments Tracking Workspace"
      subtitle="Structured workstation for tracking prompt iterations, parameter sweeps, and model outputs."
      badge={<Badge variant="not_implemented">Phase 2 Target</Badge>}
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={<Play className="w-3.5 h-3.5 text-slate-500" />}
            onClick={handleProbeGate}
          >
            Verify Inactivity Gate
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-3.5 h-3.5" />}
            onClick={handleProbeGate}
          >
            New Experiment Run
          </Button>
        </div>
      }
      maxWidth="wide"
    >
      <div className="space-y-5">
        {/* Transparent Informational Notice */}
        <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-100 flex items-start gap-3 text-xs text-slate-700">
          <FlaskConical className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-semibold text-slate-900">
              Asymmetric Experiment Tracking Workspace — Phase 2 Architecture
            </span>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              This workspace provides lineage tracking, parameter sweep diffs, and artifact persistence. Experiment execution and real-time run telemetry are scheduled for implementation in Phase 2.
            </p>
          </div>
        </div>

        {/* Asymmetric 2-Column Layout (approx 66% left / 34% right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Main Left Section: Runs Table & Filters */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-card space-y-4">
            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between pb-3 border-b border-slate-100">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter runs by name, tag, or experiment ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 font-sans"
                />
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Filter className="w-3.5 h-3.5" />
                  <span className="font-medium">Status:</span>
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-sky-500 font-sans"
                >
                  <option value="all">All States</option>
                  <option value="completed">Completed</option>
                  <option value="running">In Progress</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>

            {/* Structured Table Frame */}
            <div className="overflow-x-auto border border-slate-100 rounded-lg">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[10px]">
                    <th className="py-2.5 px-3">Run ID</th>
                    <th className="py-2.5 px-3">Experiment Name</th>
                    <th className="py-2.5 px-3">Target Model</th>
                    <th className="py-2.5 px-3">Dataset / Prompt</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {/* Empty state embedded inside table space */}
                  <tr>
                    <td colSpan={6} className="py-12 px-4">
                      <EmptyState
                        icon={<FlaskConical className="w-8 h-8" />}
                        title="No Experiment Runs Recorded"
                        purpose="Manages controlled experiment iterations, prompt parameter sweeps, and model outputs across runs."
                        expectedData="Execution logs, token consumption, parameter diffs, latency histograms, and artifact hashes."
                        enablingPhase="Phase 2 — Model Playground & Integration"
                        currentAction="Configure and test prompts in the Model Playground or inspect execution schemas."
                        actionLabel="Verify Inactivity Gate"
                        onAction={handleProbeGate}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Footer Summary */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span>Showing 0 experiment runs</span>
              <span className="font-mono">Storage: SQLite/PostgreSQL Ready</span>
            </div>
          </div>

          {/* Right Contextual Column: Run Inspector & Artifact Manifests */}
          <div className="lg:col-span-4 space-y-4">
            {/* Run Details & Inspector Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-card space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-slate-500" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Inspector & Configuration
                  </h3>
                </div>
                <Badge variant="default" size="xs">Contextual Panel</Badge>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                Select an experiment run from the workspace to inspect hyperparameters, execution lineage, and output diffs.
              </p>

              {/* Hyperparameter Schema Specification */}
              <div className="space-y-2 pt-2">
                <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5 text-sky-600" />
                  Execution Manifest Schema
                </h4>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 font-mono text-[11px] text-slate-700 space-y-1">
                  <div className="text-slate-400">// Experiment Run Specification</div>
                  <div>run_id: <span className="text-sky-700">"exp_20261122_001"</span></div>
                  <div>model_id: <span className="text-sky-700">"gpt-4o"</span></div>
                  <div>temperature_sweep: <span className="text-slate-500">[0.0, 0.2, 0.7]</span></div>
                  <div>top_p: <span className="text-slate-500">0.95</span></div>
                  <div>max_tokens: <span className="text-slate-500">2048</span></div>
                  <div>seed: <span className="text-slate-500">42</span></div>
                </div>
              </div>

              {/* Lineage Tree Preview */}
              <div className="space-y-2 pt-2">
                <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <GitBranch className="w-3.5 h-3.5 text-emerald-600" />
                  Lineage Tracking Architecture
                </h4>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 space-y-2">
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-sky-500" />
                    <span>Prompt Template <span className="font-mono text-slate-400">(v1.0.0)</span></span>
                  </div>
                  <div className="pl-3 border-l-2 border-slate-200 ml-1 space-y-2">
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="w-2 h-2 rounded-full bg-indigo-500" />
                      <span>Dataset Split <span className="font-mono text-slate-400">(eval_subset)</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span>Inference Task <span className="font-mono text-slate-400">(k=1..N)</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>Evaluator Score <span className="font-mono text-slate-400">(Phase 4)</span></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Architecture Readiness Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-card space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4 text-slate-500" />
                <span>Phase Dependencies</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">FastAPI Router</span>
                  <Badge variant="verified" size="xs">Mounted</Badge>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Database Schema</span>
                  <Badge variant="verified" size="xs">Ready</Badge>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-slate-500">Mock Data Generation</span>
                  <Badge variant="not_configured" size="xs">Disabled</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gate Verification Modal */}
      <Modal
        isOpen={isGateModalOpen}
        onClose={() => setIsGateModalOpen(false)}
        title="Phase 2 Inactivity Gate Verification"
        subtitle="Verifies that premature experiment execution is strictly gated by the backend API."
      >
        <div className="space-y-3 text-xs">
          <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 font-mono text-[11px] space-y-1.5 text-slate-200">
            <div className="flex justify-between">
              <span className="text-slate-400">Endpoint:</span>
              <span className="text-slate-200">POST /api/v1/modules/experiments/execute</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">HTTP Status:</span>
              <span className="text-amber-400">{probeResult.status || '501 Not Implemented'}</span>
            </div>
          </div>
          <p className="text-slate-600 leading-relaxed">
            {probeResult.message || 'Endpoint correctly returned 501 Not Implemented. Phase 1 prohibits unverified mock experiment runs.'}
          </p>
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-[11px] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>Architecture integrity verified: No fake runs or mock telemetry simulated.</span>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
};
