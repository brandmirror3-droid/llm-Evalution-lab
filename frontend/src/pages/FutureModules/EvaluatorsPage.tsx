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
  Award,
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

const RECENT_TEST_RUNS = [
  {
    id: '38940',
    tone: 'polite',
    input: 'We need your feedback on the new designs ASAP.',
    recipient: 'Darius',
    response: 'Dear Darius, would you be so kind as to provide your feedback on the new designs at your earliest convenience? Your input is greatly appreciated.',
    conciseness: '4/5',
    concisenessPct: 80,
    addressStatus: 'Pass',
    toneScore: '5/5',
    tonePct: 100,
  },
  {
    id: '33658',
    tone: 'formal',
    input: 'Please find attached the quarterly report for your review.',
    recipient: 'John Smith',
    response: 'Dear Mr. John Smith, I hope this message finds you well. Enclosed, please find the quarterly report for your perusal and review.',
    conciseness: '2/5',
    concisenessPct: 40,
    addressStatus: 'Pass',
    toneScore: '5/5',
    tonePct: 100,
  },
  {
    id: '38941',
    tone: 'funny',
    input: 'I’ll be late to the office because my cat is sleeping on my keyboard.',
    recipient: 'Team',
    response: 'Hey team, it seems my cat has mistaken my keyboard for a five-star hotel and decided to nap on it. So, I’ll be a bit late. Talk about a purr-ticular situation, right?',
    conciseness: '5/5',
    concisenessPct: 100,
    addressStatus: 'Pass',
    toneScore: '5/5',
    tonePct: 100,
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
      subtitle="Deterministic validation criteria, LLM-as-a-judge rubrics, score distributions, and testcase verification."
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
        {/* Top Summary Cards (Inspired by Scorecard Reference Image 1) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-[#0c111a] border border-[#1e293b] rounded-lg p-3.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-200">Tone Accuracy</span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-1.5 py-0.2 rounded">
                  8 passed, 0 failed
                </span>
              </div>
              <div className="text-xl font-bold font-mono text-emerald-400">100.0%</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Passing Rate</div>
            </div>
            <div className="mt-3 pt-2 border-t border-[#1e293b] flex items-end gap-1.5 h-10">
              <div className="w-1/4 bg-[#101622] rounded-t flex flex-col justify-end items-center h-2" />
              <div className="w-1/4 bg-[#101622] rounded-t flex flex-col justify-end items-center h-3" />
              <div className="w-1/4 bg-amber-500/60 hover:bg-amber-500 rounded-t h-5 transition-all" title="Score 4: 2 items" />
              <div className="w-1/4 bg-amber-500 hover:bg-amber-400 rounded-t h-9 transition-all" title="Score 5: 6 items" />
            </div>
          </div>

          <div className="bg-[#0c111a] border border-[#1e293b] rounded-lg p-3.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-200">Recipient Grounding</span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-1.5 py-0.2 rounded">
                  8 passed, 0 failed
                </span>
              </div>
              <div className="text-xl font-bold font-mono text-emerald-400">100.0%</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Passing Rate</div>
            </div>
            <div className="mt-3 pt-2 border-t border-[#1e293b] flex items-end gap-3 h-10">
              <div className="flex-1 bg-amber-500 hover:bg-amber-400 rounded-t h-9 transition-all" title="PASS: 8" />
              <div className="flex-1 bg-[#101622] rounded-t h-1" title="FAIL: 0" />
            </div>
          </div>

          <div className="bg-[#0c111a] border border-[#1e293b] rounded-lg p-3.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-200">Conciseness & Length</span>
                <span className="text-[10px] font-mono text-sky-400 bg-sky-950/40 border border-sky-800/60 px-1.5 py-0.2 rounded">
                  7 passed, 1 failed
                </span>
              </div>
              <div className="text-xl font-bold font-mono text-sky-400">87.5%</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Passing Rate</div>
            </div>
            <div className="mt-3 pt-2 border-t border-[#1e293b] flex items-end gap-1.5 h-10">
              <div className="w-1/4 bg-[#101622] rounded-t h-1" />
              <div className="w-1/4 bg-amber-500/40 rounded-t h-3" title="Score 2: 1 item" />
              <div className="w-1/4 bg-amber-500/80 rounded-t h-7" title="Score 4: 4 items" />
              <div className="w-1/4 bg-amber-500 rounded-t h-6" title="Score 5: 3 items" />
            </div>
          </div>
        </div>

        {/* 2-Column Scientific Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Left Column: Evaluator Registry (~35% width / col-span-4) */}
          <div className="lg:col-span-4 bg-[#0c111a] border border-[#1e293b] rounded-lg p-3.5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#1e293b]">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200 font-mono">
                <FileCheck2 className="w-4 h-4 text-sky-400" />
                <span>EVALUATOR REGISTRY</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                {EVALUATORS_CATALOG.length} Active
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
                    className={`p-2.5 rounded border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-sky-500/15 border-sky-500/50 shadow-sm'
                        : 'bg-[#101622] border-[#1e293b] hover:bg-[#141c2b]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-semibold ${isSelected ? 'text-sky-300' : 'text-slate-200'}`}>
                        {ev.name}
                      </span>
                      <span className="text-[9px] font-mono text-slate-400 capitalize px-1 py-0.2 bg-[#080c14] rounded border border-[#1e293b]">
                        {ev.category.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-snug line-clamp-2">
                      {ev.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Evaluator Configurator (~65% width / col-span-8) */}
          <div className="lg:col-span-8 bg-[#0c111a] border border-[#1e293b] rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-sky-400" />
                <div>
                  <h3 className="text-xs font-semibold text-slate-200 font-mono uppercase tracking-wider">
                    {selectedEvaluator.name} Configuration
                  </h3>
                  <p className="text-[11px] text-slate-400">{selectedEvaluator.description}</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-300 bg-[#101622] border border-[#1e293b] px-2 py-0.5 rounded">
                Scoring: {selectedEvaluator.scoringType}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Judge Model Architecture */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-300 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-sky-400" />
                  <span>Judge Model Architecture</span>
                </label>
                <select
                  value={judgeModel}
                  onChange={(e) => setJudgeModel(e.target.value)}
                  disabled={selectedEvaluator.category === 'deterministic'}
                  className="w-full bg-[#101622] border border-[#1e293b] rounded px-2.5 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-sky-500 disabled:opacity-40"
                >
                  <option value="gpt-4o">OpenAI — gpt-4o (Strict Judge)</option>
                  <option value="claude-3-5-sonnet">Anthropic — claude-3-5-sonnet</option>
                  <option value="gemini-1-5-pro">Google — gemini-1.5-pro</option>
                </select>
              </div>

              {/* Scoring Methodology */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-300 flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-sky-400" />
                  <span>Scoring Scale</span>
                </label>
                <select
                  value={scoringScale}
                  onChange={(e) => setScoringScale(e.target.value)}
                  className="w-full bg-[#101622] border border-[#1e293b] rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500 font-mono"
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
                <span className="font-mono text-slate-300 text-[11px]">Acceptance Threshold</span>
                <span className="font-mono text-sky-400 font-bold">{threshold}</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.0"
                step="0.01"
                value={threshold}
                onChange={(e) => setThreshold(parseFloat(e.target.value))}
                className="w-full accent-sky-400 bg-[#1e293b] h-1 rounded appearance-none cursor-pointer"
              />
            </div>

            {/* Rubric Textarea */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-300 flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5 text-purple-400" />
                <span>Evaluation Rubric Guidelines</span>
              </label>
              <textarea
                value={rubricText}
                onChange={(e) => setRubricText(e.target.value)}
                rows={3}
                className="w-full bg-[#101622] border border-[#1e293b] rounded p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 font-sans leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Testcase Evaluation Drill-Down Table (Inspired by Scorecard Reference Image 1) */}
        <div className="bg-[#0c111a] border border-[#1e293b] rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#1e293b]">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-semibold text-slate-200 font-mono uppercase tracking-wider">
                Run Scored Testcases Drill-down
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Run ID: #5772 (Tone Rewriter Testset)</span>
          </div>

          <div className="border border-[#1e293b] rounded overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="bg-[#101622] border-b border-[#1e293b] text-slate-400 text-[10px] uppercase">
                  <th className="py-2 px-3">Testcase ID</th>
                  <th className="py-2 px-3">Tone</th>
                  <th className="py-2 px-3">Original Prompt</th>
                  <th className="py-2 px-3">Recipient</th>
                  <th className="py-2 px-3">Response Snippet</th>
                  <th className="py-2 px-3">Conciseness</th>
                  <th className="py-2 px-3">Recipient Addr</th>
                  <th className="py-2 px-3">Tone Accuracy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e293b] text-[11px] text-slate-300">
                {RECENT_TEST_RUNS.map((run) => (
                  <tr key={run.id} className="hover:bg-[#101622]/60">
                    <td className="py-2 px-3 font-semibold text-sky-400">{run.id}</td>
                    <td className="py-2 px-3 text-slate-300 capitalize">{run.tone}</td>
                    <td className="py-2 px-3 font-sans text-slate-300 max-w-[180px] truncate">{run.input}</td>
                    <td className="py-2 px-3 text-slate-400">{run.recipient}</td>
                    <td className="py-2 px-3 font-sans text-slate-400 max-w-[200px] truncate">{run.response}</td>
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-300">{run.conciseness}</span>
                        <div className="w-12 h-1 bg-[#1e293b] rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400" style={{ width: `${run.concisenessPct}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="py-2 px-3">
                      <span className="text-[10px] text-emerald-400 bg-emerald-950/40 px-1 py-0.2 rounded border border-emerald-800/60">
                        {run.addressStatus}
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-300">{run.toneScore}</span>
                        <div className="w-12 h-1 bg-[#1e293b] rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-400" style={{ width: `${run.tonePct}%` }} />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State for Evaluation Runs */}
        <div className="bg-[#0c111a] border border-[#1e293b] rounded-lg p-4">
          <EmptyState
            icon={<CheckSquare className="w-5 h-5 text-slate-500" />}
            title="Batch evaluation runner awaiting trigger"
            description="Run an evaluation from the Playground or Experiments workbench to inspect scored outputs against active rubrics."
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
        <div className="space-y-3 text-xs text-slate-300">
          <p className="leading-relaxed">
            The evaluator rubrics and scoring configurations are active. Live multi-criteria scoring against model outputs will activate in Phase 4.
          </p>
          <div className="p-3 rounded bg-[#080c14] border border-[#1e293b] font-mono text-[11px] text-slate-300 space-y-1">
            <div className="text-slate-500">// Inactivity Guard Status</div>
            <div>POST /api/v1/modules/evaluators/execute → <span className="text-amber-400 font-semibold">501 Not Implemented</span></div>
            <div>Evaluator: {selectedEvaluator.id}</div>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
};