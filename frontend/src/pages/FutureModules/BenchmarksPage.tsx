import React, { useState } from 'react';
import { PageContainer } from '../../components/layout/PageContainer';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { Modal } from '../../components/ui/Modal';
import {
  Search,
  BookOpen,
  ArrowUpRight,
  BarChart2,
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
    name: 'ARC Challenge (Abstraction & Reasoning)',
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

  const filteredSuites = ACADEMIC_BENCHMARKS.filter((b) => {
    const matchesCategory = categoryFilter === 'all' || b.category.toLowerCase().includes(categoryFilter.toLowerCase());
    const matchesSearch =
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <PageContainer
      title="Benchmarks"
      subtitle="Standardized academic benchmark specifications and comparative evaluation suites."
      actions={
        <Button
          variant="primary"
          size="sm"
          icon={<BarChart2 className="w-3.5 h-3.5" />}
          onClick={() => setIsGateModalOpen(true)}
        >
          Run Benchmark Suite
        </Button>
      }
      maxWidth="wide"
    >
      <div className="space-y-6">
        {/* Section 1: Standard Academic Benchmark Catalog */}
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden space-y-3 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-slate-400" />
              <div>
                <h3 className="text-xs font-semibold text-slate-900">
                  Published Academic Benchmark Specifications
                </h3>
                <p className="text-[11px] text-slate-500">
                  Standardized peer-reviewed evaluation batteries used across foundation model research.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter suites..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-md pl-8 pr-3 py-1 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 w-44 font-sans"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-xs text-slate-700 focus:outline-none focus:border-sky-500 font-sans"
              >
                <option value="all">All Domains</option>
                <option value="reasoning">Reasoning & STEM</option>
                <option value="code">Code Generation</option>
                <option value="truthfulness">Truthfulness & Safety</option>
              </select>
            </div>
          </div>

          <div className="border border-slate-200 rounded-md overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium text-[11px]">
                  <th className="py-2 px-3">Suite</th>
                  <th className="py-2 px-3">Category</th>
                  <th className="py-2 px-3">Task Architecture</th>
                  <th className="py-2 px-3">Canonical Volume</th>
                  <th className="py-2 px-3">Scoring Metric</th>
                  <th className="py-2 px-3">Provenance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {filteredSuites.map((suite) => (
                  <tr key={suite.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-2.5 px-3 font-medium text-slate-900">
                      <span className="font-mono text-sky-700 mr-1.5">{suite.id.toUpperCase()}</span>
                      <span className="text-slate-500 font-normal">({suite.name})</span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      {suite.category}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">{suite.taskType}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-700">{suite.sampleCount}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-700">{suite.metric}</td>
                    <td className="py-2.5 px-3 text-slate-500 text-[11px] flex items-center gap-1">
                      <span>{suite.sourcePaper}</span>
                      <ArrowUpRight className="w-3 h-3 text-slate-400" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: Local Benchmark Results Matrix */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-xs font-semibold text-slate-900">
                Comparative Local Benchmark Results
              </h3>
              <p className="text-[11px] text-slate-500">
                Locally executed evaluation scores across tested models.
              </p>
            </div>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
              Phase 3 Execution Engine
            </span>
          </div>

          <div className="border border-slate-200 rounded-md overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium text-[11px]">
                  <th className="py-2 px-3">Model</th>
                  <th className="py-2 px-3">MMLU</th>
                  <th className="py-2 px-3">GSM8K</th>
                  <th className="py-2 px-3">HumanEval</th>
                  <th className="py-2 px-3">ARC</th>
                  <th className="py-2 px-3 text-right">Normalized Avg</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={6} className="py-10">
                    <EmptyState
                      icon={<BarChart2 className="w-5 h-5 text-slate-400" />}
                      title="No local benchmark runs executed yet"
                      description="Select a benchmark suite to run automated evaluation across connected foundation models."
                      enablingPhase="Phase 3: Benchmark & Dataset Engine"
                      actionLabel="Verify Benchmark Gate"
                      onAction={() => setIsGateModalOpen(true)}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Phase 3 Gate Modal */}
      <Modal
        isOpen={isGateModalOpen}
        onClose={() => setIsGateModalOpen(false)}
        title="Benchmark Runner Gate"
        subtitle="Automated batch benchmarking activates in Phase 3."
      >
        <div className="space-y-3 text-xs text-slate-600">
          <p className="leading-relaxed">
            The benchmark specifications and scoring schemas are defined. Live multi-threaded test execution will activate in Phase 3.
          </p>
          <div className="p-3 rounded bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-700 space-y-1">
            <div className="text-slate-400">// Inactivity Guard Status</div>
            <div>POST /api/v1/modules/benchmarks/execute → <span className="text-amber-600 font-semibold">501 Not Implemented</span></div>
            <div>Phase Target: Phase 3 (Benchmark & Dataset Engine)</div>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
};
