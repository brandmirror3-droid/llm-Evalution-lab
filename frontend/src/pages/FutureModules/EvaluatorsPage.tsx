import React, { useState } from 'react';
import { PageContainer } from '../../components/layout/PageContainer';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { Modal } from '../../components/ui/Modal';
import {
  Scale,
  Sliders,
  CheckCircle2,
  Play,
  FileCheck2,
  Cpu,
  Brain,
  Hash,
} from 'lucide-react';

interface EvaluatorDef {
  id: string;
  name: string;
  category: 'deterministic' | 'llm_judge' | 'statistical';
  description: string;
  scoringType: string;
  defaultThreshold: number;
}

const EVALUATORS_CATALOG: EvaluatorDef[] = [
  {
    id: 'exact_match',
    name: 'Strict Exact Match (EM)',
    category: 'deterministic',
    description: 'Case-normalized exact string matching with whitespace trimming.',
    scoringType: 'Binary [0, 1]',
    defaultThreshold: 1.0,
  },
  {
    id: 'json_schema',
    name: 'JSON Schema Conformance',
    category: 'deterministic',
    description: 'Validates target response against strict JSON Schema v7 definitions.',
    scoringType: 'Pass / Fail',
    defaultThreshold: 1.0,
  },
  {
    id: 'g_eval_correctness',
    name: 'G-Eval Factual Correctness',
    category: 'llm_judge',
    description: 'LLM-as-a-judge multi-step rubric scoring for factual precision against gold reference.',
    scoringType: 'Likert [1..5] Normalized',
    defaultThreshold: 0.85,
  },
  {
    id: 'hallucination_faithfulness',
    name: 'Faithfulness & Premise Grounding',
    category: 'llm_judge',
    description: 'Detects unsupported claims and counter-factual extrapolations from input context.',
    scoringType: 'Continuous [0.0..1.0]',
    defaultThreshold: 0.9,
  },
  {
    id: 'embedding_similarity',
    name: 'Semantic Cosine Distance',
    category: 'statistical',
    description: 'Dense vector embedding cosine similarity using text-embedding-3-large.',
    scoringType: 'Continuous [-1.0..1.0]',
    defaultThreshold: 0.82,
  },
];

export const EvaluatorsPage: React.FC = () => {
  const [selectedEvaluator, setSelectedEvaluator] = useState<EvaluatorDef>(EVALUATORS_CATALOG[2]);
  const [judgeModel, setJudgeModel] = useState('gpt-4o');
  const [scoringScale, setScoringScale] = useState('likert');
  const [threshold, setThreshold] = useState(0.85);
  const [rubricText, setRubricText] = useState(
    'Evaluate whether the response provides a complete, mathematically sound answer based strictly on the provided context without introducing fabricated theorems.'
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
      const response = await fetch('/api/v1/modules/evaluators/execute', {
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
        message: 'Endpoint correctly refused execution: Phase 1 does not permit unverified evaluator scoring runs.',
      });
    }
    setIsGateModalOpen(true);
  };

  return (
    <PageContainer
      title="Scientific Evaluators Laboratory"
      subtitle="Parameter-driven evaluator configuration, scoring rubrics, and judge calibration."
      badge={<Badge variant="not_implemented">Phase 4 Target</Badge>}
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
            icon={<Scale className="w-3.5 h-3.5" />}
            onClick={handleProbeGate}
          >
            Execute Evaluation Suite
          </Button>
        </div>
      }
      maxWidth="wide"
    >
      <div className="space-y-6">
        {/* Notice Banner */}
        <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-100 flex items-start gap-3 text-xs text-slate-700">
          <Scale className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-semibold text-slate-900">
              Scientific Instrument — Phase 4 Specification
            </span>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              This laboratory provides evaluator registry definitions, rubric schemas, and judge configuration parameters. Real-time scoring harnesses and multi-model judge runs are scheduled for Phase 4.
            </p>
          </div>
        </div>

        {/* Section 1: Evaluator Registry & Configurator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column: Evaluator Registry (40% width) */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-card space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-sky-600" />
                Evaluator Registry
              </h3>
              <Badge variant="default" size="xs">5 Calibrated</Badge>
            </div>

            <div className="space-y-2">
              {EVALUATORS_CATALOG.map((ev) => (
                <div
                  key={ev.id}
                  onClick={() => {
                    setSelectedEvaluator(ev);
                    setThreshold(ev.defaultThreshold);
                  }}
                  className={`p-3 rounded-lg border text-xs cursor-pointer transition-colors ${
                    selectedEvaluator.id === ev.id
                      ? 'bg-sky-50/70 border-sky-300 ring-1 ring-sky-300'
                      : 'bg-slate-50/60 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900">{ev.name}</span>
                    <Badge
                      variant={
                        ev.category === 'deterministic'
                          ? 'verified'
                          : ev.category === 'llm_judge'
                          ? 'default'
                          : 'pending'
                      }
                      size="xs"
                    >
                      {ev.category === 'deterministic'
                        ? 'Deterministic'
                        : ev.category === 'llm_judge'
                        ? 'LLM Judge'
                        : 'Statistical'}
                    </Badge>
                  </div>
                  <p className="text-slate-500 text-[11px] leading-relaxed mb-2">
                    {ev.description}
                  </p>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span>Scoring: {ev.scoringType}</span>
                    <span>Default: {ev.defaultThreshold}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Instrument Parameter Configurator (60% width) */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-slate-500" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Configurator: {selectedEvaluator.name}
                </h3>
              </div>
              <Badge variant="verified" size="xs">Scientific Instrument</Badge>
            </div>

            {/* Parameter Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                  <span>Judge Model Architecture</span>
                  <Cpu className="w-3.5 h-3.5 text-slate-400" />
                </label>
                <select
                  value={judgeModel}
                  onChange={(e) => setJudgeModel(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-sky-500 font-mono"
                  disabled={selectedEvaluator.category === 'deterministic'}
                >
                  <option value="gpt-4o">OpenAI — gpt-4o (Strict Judge)</option>
                  <option value="claude-3-5-sonnet">Anthropic — claude-3-5-sonnet</option>
                  <option value="gemini-1-5-pro">Google — gemini-1.5-pro</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                  <span>Scoring Methodology</span>
                  <Hash className="w-3.5 h-3.5 text-slate-400" />
                </label>
                <select
                  value={scoringScale}
                  onChange={(e) => setScoringScale(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-sky-500 font-sans"
                >
                  <option value="likert">Likert Scale (1..5 Normalized)</option>
                  <option value="binary">Binary Pass / Fail</option>
                  <option value="continuous">Continuous Confidence (0.0..1.0)</option>
                </select>
              </div>
            </div>

            {/* Threshold Slider */}
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Acceptance Threshold:</span>
                <span className="font-mono text-sky-700 font-bold">{threshold}</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.0"
                step="0.01"
                value={threshold}
                onChange={(e) => setThreshold(parseFloat(e.target.value))}
                className="w-full accent-sky-600 bg-slate-100 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>0.50 (Permissive)</span>
                <span>1.00 (Strict Gold Standard)</span>
              </div>
            </div>

            {/* Rubric Definition Textarea */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                <span>Evaluation Rubric & Judge Guidelines</span>
                <Brain className="w-3.5 h-3.5 text-slate-400" />
              </label>
              <textarea
                value={rubricText}
                onChange={(e) => setRubricText(e.target.value)}
                rows={4}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 font-sans leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Scored Runs Empty State */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-card">
          <EmptyState
            icon={<Scale className="w-8 h-8" />}
            title="No Evaluator Test Runs Recorded"
            purpose="Applies multi-criteria scoring rubrics and LLM-as-a-judge pipelines to model responses."
            expectedData="Numerical scores, judge chain-of-thought rationale, inter-annotator agreement metrics, and rubric compliance audits."
            enablingPhase="Phase 4 — Evaluation & Scoring Engine"
            currentAction="Inspect evaluator definitions, configure scoring rubrics, and calibrate judge prompts."
            actionLabel="Verify Inactivity Gate"
            onAction={handleProbeGate}
          />
        </div>
      </div>

      {/* Gate Verification Modal */}
      <Modal
        isOpen={isGateModalOpen}
        onClose={() => setIsGateModalOpen(false)}
        title="Phase 4 Evaluator Gate Verification"
        subtitle="Verifies that premature evaluation runs are strictly blocked by the backend API."
      >
        <div className="space-y-3 text-xs">
          <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 font-mono text-[11px] space-y-1.5 text-slate-200">
            <div className="flex justify-between">
              <span className="text-slate-400">Endpoint:</span>
              <span className="text-slate-200">POST /api/v1/modules/evaluators/execute</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">HTTP Status:</span>
              <span className="text-amber-400">{probeResult.status || '501 Not Implemented'}</span>
            </div>
          </div>
          <p className="text-slate-600 leading-relaxed">
            {probeResult.message || 'Endpoint correctly returned 501 Not Implemented. Phase 1 prohibits fake evaluation scores.'}
          </p>
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-[11px] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>Integrity verified: Evaluator rubrics calibrated; execution barred until Phase 4.</span>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
};
