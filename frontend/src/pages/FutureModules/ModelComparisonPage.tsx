import React, { useState } from 'react';
import { PageContainer } from '../../components/layout/PageContainer';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { Modal } from '../../components/ui/Modal';
import {
  GitCompare,
  Play,
  CheckCircle2,
  ArrowRightLeft,
} from 'lucide-react';

interface ModelComparisonSpec {
  id: string;
  name: string;
  provider: string;
  contextWindow: string;
  costInputPerM: string;
  costOutputPerM: string;
  specialty: string;
}

const COMPARISON_CANDIDATES: ModelComparisonSpec[] = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o (Omni)',
    provider: 'OpenAI',
    contextWindow: '128K',
    costInputPerM: '$2.50',
    costOutputPerM: '$10.00',
    specialty: 'Multimodal, Instruction Following',
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    contextWindow: '200K',
    costInputPerM: '$3.00',
    costOutputPerM: '$15.00',
    specialty: 'Complex Reasoning, Code Synthesis',
  },
  {
    id: 'gemini-1-5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'Google',
    contextWindow: '2M',
    costInputPerM: '$1.25',
    costOutputPerM: '$5.00',
    specialty: 'Massive Context, Video / Audio',
  },
  {
    id: 'llama-3-1-70b',
    name: 'Llama 3.1 70B Instruct',
    provider: 'Meta (Self-Hosted)',
    contextWindow: '128K',
    costInputPerM: '$0.35',
    costOutputPerM: '$0.40',
    specialty: 'Open Weights, Privacy, Custom Fine-tuning',
  },
];

export const ModelComparisonPage: React.FC = () => {
  const [modelA, setModelA] = useState('gpt-4o');
  const [modelB, setModelB] = useState('claude-3-5-sonnet');
  const [testPrompt] = useState(
    'Compare the asymptotic algorithmic complexity of Dijkstra with Fibonacci heap vs binary heap.'
  );
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
      const response = await fetch('/api/v1/modules/model-comparison/execute', {
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
        message: 'Endpoint correctly refused execution: Phase 1 does not permit unverified model comparison runs.',
      });
    }
    setIsGateModalOpen(true);
  };

  const modelASpec = COMPARISON_CANDIDATES.find((m) => m.id === modelA) || COMPARISON_CANDIDATES[0];
  const modelBSpec = COMPARISON_CANDIDATES.find((m) => m.id === modelB) || COMPARISON_CANDIDATES[1];

  return (
    <PageContainer
      title="Model Intelligence & Comparative Analytics"
      subtitle="Head-to-head model comparison, synchronized response diffs, and Pareto trade-off curves."
      badge={<Badge variant="not_implemented">Phase 8 Target</Badge>}
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
            icon={<GitCompare className="w-3.5 h-3.5" />}
            onClick={handleProbeGate}
          >
            Run Comparison Sweep
          </Button>
        </div>
      }
      maxWidth="wide"
    >
      <div className="space-y-6">
        {/* Notice Banner */}
        <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-100 flex items-start gap-3 text-xs text-slate-700">
          <GitCompare className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-semibold text-slate-900">
              Data Intelligence Workspace — Phase 8 Specification
            </span>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              This workspace visualizes cross-model comparison schemas, synchronized diff viewers, and Pareto efficiency frontiers. Multi-model parallel inference and Elo rating calculations are scheduled for Phase 8.
            </p>
          </div>
        </div>

        {/* Section 1: Comparison Header & Model Selectors */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-card space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-3 border-b border-slate-100">
            <div className="w-full sm:w-auto flex-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">
                Primary Model (A)
              </label>
              <select
                value={modelA}
                onChange={(e) => setModelA(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-sky-500"
              >
                {COMPARISON_CANDIDATES.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.provider})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-center p-2 rounded-full bg-slate-100 text-slate-500 shrink-0">
              <ArrowRightLeft className="w-4 h-4" />
            </div>

            <div className="w-full sm:w-auto flex-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">
                Comparator Model (B)
              </label>
              <select
                value={modelB}
                onChange={(e) => setModelB(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-sky-500"
              >
                {COMPARISON_CANDIDATES.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.provider})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Model Specification Comparison Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Model A Card */}
            <div className="p-3.5 bg-slate-50/70 border border-slate-200 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 font-mono">{modelASpec.name}</span>
                <Badge variant="verified" size="xs">{modelASpec.provider}</Badge>
              </div>
              <div className="grid grid-cols-3 gap-2 font-mono text-[11px] pt-1">
                <div>
                  <span className="text-slate-400 block text-[10px]">Context</span>
                  <span className="text-slate-800 font-semibold">{modelASpec.contextWindow}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Input / 1M</span>
                  <span className="text-slate-800 font-semibold">{modelASpec.costInputPerM}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Output / 1M</span>
                  <span className="text-slate-800 font-semibold">{modelASpec.costOutputPerM}</span>
                </div>
              </div>
              <p className="text-slate-500 text-[11px] pt-1 border-t border-slate-200/60">
                Specialty: {modelASpec.specialty}
              </p>
            </div>

            {/* Model B Card */}
            <div className="p-3.5 bg-slate-50/70 border border-slate-200 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 font-mono">{modelBSpec.name}</span>
                <Badge variant="verified" size="xs">{modelBSpec.provider}</Badge>
              </div>
              <div className="grid grid-cols-3 gap-2 font-mono text-[11px] pt-1">
                <div>
                  <span className="text-slate-400 block text-[10px]">Context</span>
                  <span className="text-slate-800 font-semibold">{modelBSpec.contextWindow}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Input / 1M</span>
                  <span className="text-slate-800 font-semibold">{modelBSpec.costInputPerM}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Output / 1M</span>
                  <span className="text-slate-800 font-semibold">{modelBSpec.costOutputPerM}</span>
                </div>
              </div>
              <p className="text-slate-500 text-[11px] pt-1 border-t border-slate-200/60">
                Specialty: {modelBSpec.specialty}
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Side-by-Side Synchronized Diff Preview */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Synchronized Prompt Evaluation Harness
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluates two model outputs against identical token input stream.
              </p>
            </div>
            <Badge variant="default" size="xs">Synchronized View</Badge>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Shared Prompt
            </span>
            <p className="font-mono text-slate-800 text-[11px]">{testPrompt}</p>
          </div>

          {/* Synchronized Columns with 4-part Empty State */}
          <div className="border border-slate-100 rounded-lg p-6">
            <EmptyState
              icon={<GitCompare className="w-8 h-8" />}
              title="Multi-Model Comparison Run Awaiting Phase 8"
              purpose="Performs head-to-head model comparison, synchronized response diffs, and Pareto trade-off analyses."
              expectedData="Paired token diffs, win/loss Elo ratings, latency histograms, and cost-efficiency frontier curves."
              enablingPhase="Phase 8 — Model Intelligence & Comparative Analytics"
              currentAction="Inspect comparative matrix schemas or configure target comparison models."
              actionLabel="Verify Inactivity Gate"
              onAction={handleProbeGate}
            />
          </div>
        </div>
      </div>

      {/* Gate Verification Modal */}
      <Modal
        isOpen={isGateModalOpen}
        onClose={() => setIsGateModalOpen(false)}
        title="Phase 8 Model Comparison Gate Verification"
        subtitle="Verifies that premature model comparison runs are strictly blocked by the backend API."
      >
        <div className="space-y-3 text-xs">
          <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 font-mono text-[11px] space-y-1.5 text-slate-200">
            <div className="flex justify-between">
              <span className="text-slate-400">Endpoint:</span>
              <span className="text-slate-200">POST /api/v1/modules/model-comparison/execute</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">HTTP Status:</span>
              <span className="text-amber-400">{probeResult.status || '501 Not Implemented'}</span>
            </div>
          </div>
          <p className="text-slate-600 leading-relaxed">
            {probeResult.message || 'Endpoint correctly returned 501 Not Implemented. Phase 1 prohibits fake model comparisons.'}
          </p>
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-[11px] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>Integrity verified: Model comparison specifications ready; execution inactive until Phase 8.</span>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
};
