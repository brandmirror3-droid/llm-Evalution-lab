import React, { useState } from 'react';
import { PageContainer } from '../../components/layout/PageContainer';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { Modal } from '../../components/ui/Modal';
import {
  GitCompare,
  ArrowRightLeft,
  Terminal,
} from 'lucide-react';

interface ModelSpec {
  id: string;
  name: string;
  provider: string;
  contextWindow: string;
  costInputPerM: string;
  costOutputPerM: string;
  specialty: string;
}

const COMPARISON_MODELS: ModelSpec[] = [
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
    specialty: 'Massive Context Window, Audio/Video',
  },
];

export const ModelComparisonPage: React.FC = () => {
  const [modelA, setModelA] = useState('gpt-4o');
  const [modelB, setModelB] = useState('claude-3-5-sonnet');
  const [prompt, setPrompt] = useState(
    'Compare the asymptotic algorithmic complexity of Dijkstra with a Fibonacci heap vs binary heap.'
  );
  const [isGateModalOpen, setIsGateModalOpen] = useState(false);

  const modelASpec = COMPARISON_MODELS.find((m) => m.id === modelA) || COMPARISON_MODELS[0];
  const modelBSpec = COMPARISON_MODELS.find((m) => m.id === modelB) || COMPARISON_MODELS[1];

  return (
    <PageContainer
      title="Model Comparison"
      subtitle="Side-by-side prompt evaluation, synchronized response diffs, and trade-off matrices."
      actions={
        <Button
          variant="primary"
          size="sm"
          icon={<GitCompare className="w-3.5 h-3.5" />}
          onClick={() => setIsGateModalOpen(true)}
        >
          Run Comparison Sweep
        </Button>
      }
      maxWidth="wide"
    >
      <div className="space-y-4">
        {/* Model Selection Bar */}
        <div className="bg-white border border-slate-200 rounded-lg p-3.5 space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="w-full sm:w-auto flex-1">
              <label className="text-[11px] font-medium text-slate-600 block mb-1">
                Primary Model (A)
              </label>
              <select
                value={modelA}
                onChange={(e) => setModelA(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-xs font-mono text-slate-900 focus:outline-none focus:border-sky-500"
              >
                {COMPARISON_MODELS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.provider})
                  </option>
                ))}
              </select>
            </div>

            <div className="p-1 rounded-full bg-slate-100 text-slate-400 shrink-0">
              <ArrowRightLeft className="w-3.5 h-3.5" />
            </div>

            <div className="w-full sm:w-auto flex-1">
              <label className="text-[11px] font-medium text-slate-600 block mb-1">
                Comparator Model (B)
              </label>
              <select
                value={modelB}
                onChange={(e) => setModelB(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-xs font-mono text-slate-900 focus:outline-none focus:border-sky-500"
              >
                {COMPARISON_MODELS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.provider})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Model Specification Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
            <div className="p-2.5 bg-slate-50 rounded-md border border-slate-200 space-y-1">
              <div className="flex items-center justify-between font-semibold text-slate-900">
                <span>{modelASpec.name}</span>
                <span className="text-[10px] text-slate-500">{modelASpec.provider}</span>
              </div>
              <div className="flex items-center gap-3 font-mono text-[11px] text-slate-600">
                <span>Context: {modelASpec.contextWindow}</span>
                <span>In: {modelASpec.costInputPerM}</span>
                <span>Out: {modelASpec.costOutputPerM}</span>
              </div>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-md border border-slate-200 space-y-1">
              <div className="flex items-center justify-between font-semibold text-slate-900">
                <span>{modelBSpec.name}</span>
                <span className="text-[10px] text-slate-500">{modelBSpec.provider}</span>
              </div>
              <div className="flex items-center gap-3 font-mono text-[11px] text-slate-600">
                <span>Context: {modelBSpec.contextWindow}</span>
                <span>In: {modelBSpec.costInputPerM}</span>
                <span>Out: {modelBSpec.costOutputPerM}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Shared Prompt & Aligned Responses */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-600 block">
              Shared Prompt
            </label>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-800 font-sans focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Model A Viewport */}
            <div className="border border-slate-200 rounded-md bg-slate-50/50 flex flex-col h-[280px]">
              <div className="px-3 py-1.5 border-b border-slate-200 bg-white rounded-t-md flex items-center justify-between text-xs">
                <span className="font-medium text-slate-800">{modelASpec.name}</span>
                <span className="text-[10px] font-mono text-slate-400">Response</span>
              </div>
              <div className="p-3 flex-1 flex flex-col justify-center items-center">
                <EmptyState
                  icon={<Terminal className="w-4 h-4 text-slate-400" />}
                  title="Awaiting comparison inference"
                  description="Click 'Run Comparison Sweep' to test both models against this prompt."
                  enablingPhase="Phase 8: Model Intelligence & Comparative Analytics"
                />
              </div>
            </div>

            {/* Model B Viewport */}
            <div className="border border-slate-200 rounded-md bg-slate-50/50 flex flex-col h-[280px]">
              <div className="px-3 py-1.5 border-b border-slate-200 bg-white rounded-t-md flex items-center justify-between text-xs">
                <span className="font-medium text-slate-800">{modelBSpec.name}</span>
                <span className="text-[10px] font-mono text-slate-400">Response</span>
              </div>
              <div className="p-3 flex-1 flex flex-col justify-center items-center">
                <EmptyState
                  icon={<Terminal className="w-4 h-4 text-slate-400" />}
                  title="Awaiting comparison inference"
                  description="Click 'Run Comparison Sweep' to test both models against this prompt."
                  enablingPhase="Phase 8: Model Intelligence & Comparative Analytics"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Phase 8 Gate Modal */}
      <Modal
        isOpen={isGateModalOpen}
        onClose={() => setIsGateModalOpen(false)}
        title="Model Comparison Gate"
        subtitle="Parallel multi-model comparison sweeps activate in Phase 8."
      >
        <div className="space-y-3 text-xs text-slate-600">
          <p className="leading-relaxed">
            The comparative matrix schemas and Pareto frontier definitions are active. Simultaneous multi-model streaming inference will activate in Phase 8.
          </p>
          <div className="p-3 rounded bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-700 space-y-1">
            <div className="text-slate-400">// Inactivity Guard Status</div>
            <div>POST /api/v1/modules/model-comparison/execute → <span className="text-amber-600 font-semibold">501 Not Implemented</span></div>
            <div>Phase Target: Phase 8 (Model Intelligence & Comparative Analytics)</div>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
};
