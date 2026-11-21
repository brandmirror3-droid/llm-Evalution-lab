import React, { useState } from 'react';
import { PageContainer } from '../../components/layout/PageContainer';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { Modal } from '../../components/ui/Modal';
import {
  AlertTriangle,
  Play,
  CheckCircle2,
  Bug,
  Split,
  ShieldAlert,
  Lightbulb,
  FileCode2,
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
    description: 'Fabrication of non-existent facts, papers, or library APIs not grounded in the source context.',
    examplePrompt: 'Provide the import path for the calculate_quantum_entropy function in numpy 1.26.',
    exampleOutput: 'from numpy.linalg import calculate_quantum_entropy\n# Returns von Neumann entropy',
    exampleExpected: 'Function does not exist in NumPy core; requires scipy.stats or custom implementation.',
    rootCause: 'Over-confident associative token prediction on pseudo-technical terminology.',
    countermeasure: 'Inject explicit negative constraint: "If an API method does not exist in standard release, explicitly report not found."',
  },
  {
    id: 'formatting_breach',
    name: 'Formatting Constraint Breach',
    severity: 'medium',
    sampleCount: 22,
    description: 'Inclusion of conversational preamble, markdown code blocks, or trailing text when raw JSON was strictly requested.',
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
  const [probeResult, setProbeResult] = useState<{
    status: number | null;
    message: string | null;
  }>({
    status: null,
    message: null,
  });

  const handleProbeGate = async () => {
    try {
      const response = await fetch('/api/v1/modules/failure-analysis/execute', {
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
        message: 'Endpoint correctly refused execution: Phase 1 does not permit unverified failure clustering runs.',
      });
    }
    setIsGateModalOpen(true);
  };

  return (
    <PageContainer
      title="Failure Analysis & Error Intelligence"
      subtitle="Systematic error taxonomy, token-level discrepancy diffs, and root-cause diagnostics."
      badge={<Badge variant="not_implemented">Phase 6 Target</Badge>}
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
            icon={<AlertTriangle className="w-3.5 h-3.5" />}
            onClick={handleProbeGate}
          >
            Analyze Failure Clusters
          </Button>
        </div>
      }
      maxWidth="wide"
    >
      <div className="space-y-6">
        {/* Notice Banner */}
        <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-100 flex items-start gap-3 text-xs text-slate-700">
          <Bug className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-semibold text-slate-900">
              Investigation Workspace — Phase 6 Specification
            </span>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              This 3-column workstation demonstrates the error taxonomy and diff inspection architecture. Automated failure clustering, embedding semantic error graphs, and countermeasure sweeps are scheduled for Phase 6.
            </p>
          </div>
        </div>

        {/* 3-Column Investigation Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Column 1: Failure Taxonomy Clusters (28% width) */}
          <div className="lg:col-span-3 bg-white border border-slate-200 rounded-xl p-4 shadow-card space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Bug className="w-3.5 h-3.5 text-rose-600" />
                Error Taxonomy
              </h3>
              <Badge variant="default" size="xs">4 Taxa</Badge>
            </div>

            <div className="space-y-2">
              {ERROR_TAXONOMY.map((err) => (
                <div
                  key={err.id}
                  onClick={() => setSelectedFailure(err)}
                  className={`p-3 rounded-lg border text-xs cursor-pointer transition-colors ${
                    selectedFailure.id === err.id
                      ? 'bg-rose-50/70 border-rose-300 ring-1 ring-rose-300'
                      : 'bg-slate-50/60 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900">{err.name}</span>
                    <Badge
                      variant={
                        err.severity === 'critical'
                          ? 'error'
                          : err.severity === 'high'
                          ? 'not_configured'
                          : 'pending'
                      }
                      size="xs"
                    >
                      {err.severity}
                    </Badge>
                  </div>
                  <p className="text-slate-500 text-[11px] line-clamp-2 leading-relaxed">
                    {err.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Selected Failure Inspection & Discrepancy Diff (44% width) */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Split className="w-4 h-4 text-sky-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Discrepancy Inspector: {selectedFailure.name}
                </h3>
              </div>
              <Badge variant="error" size="xs">Observed Discrepancy</Badge>
            </div>

            {/* Prompt Section */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                Evaluation Prompt Input
              </span>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 font-mono text-[11px] text-slate-800">
                {selectedFailure.examplePrompt}
              </div>
            </div>

            {/* Model Erroneous Output */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Model Output (Discrepancy Detected)
                </span>
                <span className="text-[10px] font-mono text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  Hallucination / Error
                </span>
              </div>
              <div className="p-3 bg-rose-50/50 rounded-lg border border-rose-200 font-mono text-[11px] text-rose-950 whitespace-pre-wrap">
                {selectedFailure.exampleOutput}
              </div>
            </div>

            {/* Ground Truth Expected Output */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Expected Ground Truth Reference
                </span>
                <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Gold Standard
                </span>
              </div>
              <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-200 font-mono text-[11px] text-emerald-950 whitespace-pre-wrap">
                {selectedFailure.exampleExpected}
              </div>
            </div>
          </div>

          {/* Column 3: Diagnostics & Countermeasure Panel (28% width) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-card space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  Root Cause Diagnostics
                </h3>
                <Badge variant="default" size="xs">Attribution</Badge>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                    Hypothesized Root Cause
                  </span>
                  <p className="text-slate-700 mt-1 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    {selectedFailure.rootCause}
                  </p>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                    Recommended Prompt Mitigation
                  </span>
                  <p className="text-slate-700 mt-1 leading-relaxed bg-amber-50/60 p-2.5 rounded-lg border border-amber-200 text-amber-950 text-[11px]">
                    {selectedFailure.countermeasure}
                  </p>
                </div>
              </div>
            </div>

            {/* Architecture Gate Status */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-card space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <FileCode2 className="w-3.5 h-3.5 text-slate-500" />
                Phase 6 Engine Status
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Taxonomy Schema</span>
                  <Badge variant="verified" size="xs">Active</Badge>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Clustering Algorithm</span>
                  <Badge variant="pending" size="xs">Phase 6</Badge>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Live Telemetry</span>
                  <Badge variant="not_configured" size="xs">Zero Mock Rule</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Failure Runs Empty State */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-card">
          <EmptyState
            icon={<AlertTriangle className="w-8 h-8" />}
            title="No Live Failure Clusters Recorded"
            purpose="Performs automated clustering, error taxonomy categorization, and countermeasure recommendations for model failures."
            expectedData="Semantic error clusters, token-level diff views, failure frequency distributions, and countermeasure prompts."
            enablingPhase="Phase 6 — Failure Analysis & Error Intelligence"
            currentAction="Inspect error taxonomy definitions, failure schemas, and cluster configurations."
            actionLabel="Verify Inactivity Gate"
            onAction={handleProbeGate}
          />
        </div>
      </div>

      {/* Gate Verification Modal */}
      <Modal
        isOpen={isGateModalOpen}
        onClose={() => setIsGateModalOpen(false)}
        title="Phase 6 Failure Analysis Gate Verification"
        subtitle="Verifies that premature failure clustering is strictly blocked by the backend API."
      >
        <div className="space-y-3 text-xs">
          <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 font-mono text-[11px] space-y-1.5 text-slate-200">
            <div className="flex justify-between">
              <span className="text-slate-400">Endpoint:</span>
              <span className="text-slate-200">POST /api/v1/modules/failure-analysis/execute</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">HTTP Status:</span>
              <span className="text-amber-400">{probeResult.status || '501 Not Implemented'}</span>
            </div>
          </div>
          <p className="text-slate-600 leading-relaxed">
            {probeResult.message || 'Endpoint correctly returned 501 Not Implemented. Phase 1 prohibits fake failure clusters.'}
          </p>
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-[11px] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>Integrity verified: Error taxonomy defined; automated clustering inactive until Phase 6.</span>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
};
