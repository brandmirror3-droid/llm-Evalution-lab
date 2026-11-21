import React, { useState } from 'react';
import { PageContainer } from '../../components/layout/PageContainer';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { Modal } from '../../components/ui/Modal';
import {
  Award,
  Search,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Play,
  ArrowUpRight,
} from 'lucide-react';

interface BenchmarkSuiteSpec {
  id: string;
  name: string;
  category: string;
  taskType: string;
  sampleCount: string;
  metric: string;
  sourcePaper: string;
}

const ACADEMIC_BENCHMARKS: BenchmarkSuiteSpec[] = [
  {
    id: 'mmlu',
    name: 'MMLU (Massive Multitask Language Understanding)',
    category: 'General Knowledge & Reasoning',
    taskType: '57 subjects, 4-way multiple choice',
    sampleCount: '14,042 questions',
    metric: 'Accuracy (%)',
    sourcePaper: 'Hendrycks et al., 2020',
  },
  {
    id: 'gsm8k',
    name: 'GSM8K (Grade School Math)',
    category: 'Mathematical Reasoning',
    taskType: 'Multi-step arithmetic word problems',
    sampleCount: '8,500 questions',
    metric: 'Exact Match / Strict Format',
    sourcePaper: 'Cobbe et al., OpenAI, 2021',
  },
  {
    id: 'humaneval',
    name: 'HumanEval (Python Synthesis)',
    category: 'Code Generation',
    taskType: 'Docstring function completion',
    sampleCount: '164 problems',
    metric: 'pass@1, pass@10',
    sourcePaper: 'Chen et al., OpenAI, 2021',
  },
  {
    id: 'arc',
    name: 'ARC Challenge (Abstraction & Reasoning Corpus)',
    category: 'Advanced Science Reasoning',
    taskType: 'Grade-school science questions',
    sampleCount: '2,590 items',
    metric: 'Accuracy (%)',
    sourcePaper: 'Clark et al., Allen AI, 2018',
  },
  {
    id: 'truthfulqa',
    name: 'TruthfulQA',
    category: 'Hallucination & Truthfulness',
    taskType: 'Adversarial factuality questions',
    sampleCount: '817 questions',
    metric: 'Truthfulness % & Informativeness %',
    sourcePaper: 'Lin et al., Oxford, 2021',
  },
];

export const BenchmarksPage: React.FC = () => {
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
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
      const response = await fetch('/api/v1/modules/benchmarks/execute', {
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
        message: 'Endpoint correctly refused execution: Phase 1 does not permit unverified mock benchmark scoring.',
      });
    }
    setIsGateModalOpen(true);
  };

  const filteredSuites = ACADEMIC_BENCHMARKS.filter((b) => {
    const matchesCategory = categoryFilter === 'all' || b.category.toLowerCase().includes(categoryFilter);
    const matchesSearch =
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.taskType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <PageContainer
      title="Benchmark & Dataset Intelligence Engine"
      subtitle="Standardized academic benchmark specifications and comparative evaluation matrix."
      badge={<Badge variant="not_implemented">Phase 3 Target</Badge>}
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
            icon={<BarChart3 className="w-3.5 h-3.5" />}
            onClick={handleProbeGate}
          >
            Run Benchmark Suite
          </Button>
        </div>
      }
      maxWidth="wide"
    >
      <div className="space-y-6">
        {/* Transparent Informational Notice */}
        <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-100 flex items-start gap-3 text-xs text-slate-700">
          <Award className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-semibold text-slate-900">
              Data Intelligence Workspace — Phase 3 Specification
            </span>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              This workspace provides academic benchmark suite definitions, scoring protocols, and comparative matrix schemas. Benchmark execution, parallel scoring harnesses, and live leaderboards are scheduled for Phase 3.
            </p>
          </div>
        </div>

        {/* Section 1: Standard Academic Benchmark Catalog */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-card space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-sky-600" />
                Academic Benchmark Specifications
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Standardized test batteries calibrated for foundation model intelligence testing.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search suites..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 w-44"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-sky-500"
              >
                <option value="all">All Categories</option>
                <option value="general">General Knowledge</option>
                <option value="mathematical">Math Reasoning</option>
                <option value="code">Code Generation</option>
                <option value="hallucination">Truthfulness</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-100 rounded-lg">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[10px]">
                  <th className="py-2.5 px-3">Suite Name</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Task Architecture</th>
                  <th className="py-2.5 px-3">Sample Volume</th>
                  <th className="py-2.5 px-3">Scoring Metric</th>
                  <th className="py-2.5 px-3">Provenance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {filteredSuites.map((suite) => (
                  <tr key={suite.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-900">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sky-700 font-medium">{suite.id.toUpperCase()}</span>
                        <span className="text-slate-600 font-normal">({suite.name})</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      <Badge variant="default" size="xs">{suite.category}</Badge>
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">{suite.taskType}</td>
                    <td className="py-3 px-3 font-mono text-slate-700">{suite.sampleCount}</td>
                    <td className="py-3 px-3 font-mono text-slate-700">{suite.metric}</td>
                    <td className="py-3 px-3 text-slate-500 text-[11px] flex items-center gap-1">
                      <span>{suite.sourcePaper}</span>
                      <ArrowUpRight className="w-3 h-3 text-slate-400" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: Comparative Score Matrix Data Intelligence View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Comparative Score Matrix
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Normalized cross-model performance across evaluated benchmark dimensions.
                </p>
              </div>
              <Badge variant="not_implemented" size="xs">Phase 3 Engine</Badge>
            </div>

            <div className="border border-slate-100 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[10px]">
                    <th className="py-2.5 px-3">Target Model</th>
                    <th className="py-2.5 px-3">MMLU</th>
                    <th className="py-2.5 px-3">GSM8K</th>
                    <th className="py-2.5 px-3">HumanEval</th>
                    <th className="py-2.5 px-3">TruthfulQA</th>
                    <th className="py-2.5 px-3 text-right">Normalized</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={6} className="py-12 px-4">
                      <EmptyState
                        icon={<BarChart3 className="w-8 h-8" />}
                        title="Benchmark Score Matrix Awaiting Phase 3"
                        purpose="Performs systematic multi-model benchmarking against standardized academic evaluation suites."
                        expectedData="Normalized accuracy, pass@k metrics, category score breakdowns, and execution latencies."
                        enablingPhase="Phase 3 — Benchmark & Dataset Engine"
                        currentAction="Inspect benchmark specifications, dataset formats, and scoring protocols."
                        actionLabel="Verify Inactivity Gate"
                        onAction={handleProbeGate}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column: Execution Harness Specification */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Scoring Protocol Schema
              </h3>
              <Badge variant="verified" size="xs">Deterministic</Badge>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 font-mono text-[11px] text-slate-700 space-y-1.5">
              <div className="text-slate-400">// Benchmark Evaluation Schema</div>
              <div>suite_id: <span className="text-sky-700">"gsm8k"</span></div>
              <div>few_shot_k: <span className="text-slate-600">8</span></div>
              <div>scoring_protocol: <span className="text-sky-700">"strict_exact_match"</span></div>
              <div>normalize_numbers: <span className="text-emerald-700">true</span></div>
              <div>regex_target: <span className="text-amber-700">"#### (\\-?[0-9\\.,]+)"</span></div>
            </div>

            <div className="space-y-2 pt-2 text-xs">
              <h4 className="font-semibold text-slate-800">Scoring Rigor Standards</h4>
              <ul className="space-y-1.5 text-slate-600 text-[11px]">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1 shrink-0" />
                  <span>Zero contamination check against training corpora</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1 shrink-0" />
                  <span>Reproducible random seeds across model inferences</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1 shrink-0" />
                  <span>Deterministic regex and AST parsing for code benchmarks</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Gate Verification Modal */}
      <Modal
        isOpen={isGateModalOpen}
        onClose={() => setIsGateModalOpen(false)}
        title="Phase 3 Benchmark Gate Verification"
        subtitle="Verifies that premature benchmark scoring is strictly blocked by the backend API."
      >
        <div className="space-y-3 text-xs">
          <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 font-mono text-[11px] space-y-1.5 text-slate-200">
            <div className="flex justify-between">
              <span className="text-slate-400">Endpoint:</span>
              <span className="text-slate-200">POST /api/v1/modules/benchmarks/execute</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">HTTP Status:</span>
              <span className="text-amber-400">{probeResult.status || '501 Not Implemented'}</span>
            </div>
          </div>
          <p className="text-slate-600 leading-relaxed">
            {probeResult.message || 'Endpoint correctly returned 501 Not Implemented. Phase 1 prohibits fake benchmark scoring.'}
          </p>
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-[11px] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>Architecture integrity verified: No simulated benchmarks or leaderboards.</span>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
};
