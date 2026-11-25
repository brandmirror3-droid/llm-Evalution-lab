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
      title="Standardized Academic Benchmarks"
      subtitle="Standardized peer-reviewed academic benchmark suites, task architectures, and comparative evaluation matrices."
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
      <div className="space-y-4 font-mono">
        {/* Academic Benchmark Catalog */}
        <div className="bg-[#1C1F22] border border-[#35393D] rounded-sm overflow-hidden space-y-3 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#35393D]">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#06b6d4]" />
              <div>
                <h3 className="text-xs font-bold text-[#D9DEE2] uppercase tracking-wider font-mono">
                  Published Academic Benchmark Specifications
                </h3>
                <p className="text-[11px] text-[#929BA3] font-sans">
                  Standardized peer-reviewed evaluation batteries used across foundation model research.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#687179] absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter suites..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[#101214] border border-[#35393D] rounded-sm pl-8 pr-3 py-1 text-xs text-[#D9DEE2] placeholder-[#687179] focus:outline-none focus:border-[#06b6d4] w-44 font-mono"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-[#101214] border border-[#35393D] rounded-sm px-2 py-1 text-xs text-[#929BA3] focus:outline-none focus:border-[#06b6d4] font-mono"
              >
                <option value="all">ALL_DOMAINS</option>
                <option value="reasoning">REASONING_STEM</option>
                <option value="code">CODE_SYNTHESIS</option>
                <option value="truthfulness">FACTUALITY_SAFETY</option>
              </select>
            </div>
          </div>

          <div className="border border-[#35393D] rounded-sm overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="bg-[#17191B] border-b border-[#35393D] text-[#687179] font-bold text-[10px]">
                  <th className="py-2.5 px-3">SUITE_IDENTIFIER</th>
                  <th className="py-2.5 px-3">EVALUATION_DOMAIN</th>
                  <th className="py-2.5 px-3">TASK_ARCHITECTURE</th>
                  <th className="py-2.5 px-3">SAMPLE_VOLUME</th>
                  <th className="py-2.5 px-3">PRIMARY_METRIC</th>
                  <th className="py-2.5 px-3">ACADEMIC_PROVENANCE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#35393D]/60 font-mono text-[11px]">
                {filteredSuites.map((suite) => (
                  <tr key={suite.id} className="hover:bg-[#232629]/50 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-[#D9DEE2]">
                      <span className="text-[#06b6d4] mr-1.5 font-bold">[{suite.id.toUpperCase()}]</span>
                      <span className="text-[#929BA3] font-normal">({suite.name})</span>
                    </td>
                    <td className="py-2.5 px-3 text-[#929BA3]">
                      {suite.category}
                    </td>
                    <td className="py-2.5 px-3 text-[#687179] text-[10.5px]">{suite.taskType}</td>
                    <td className="py-2.5 px-3 text-[#D9DEE2]">{suite.sampleCount}</td>
                    <td className="py-2.5 px-3 text-[#06b6d4]">{suite.metric}</td>
                    <td className="py-2.5 px-3 text-[#687179] text-[10.5px]">
                      <span className="flex items-center gap-1">
                        <span>{suite.sourcePaper}</span>
                        <ArrowUpRight className="w-3 h-3 text-[#687179]" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Local Benchmark Results Matrix */}
        <div className="bg-[#1C1F22] border border-[#35393D] rounded-sm p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#35393D]">
            <div>
              <h3 className="text-xs font-bold text-[#D9DEE2] uppercase tracking-wider font-mono">
                Comparative Local Benchmark Execution Matrix
              </h3>
              <p className="text-[11px] text-[#929BA3] font-sans">
                Locally executed evaluation scores across tested models.
              </p>
            </div>
            <span className="text-[10px] font-mono text-[#06b6d4] bg-[#06b6d4]/10 px-2 py-0.5 rounded-sm border border-[#06b6d4]/30">
              PHASE_03_ENGINE
            </span>
          </div>

          <div className="border border-[#35393D] rounded-sm overflow-hidden">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="bg-[#17191B] border-b border-[#35393D] text-[#687179] font-bold text-[10px]">
                  <th className="py-2 px-3">TARGET_MODEL</th>
                  <th className="py-2 px-3">MMLU</th>
                  <th className="py-2 px-3">GSM8K</th>
                  <th className="py-2 px-3">HUMANEVAL</th>
                  <th className="py-2 px-3">ARC</th>
                  <th className="py-2 px-3 text-right">NORMALIZED_AVG</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={6} className="py-10">
                    <EmptyState
                      icon={<BarChart2 className="w-5 h-5 text-[#06b6d4]" />}
                      title="No local benchmark runs executed in current workspace"
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
        title="Benchmark Runner Gate [501]"
        subtitle="Automated batch benchmarking activates in Phase 3."
      >
        <div className="space-y-3 text-xs font-mono text-[#D9DEE2]">
          <p className="leading-relaxed font-sans text-[#929BA3]">
            The benchmark specifications and scoring schemas are defined. Live multi-threaded test execution will activate in Phase 3.
          </p>
          <div className="p-3 rounded-sm bg-[#101214] border border-[#35393D] text-[11px] space-y-1">
            <div className="text-[#687179]">// Inactivity Guard Status</div>
            <div>
              POST /api/v1/modules/benchmarks/execute →{' '}
              <span className="text-[#f59e0b] font-semibold">501 Not Implemented</span>
            </div>
            <div>Phase Target: Phase 3 (Benchmark & Dataset Engine)</div>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
};
