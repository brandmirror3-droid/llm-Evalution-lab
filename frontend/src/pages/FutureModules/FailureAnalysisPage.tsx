import React, { useState } from 'react';
import { PageContainer } from '../../components/layout/PageContainer';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { Modal } from '../../components/ui/Modal';
import {
  AlertTriangle,
  Play,
  Bug,
  Split,
  Lightbulb,
} from 'lucide-react';

interface FailureCategory {
  id: string;
  name: string;
  severity: 'critical' | 'high' | 'medium';
  sampleCount: number;
  description: string;
  examplePrompt: string;
  exampleOutput: string;
  exampleExpected: string;
  rootCause: string;
  countermeasure: string;
}

const ERROR_TAXONOMY: FailureCategory[] = [
  {
    id: 'premise_hallucination',
    name: 'Premise Hallucination',
    severity: 'critical',
    sampleCount: 14,
    description: 'Fabrication of non-existent facts, papers, or library APIs not grounded in source context.',
    examplePrompt: 'Provide the import path for calculate_quantum_entropy in numpy 1.26.',
    exampleOutput: 'from numpy.linalg import calculate_quantum_entropy\n# Returns von Neumann entropy',
    exampleExpected: 'Function does not exist in NumPy core; requires scipy.stats or custom implementation.',
    rootCause: 'Over-confident associative token prediction on pseudo-technical terminology.',
    countermeasure: 'Inject explicit negative constraint: "If an API method does not exist in standard release, report not found."',
  },
  {
    id: 'formatting_breach',
    name: 'Formatting Constraint Breach',
    severity: 'medium',
    sampleCount: 22,
    description: 'Inclusion of conversational preamble or markdown code blocks when raw JSON was strictly requested.',
    examplePrompt: 'Return only valid JSON with keys "score" and "rationale". Do not include markdown.',
    exampleOutput: 'Certainly! Here is your requested JSON:\n```json\n{"score": 92, "rationale": "Sound logic"}\n```',
    exampleExpected: '{"score": 92, "rationale": "Sound logic"}',
    rootCause: 'System prompt conversational bias overriding user-level output constraints.',
    countermeasure: 'Utilize provider native Structured Outputs (JSON Schema mode) or enforce stop sequences.',
  },
  {
    id: 'syllogistic_fallacy',
    name: 'Syllogistic Contradiction',
    severity: 'high',
    sampleCount: 9,
    description: 'Logical fallacy where intermediate reasoning contradicts the premise or conclusion.',
    examplePrompt: 'All prime numbers greater than 2 are odd. 17 is prime. Is 17 odd?',
    exampleOutput: '17 is a prime number. However, some primes like 2 are even, therefore 17 might not necessarily be odd.',
    exampleExpected: 'Yes, 17 is greater than 2 and prime, therefore 17 is odd.',
    rootCause: 'Attention decay during multi-step syllogism parsing.',
    countermeasure: 'Use step-by-step verification prompts or chain-of-thought verification evaluators.',
  },
  {
    id: 'false_refusal',
    name: 'Overzealous False Refusal',
    severity: 'high',
    sampleCount: 11,
    description: 'Model refuses benign academic or security analysis prompts due to superficial keyword triggers.',
    examplePrompt: 'Analyze the history of the Caesar cipher and write a decryption demonstration in Python.',
    exampleOutput: 'I cannot fulfill this request as I cannot assist with bypassing cryptographic protections or malicious cyber activities.',
    exampleExpected: 'A historical overview of Caesar cipher shift mechanism with basic modular arithmetic demonstration.',
    rootCause: 'Overly conservative safety classifier trigger on terms like "decryption" and "bypassing".',
    countermeasure: 'Frame prompts with explicit educational/research context framing in the system prompt.',
  },
];

export const FailureAnalysisPage: React.FC = () => {
  const [selectedFailure, setSelectedFailure] = useState<FailureCategory>(ERROR_TAXONOMY[0]);
  const [isGateModalOpen, setIsGateModalOpen] = useState(false);

  return (
    <PageContainer
      title="Failure Analysis"
      subtitle="Error taxonomy categorization, token discrepancy inspection, and root-cause attribution."
      actions={
        <Button
          variant="primary"
          size="sm"
          icon={<Play className="w-3.5 h-3.5" />}
          onClick={() => setIsGateModalOpen(true)}
        >
          Run Failure Clustering
        </Button>
      }
      maxWidth="wide"
    >
      <div className="space-y-4">
        {/* 2-Column Investigation Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Left Column: Error Taxonomy (~35% width / col-span-4) */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-lg p-3.5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900">
                <Bug className="w-4 h-4 text-slate-400" />
                <span>Error Taxonomy</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                {ERROR_TAXONOMY.length} Categories
              </span>
            </div>

            <div className="space-y-1.5">
              {ERROR_TAXONOMY.map((err) => {
                const isSelected = selectedFailure.id === err.id;
                return (
                  <div
                    key={err.id}
                    onClick={() => setSelectedFailure(err)}
                    className={`p-2.5 rounded-md border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-rose-50/50 border-rose-300 ring-1 ring-rose-200'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-semibold text-slate-900">{err.name}</span>
                      <span className="text-[10px] font-mono text-slate-500 uppercase">
                        {err.severity}
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px] leading-snug line-clamp-2">
                      {err.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Case Discrepancy & Diagnostics (~65% width / col-span-8) */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-lg p-4 space-y-3.5">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Split className="w-4 h-4 text-slate-400" />
                <h3 className="text-xs font-semibold text-slate-900">
                  Incident Inspector: {selectedFailure.name}
                </h3>
              </div>
              <span className="text-[10px] font-mono text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
                Severity: {selectedFailure.severity}
              </span>
            </div>

            {/* Prompt */}
            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Evaluation Prompt Input
              </span>
              <div className="p-2.5 bg-slate-50 rounded-md border border-slate-200 font-mono text-[11px] text-slate-800">
                {selectedFailure.examplePrompt}
              </div>
            </div>

            {/* Output vs Expected */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-rose-700 uppercase tracking-wider block">
                  Model Output (Observed Discrepancy)
                </span>
                <div className="p-2.5 bg-rose-50/50 rounded-md border border-rose-200 font-mono text-[11px] text-rose-950 whitespace-pre-wrap min-h-[90px]">
                  {selectedFailure.exampleOutput}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-emerald-700 uppercase tracking-wider block">
                  Expected Reference Ground Truth
                </span>
                <div className="p-2.5 bg-emerald-50/50 rounded-md border border-emerald-200 font-mono text-[11px] text-emerald-950 whitespace-pre-wrap min-h-[90px]">
                  {selectedFailure.exampleExpected}
                </div>
              </div>
            </div>

            {/* Diagnostics & Mitigation */}
            <div className="p-3 bg-slate-50 rounded-md border border-slate-200 space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800">Hypothesized Root Cause: </span>
                  <span className="text-slate-600 text-[11px]">{selectedFailure.rootCause}</span>
                </div>
              </div>
              <div className="pt-1.5 border-t border-slate-200/60 text-[11px]">
                <span className="font-semibold text-slate-800">Recommended Countermeasure: </span>
                <span className="text-slate-600">{selectedFailure.countermeasure}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Failures Empty State */}
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <EmptyState
            icon={<AlertTriangle className="w-5 h-5 text-slate-400" />}
            title="No live failure clusters recorded"
            description="Run model evaluations to automatically detect, group, and attribute hallucination patterns."
            enablingPhase="Phase 6: Failure Analysis & Error Intelligence"
            actionLabel="Verify Failure Gate"
            onAction={() => setIsGateModalOpen(true)}
          />
        </div>
      </div>

      {/* Phase 6 Gate Modal */}
      <Modal
        isOpen={isGateModalOpen}
        onClose={() => setIsGateModalOpen(false)}
        title="Failure Clustering Gate"
        subtitle="Automated semantic error clustering activates in Phase 6."
      >
        <div className="space-y-3 text-xs text-slate-600">
          <p className="leading-relaxed">
            The failure taxonomy schemas and LCS diffing models are architected. Live clustering and vector semantic error trees will activate in Phase 6.
          </p>
          <div className="p-3 rounded bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-700 space-y-1">
            <div className="text-slate-400">// Inactivity Guard Status</div>
            <div>POST /api/v1/modules/failure-analysis/execute → <span className="text-amber-600 font-semibold">501 Not Implemented</span></div>
            <div>Phase Target: Phase 6 (Failure Analysis & Error Intelligence)</div>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
};
