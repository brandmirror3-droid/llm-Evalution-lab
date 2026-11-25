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
  Search,
} from 'lucide-react';

interface EvaluatorDef {
  id: string;
  name: string;
  category: 'exact_match' | 'semantic_similarity' | 'factual_correctness' | 'faithfulness' | 'hallucination' | 'relevance' | 'safety' | 'structured_output' | 'custom_rubric';
  description: string;
  scoringType: string;
  metricDirection: 'higher_is_better' | 'lower_is_better';
  defaultThreshold: number;
}

const EVALUATORS_CATALOG: EvaluatorDef[] = [
  {
    id: 'exact_match',
    name: 'Strict Exact Match (EM)',
    category: 'exact_match',
    description: 'Case-normalized exact string matching with whitespace and punctuation normalization.',
    scoringType: 'Binary [0, 1]',
    metricDirection: 'higher_is_better',
    defaultThreshold: 1.0,
  },
  {
    id: 'semantic_cosine',
    name: 'Semantic Cosine Distance',
    category: 'semantic_similarity',
    description: 'Dense embedding cosine distance using text-embedding-3-large vectors.',
    scoringType: 'Continuous [-1.0..1.0]',
    metricDirection: 'higher_is_better',
    defaultThreshold: 0.85,
  },
  {
    id: 'g_eval_correctness',
    name: 'G-Eval Factual Correctness',
    category: 'factual_correctness',
    description: 'LLM-as-a-judge multi-step rubric scoring for factual precision against gold reference.',
    scoringType: 'Likert [1..5] Normalized',
    metricDirection: 'higher_is_better',
    defaultThreshold: 0.85,
  },
  {
    id: 'faithfulness_grounding',
    name: 'Faithfulness & Grounding',
    category: 'faithfulness',
    description: 'Identifies claims unsupported by or directly contradicting source context passages.',
    scoringType: 'Continuous [0.0..1.0]',
    metricDirection: 'higher_is_better',
    defaultThreshold: 0.90,
  },
  {
    id: 'hallucination_detector',
    name: 'Premise Hallucination Detector',
    category: 'hallucination',
    description: 'Detects fabricated entities, invalid citations, and non-existent APIs.',
    scoringType: 'Continuous Risk [0.0..1.0]',
    metricDirection: 'lower_is_better',
    defaultThreshold: 0.10,
  },
  {
    id: 'context_relevance',
    name: 'Contextual Relevance',
    category: 'relevance',
    description: 'Measures density of relevant information without conversational fluff or filler.',
    scoringType: 'Continuous [0.0..1.0]',
    metricDirection: 'higher_is_better',
    defaultThreshold: 0.80,
  },
  {
    id: 'safety_guardrail',
    name: 'Safety & Toxicity Classifier',
    category: 'safety',
    description: 'Scans for harmful instruction execution, PII leakage, and jailbreak compliance.',
    scoringType: 'Binary Pass / Fail',
    metricDirection: 'higher_is_better',
    defaultThreshold: 1.0,
  },
  {
    id: 'json_schema_v7',
    name: 'JSON Schema Validation',
    category: 'structured_output',
    description: 'Strict schema conformance check validating required keys, types, and enums.',
    scoringType: 'Pass / Fail',
    metricDirection: 'higher_is_better',
    defaultThreshold: 1.0,
  },
  {
    id: 'custom_rubric_judge',
    name: 'Custom Domain Rubric',
    category: 'custom_rubric',
    description: 'User-specified criteria for style, legal compliance, or tone adherence.',
    scoringType: 'Likert [1..5] Normalized',
    metricDirection: 'higher_is_better',
    defaultThreshold: 0.80,
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
  const [searchQuery, setSearchQuery] = useState('');
  const [judgeModel, setJudgeModel] = useState('gpt-4o');
  const [scoringScale, setScoringScale] = useState('likert');
  const [threshold, setThreshold] = useState(0.85);
  const [rubricText, setRubricText] = useState(
    'Evaluate whether the response provides a complete, mathematically sound answer based strictly on the provided context without introducing fabricated theorems.'
  );
  const [isGateModalOpen, setIsGateModalOpen] = useState(false);

  const filteredEvaluators = EVALUATORS_CATALOG.filter(
    (e) =>
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageContainer
      title="Evaluators"
      subtitle="Evaluation instruments: deterministic validation, LLM-as-a-judge rubrics, score distributions, and testcase verification."
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
      <div className="space-y-3 font-mono text-[#D9DEE2]">
        {/* Top Summary Cards (Inspired by Scorecard Reference Image 1) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {/* Card 1: Tone Accuracy */}
          <div className="bg-[#1C1F22] border border-[#35393D] rounded-sm p-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-[#D9DEE2]">Tone Accuracy</span>
                <span className="text-[9.5px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-1.5 py-0.2 rounded-sm font-semibold">
                  8 passed, 0 failed
                </span>
              </div>
              <div className="text-xl font-bold text-emerald-400 font-mono">100.0%</div>
              <div className="text-[10px] text-[#929BA3] mt-0.5">Passing Rate • Higher is better ↑</div>
            </div>
            {/* Scorecard-style histogram with ticks */}
            <div className="mt-3 pt-2 border-t border-[#2A2D31] flex flex-col gap-1">
              <div className="flex items-end gap-1.5 h-10 w-full">
                <div className="w-1/4 bg-[#111315] rounded-t-sm flex flex-col justify-end items-center h-2" />
                <div className="w-1/4 bg-[#111315] rounded-t-sm flex flex-col justify-end items-center h-3" />
                <div className="w-1/4 bg-amber-500/60 rounded-t-sm h-5" title="Score 4: 2 items" />
                <div className="w-1/4 bg-amber-500 rounded-t-sm h-9" title="Score 5: 6 items" />
              </div>
              <div className="flex justify-between text-[8px] text-[#687179] font-mono px-1">
                <span>1</span>
                <span>2</span>
                <span>4</span>
                <span>5</span>
              </div>
            </div>
          </div>

          {/* Card 2: Recipient Grounding */}
          <div className="bg-[#1C1F22] border border-[#35393D] rounded-sm p-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-[#D9DEE2]">Recipient Grounding</span>
                <span className="text-[9.5px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-1.5 py-0.2 rounded-sm font-semibold">
                  8 passed, 0 failed
                </span>
              </div>
              <div className="text-xl font-bold text-emerald-400 font-mono">100.0%</div>
              <div className="text-[10px] text-[#929BA3] mt-0.5">Passing Rate • Higher is better ↑</div>
            </div>
            <div className="mt-3 pt-2 border-t border-[#2A2D31] flex flex-col gap-1">
              <div className="flex items-end gap-3 h-10 w-full">
                <div className="flex-1 bg-amber-500 rounded-t-sm h-9" title="PASS: 8" />
                <div className="flex-1 bg-[#111315] rounded-t-sm h-1" title="FAIL: 0" />
              </div>
              <div className="flex justify-around text-[8px] text-[#687179] font-mono">
                <span>PASS</span>
                <span>FAIL</span>
              </div>
            </div>
          </div>

          {/* Card 3: Conciseness & Length */}
          <div className="bg-[#1C1F22] border border-[#35393D] rounded-sm p-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-[#D9DEE2]">Conciseness &amp; Length</span>
                <span className="text-[9.5px] text-cyan-400 bg-cyan-950/40 border border-cyan-800/60 px-1.5 py-0.2 rounded-sm font-semibold">
                  7 passed, 1 failed
                </span>
              </div>
              <div className="text-xl font-bold text-cyan-400 font-mono">87.5%</div>
              <div className="text-[10px] text-[#929BA3] mt-0.5">Passing Rate • Higher is better ↑</div>
            </div>
            <div className="mt-3 pt-2 border-t border-[#2A2D31] flex flex-col gap-1">
              <div className="flex items-end gap-1.5 h-10 w-full">
                <div className="w-1/4 bg-[#111315] rounded-t-sm h-1" />
                <div className="w-1/4 bg-amber-500/40 rounded-t-sm h-3" title="Score 2: 1 item" />
                <div className="w-1/4 bg-amber-500/80 rounded-t-sm h-7" title="Score 4: 4 items" />
                <div className="w-1/4 bg-amber-500 rounded-t-sm h-6" title="Score 5: 3 items" />
              </div>
              <div className="flex justify-between text-[8px] text-[#687179] font-mono px-1">
                <span>1</span>
                <span>2</span>
                <span>4</span>
                <span>5</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Scientific Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 items-start">
          {/* Left Column: Evaluator Registry (~35% width / col-span-4) */}
          <div className="lg:col-span-4 bg-[#1C1F22] border border-[#35393D] rounded-sm p-3 space-y-2.5 shadow-sm">
            <div className="flex items-center justify-between pb-1.5 border-b border-[#35393D]">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#D9DEE2]">
                <FileCheck2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>EVALUATOR REGISTRY</span>
              </div>
              <span className="text-[9.5px] text-[#687179]">
                {filteredEvaluators.length} INSTRUMENTS
              </span>
            </div>

            {/* Filter Search */}
            <div className="relative">
              <Search className="w-3 h-3 text-[#687179] absolute left-2 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter evaluators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#111315] border border-[#35393D] rounded-sm pl-7 pr-2 py-0.5 text-[10px] text-[#D9DEE2] placeholder-[#687179] focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div className="space-y-1.5 max-h-[380px] overflow-y-auto">
              {filteredEvaluators.map((ev) => {
                const isSelected = selectedEvaluator.id === ev.id;
                return (
                  <div
                    key={ev.id}
                    onClick={() => {
                      setSelectedEvaluator(ev);
                      setThreshold(ev.defaultThreshold);
                    }}
                    className={`p-2 rounded-sm border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-cyan-500/15 border-cyan-400 shadow-sm'
                        : 'bg-[#111315] border-[#35393D] hover:bg-[#232629]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className={`font-semibold text-[11px] ${isSelected ? 'text-cyan-300' : 'text-[#D9DEE2]'}`}>
                        {ev.name}
                      </span>
                      <span className="text-[8.5px] font-mono text-[#929BA3] uppercase px-1 py-0.2 bg-[#17191B] rounded-sm border border-[#35393D]">
                        {ev.category.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-[#929BA3] text-[10px] leading-snug line-clamp-2 font-sans">
                      {ev.description}
                    </p>
                    <div className="mt-1 flex items-center justify-between text-[9px] text-[#687179]">
                      <span>Scoring: {ev.scoringType}</span>
                      <span className="text-cyan-400">
                        {ev.metricDirection === 'higher_is_better' ? '↑ Higher' : '↓ Lower'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Evaluator Configurator (~65% width / col-span-8) */}
          <div className="lg:col-span-8 bg-[#1C1F22] border border-[#35393D] rounded-sm p-3.5 space-y-3 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-[#35393D]">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <div>
                  <h3 className="text-xs font-bold text-[#D9DEE2] uppercase tracking-wider">
                    {selectedEvaluator.name} Configuration
                  </h3>
                  <p className="text-[10.5px] text-[#929BA3] font-sans">{selectedEvaluator.description}</p>
                </div>
              </div>
              <span className="text-[9.5px] text-[#D9DEE2] bg-[#111315] border border-[#35393D] px-2 py-0.5 rounded-sm">
                Direction: {selectedEvaluator.metricDirection === 'higher_is_better' ? 'Higher is better ↑' : 'Lower is better ↓'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              {/* Judge Model Architecture */}
              <div className="space-y-1">
                <label className="text-[10px] text-[#929BA3] flex items-center gap-1.5 uppercase tracking-wider">
                  <Cpu className="w-3 h-3 text-cyan-400" />
                  <span>Judge Model Architecture</span>
                </label>
                <select
                  value={judgeModel}
                  onChange={(e) => setJudgeModel(e.target.value)}
                  disabled={selectedEvaluator.category === 'exact_match' || selectedEvaluator.category === 'structured_output'}
                  className="w-full bg-[#111315] border border-[#35393D] rounded-sm px-2 py-1 text-xs text-[#D9DEE2] focus:outline-none focus:border-cyan-500 disabled:opacity-40"
                >
                  <option value="gpt-4o">OpenAI — gpt-4o (Strict Judge)</option>
                  <option value="claude-3-5-sonnet">Anthropic — claude-3-5-sonnet</option>
                  <option value="gemini-1-5-pro">Google — gemini-1.5-pro</option>
                </select>
              </div>

              {/* Scoring Scale */}
              <div className="space-y-1">
                <label className="text-[10px] text-[#929BA3] flex items-center gap-1.5 uppercase tracking-wider">
                  <Hash className="w-3 h-3 text-cyan-400" />
                  <span>Scoring Scale</span>
                </label>
                <select
                  value={scoringScale}
                  onChange={(e) => setScoringScale(e.target.value)}
                  className="w-full bg-[#111315] border border-[#35393D] rounded-sm px-2 py-1 text-xs text-[#D9DEE2] focus:outline-none focus:border-cyan-500"
                >
                  <option value="likert">Likert Scale (1..5 Normalized)</option>
                  <option value="binary">Binary Pass / Fail</option>
                  <option value="continuous">Continuous Confidence (0.0..1.0)</option>
                </select>
              </div>
            </div>

            {/* Acceptance Threshold */}
            <div className="space-y-1 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#929BA3] text-[10.5px]">Acceptance Threshold</span>
                <span className="text-cyan-400 font-bold">{threshold}</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.0"
                step="0.01"
                value={threshold}
                onChange={(e) => setThreshold(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 bg-[#111315] h-1 rounded-sm appearance-none cursor-pointer"
              />
            </div>

            {/* Rubric Textarea */}
            <div className="space-y-1">
              <label className="text-[10px] text-[#929BA3] flex items-center gap-1.5 uppercase tracking-wider">
                <Brain className="w-3 h-3 text-purple-400" />
                <span>Evaluation Rubric Guidelines</span>
              </label>
              <textarea
                value={rubricText}
                onChange={(e) => setRubricText(e.target.value)}
                rows={3}
                className="w-full bg-[#111315] border border-[#35393D] rounded-sm p-2 text-xs text-[#D9DEE2] placeholder-[#687179] focus:outline-none focus:border-cyan-500 font-sans leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Testcase Evaluation Drill-Down Table (Scorecard inspired) */}
        <div className="bg-[#1C1F22] border border-[#35393D] rounded-sm p-3.5 space-y-2.5 shadow-sm">
          <div className="flex items-center justify-between pb-1.5 border-b border-[#35393D]">
            <div className="flex items-center gap-2">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <h3 className="text-xs font-bold text-[#D9DEE2] uppercase tracking-wider">
                Run Scored Testcases Drill-down
              </h3>
            </div>
            <span className="text-[9.5px] text-[#687179]">Run ID: #5772 (Tone Rewriter Testset)</span>
          </div>

          <div className="border border-[#35393D] rounded-sm overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="bg-[#101214] border-b border-[#35393D] text-[#687179] text-[9px] uppercase font-bold">
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
              <tbody className="divide-y divide-[#2A2D31] text-[10.5px]">
                {RECENT_TEST_RUNS.map((run) => (
                  <tr key={run.id} className="hover:bg-[#232629]">
                    <td className="py-2 px-3 font-semibold text-cyan-400">{run.id}</td>
                    <td className="py-2 px-3 text-[#D9DEE2] capitalize">{run.tone}</td>
                    <td className="py-2 px-3 font-sans text-[#929BA3] max-w-[180px] truncate">{run.input}</td>
                    <td className="py-2 px-3 text-[#929BA3]">{run.recipient}</td>
                    <td className="py-2 px-3 font-sans text-[#D9DEE2] max-w-[200px] truncate">{run.response}</td>
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-[#D9DEE2]">{run.conciseness}</span>
                        <div className="w-12 h-1 bg-[#111315] rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400" style={{ width: `${run.concisenessPct}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="py-2 px-3">
                      <span className="text-[9.5px] text-emerald-400 bg-emerald-950/40 px-1 py-0.2 rounded-sm border border-emerald-800/60 font-semibold">
                        {run.addressStatus}
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-[#D9DEE2]">{run.toneScore}</span>
                        <div className="w-12 h-1 bg-[#111315] rounded-full overflow-hidden">
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
        <div className="bg-[#1C1F22] border border-[#35393D] rounded-sm p-4">
          <EmptyState
            icon={<CheckSquare className="w-5 h-5 text-[#687179]" />}
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
        title="Evaluator Runner Gate [HTTP 501]"
        subtitle="Batch scoring and LLM-as-a-judge pipelines activate in Phase 4."
      >
        <div className="space-y-3 text-xs font-mono text-[#D9DEE2]">
          <p className="leading-relaxed font-sans text-[#929BA3]">
            The evaluator rubrics and scoring configurations are active. Live multi-criteria scoring against model outputs will activate in Phase 4.
          </p>
          <div className="p-2.5 rounded-sm bg-[#111315] border border-[#35393D] text-[10.5px] space-y-1">
            <div className="text-[#687179]">// Inactivity Guard Status</div>
            <div>POST /api/v1/modules/evaluators/execute → <span className="text-amber-400 font-semibold">501 Not Implemented</span></div>
            <div>Evaluator: {selectedEvaluator.id}</div>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
};
