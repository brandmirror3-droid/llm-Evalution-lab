import React, { useState } from 'react';
import { PageContainer } from '../../components/layout/PageContainer';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { Modal } from '../../components/ui/Modal';
import {
  CheckSquare,
  Sliders,
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
    name: 'Faithfulness & Grounding',
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

  return (
    <PageContainer
      title="Evaluators"
      subtitle="Configure deterministic evaluation criteria, LLM-as-a-judge rubrics, and continuous scoring thresholds."
      actions={
        <Button
          variant="primary"
          size="sm"
          icon={<Play className="w-3.5 h-3.5" />}
          onClick={() => setIsGateModalOpen(true)}
        >
          Execute Evaluation Run
        </Button>
      }
      maxWidth="wide"
    >
      <div className="space-y-4">
        {/* 2-Column Scientific Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Left Column: Evaluator Registry (~35% width / col-span-4) */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-lg p-3.5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900">
                <FileCheck2 className="w-4 h-4 text-slate-400" />
                <span>Evaluator Registry</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                {EVALUATORS_CATALOG.length} Evaluators
              </span>
            </div>

            <div className="space-y-1.5">
              {EVALUATORS_CATALOG.map((ev) => {
                const isSelected = selectedEvaluator.id === ev.id;
                return (
                  <div
                    key={ev.id}
                    onClick={() => {
                      setSelectedEvaluator(ev);
                      setThreshold(ev.defaultThreshold);
                    }}
                    className={`p-2.5 rounded-md border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-sky-50/60 border-sky-300 ring-1 ring-sky-200'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-slate-900">{ev.name}</span>
                      <span className="text-[10px] font-mono text-slate-500 capitalize">
                        {ev.category.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px] leading-snug line-clamp-2">
                      {ev.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Evaluator Configurator (~65% width / col-span-8) */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-slate-400" />
                <div>
                  <h3 className="text-xs font-semibold text-slate-900">
                    {selectedEvaluator.name} Configuration
                  </h3>
                  <p className="text-[11px] text-slate-500">{selectedEvaluator.description}</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                Scoring: {selectedEvaluator.scoringType}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Judge Model Architecture */}
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-600 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-slate-400" />
                  <span>Judge Model</span>
                </label>
                <select
                  value={judgeModel}
                  onChange={(e) => setJudgeModel(e.target.value)}
                  disabled={selectedEvaluator.category === 'deterministic'}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-xs font-mono text-slate-900 focus:outline-none focus:border-sky-500 disabled:opacity-50"
                >
                  <option value="gpt-4o">OpenAI — gpt-4o (Strict Judge)</option>
                  <option value="claude-3-5-sonnet">Anthropic — claude-3-5-sonnet</option>
                  <option value="gemini-1-5-pro">Google — gemini-1.5-pro</option>
                </select>
              </div>

              {/* Scoring Methodology */}
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-600 flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-slate-400" />
                  <span>Scoring Scale</span>
                </label>
                <select
                  value={scoringScale}
                  onChange={(e) => setScoringScale(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-sky-500 font-sans"
                >
                  <option value="likert">Likert Scale (1..5 Normalized)</option>
                  <option value="binary">Binary Pass / Fail</option>
                  <option value="continuous">Continuous Confidence (0.0..1.0)</option>
                </select>
              </div>
            </div>

            {/* Acceptance Threshold */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-600 text-[11px]">Acceptance Threshold</span>
                <span className="font-mono text-slate-900 font-bold">{threshold}</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.0"
                step="0.01"
                value={threshold}
                onChange={(e) => setThreshold(parseFloat(e.target.value))}
                className="w-full accent-sky-600 bg-slate-200 h-1 rounded appearance-none cursor-pointer"
              />
            </div>

            {/* Rubric Textarea */}
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-600 flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5 text-slate-400" />
                <span>Evaluation Rubric Guidelines</span>
              </label>
              <textarea
                value={rubricText}
                onChange={(e) => setRubricText(e.target.value)}
                rows={4}
                className="w-full bg-slate-50 border border-slate-200 rounded-md p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 font-sans leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Empty State for Evaluation Runs */}
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <EmptyState
            icon={<CheckSquare className="w-5 h-5 text-slate-400" />}
            title="No evaluation runs recorded yet"
            description="Run an evaluation from the Playground or Experiments workbench to inspect scored outputs."
            enablingPhase="Phase 4: Evaluation & Scoring Engine"
            actionLabel="Verify Evaluator Gate"
            onAction={() => setIsGateModalOpen(true)}
          />
        </div>
      </div>

      {/* Phase 4 Gate Modal */}
      <Modal
        isOpen={isGateModalOpen}
        onClose={() => setIsGateModalOpen(false)}
        title="Evaluator Runner Gate"
        subtitle="Batch scoring and LLM-as-a-judge pipelines activate in Phase 4."
      >
        <div className="space-y-3 text-xs text-slate-600">
          <p className="leading-relaxed">
            The evaluator rubrics and scoring configurations are active. Live multi-criteria scoring against model outputs will activate in Phase 4.
          </p>
          <div className="p-3 rounded bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-700 space-y-1">
            <div className="text-slate-400">// Inactivity Guard Status</div>
            <div>POST /api/v1/modules/evaluators/execute → <span className="text-amber-600 font-semibold">501 Not Implemented</span></div>
            <div>Evaluator: {selectedEvaluator.id}</div>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
};
