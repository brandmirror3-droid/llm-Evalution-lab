import React, { useState } from 'react';
import { PageContainer } from '../../components/layout/PageContainer';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import {
  Search,
  Plus,
  Calendar,
  Filter,
  FileText,
} from 'lucide-react';

interface ExperimentRun {
  id: string;
  name: string;
  runId: string;
  status: 'Completed' | 'Pending';
  created: string;
  dataset: string;
  events: number;
  faithfulness: string;
  precision: string;
  charCount: string;
  hypothesis: string;
  model: string;
  promptVersion: string;
}

const EXPERIMENT_RUNS: ExperimentRun[] = [
  {
    id: 'exp-1',
    name: 'Multi-Agent System Eval',
    runId: 'ded609e9-3ca6-40fc-b488-8cf9b3a510f2',
    status: 'Pending',
    created: 'Jul 22, 2025 10:54:29 AM',
    dataset: 'EXT-a213cc03750dba93',
    events: 0,
    faithfulness: '-',
    precision: '-',
    charCount: '-',
    hypothesis: 'Evaluating coordination overhead across decentralized multi-agent supervisor loops.',
    model: 'gpt-4o',
    promptVersion: 'agent_supervisor_v2',
  },
  {
    id: 'exp-2',
    name: 'Concurrent Span Dropping Filter',
    runId: 'fe80c57b-a23e-4a15-a8a9-450fbe7a419c',
    status: 'Completed',
    created: 'Jul 22, 2025 6:23:07 AM',
    dataset: 'EXT-868743340cc0059b',
    events: 25,
    faithfulness: '0.94',
    precision: '0.91',
    charCount: '1,420',
    hypothesis: 'Dropping redundant contextual spans reduces retrieval hallucination by 15%.',
    model: 'claude-3-5-sonnet',
    promptVersion: 'span_compression_v1',
  },
  {
    id: 'exp-3',
    name: 'Concurrent Span Dropping Filter',
    runId: 'f808247d-ebab-458b-91c6-2178e24483ca',
    status: 'Pending',
    created: 'Jul 22, 2025 6:21:59 AM',
    dataset: 'EXT-868743340cc0059b',
    events: 0,
    faithfulness: '-',
    precision: '-',
    charCount: '-',
    hypothesis: 'Evaluation of span boundary thresholds under noisy OCR inputs.',
    model: 'gpt-4o',
    promptVersion: 'span_compression_v1',
  },
  {
    id: 'exp-4',
    name: 'Concurrent Span Dropping Filter',
    runId: '21501a4d-2eb7-4325-b6fb-c918347f2b1a',
    status: 'Pending',
    created: 'Jul 22, 2025 6:20:16 AM',
    dataset: 'EXT-868743340cc0059b',
    events: 0,
    faithfulness: '-',
    precision: '-',
    charCount: '-',
    hypothesis: 'Span drop ablation on multi-turn dialogue memory.',
    model: 'gemini-1-5-pro',
    promptVersion: 'span_ablation_v3',
  },
  {
    id: 'exp-5',
    name: 'Concurrent Span Dropping Filter',
    runId: '10416ac8-d3e0-43fe-9851-3fa421980ca5',
    status: 'Pending',
    created: 'Jul 22, 2025 6:08:11 AM',
    dataset: 'EXT-868743340cc0059b',
    events: 0,
    faithfulness: '-',
    precision: '-',
    charCount: '-',
    hypothesis: 'Baseline verification against full context window retention.',
    model: 'gpt-4o',
    promptVersion: 'full_context_base',
  },
  {
    id: 'exp-6',
    name: 'Multi-Agent System Eval',
    runId: '6b6d57bb-63bb-4096-bc9b-325cf1889a71',
    status: 'Pending',
    created: 'Jul 21, 2025 5:08:53 PM',
    dataset: 'EXT-a213cc03750dba93',
    events: 0,
    faithfulness: '-',
    precision: '-',
    charCount: '-',
    hypothesis: 'Agent consensus protocol testing on arithmetic reasoning tasks.',
    model: 'claude-3-5-sonnet',
    promptVersion: 'consensus_v1',
  },
  {
    id: 'exp-7',
    name: 'Multi-Agent System Eval',
    runId: '8e773da5-5383-44c0-844c-cb1477488812',
    status: 'Completed',
    created: 'Jul 21, 2025 4:59:52 PM',
    dataset: 'EXT-a213cc03750dba93',
    events: 5,
    faithfulness: '0.88',
    precision: '0.86',
    charCount: '980',
    hypothesis: 'Consensus voting over 3 stochastic candidate completions.',
    model: 'gpt-4o',
    promptVersion: 'consensus_v1',
  },
  {
    id: 'exp-8',
    name: 'Sample Experiment 2 (Ablation)',
    runId: '25301b3d-5773-4b14-affb-e8549887711a',
    status: 'Completed',
    created: 'May 21, 2025 9:37:29 PM',
    dataset: 'EXT-91e60f5e7d8ecd4a',
    events: 2,
    faithfulness: '0.96',
    precision: '0.94',
    charCount: '1,840',
    hypothesis: 'Long-form reasoning verification against mathematical proofs.',
    model: 'gpt-4o',
    promptVersion: 'proof_eval_strict',
  },
];

export const ExperimentsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('12m');
  const [datasetFilter, setDatasetFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRun, setSelectedRun] = useState<ExperimentRun | null>(EXPERIMENT_RUNS[1]);
  const [isGateModalOpen, setIsGateModalOpen] = useState(false);

  const filteredRuns = EXPERIMENT_RUNS.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.runId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.dataset.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageContainer
      title="Experiments"
      subtitle="Track prompt iterations, metric divergence curves, and multi-run evaluation histories."
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => setIsGateModalOpen(true)}
          >
            Create Experiment
          </Button>
        </div>
      }
      maxWidth="wide"
    >
      <div className="space-y-3 font-mono text-[#D9DEE2]">
        {/* HoneyHive Toolbar Header: Dataset selector + Range pill selectors (Direct match to Reference 04 Image 2) */}
        <div className="bg-[#1C1F22] border border-[#35393D] rounded-sm p-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-[#111315] px-2 py-1 rounded-sm border border-[#35393D] text-xs">
              <span className="text-[#687179]">Dataset:</span>
              <select
                value={datasetFilter}
                onChange={(e) => setDatasetFilter(e.target.value)}
                className="bg-transparent text-[#D9DEE2] font-semibold focus:outline-none cursor-pointer"
              >
                <option value="all">All datasets</option>
                <option value="EXT-a213">EXT-a213cc03...</option>
                <option value="EXT-8687">EXT-86874334...</option>
                <option value="EXT-91e6">EXT-91e60f5e...</option>
              </select>
            </div>

            <button className="flex items-center gap-1 px-2 py-1 bg-[#111315] hover:bg-[#232629] text-[#929BA3] hover:text-[#D9DEE2] rounded-sm border border-[#35393D] text-xs transition-colors">
              <Filter className="w-3 h-3 text-[#687179]" />
              <span>Filter</span>
            </button>
          </div>

          {/* Time range selector pills */}
          <div className="flex items-center gap-1 bg-[#111315] p-0.5 rounded-sm border border-[#35393D] text-[10px]">
            {['1d', '7d', '30d', '3m', '6m', '12m', 'All Time'].map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-2 py-0.5 rounded-sm transition-colors ${
                  timeRange === r
                    ? 'bg-[#232629] text-[#D9DEE2] font-bold border border-[#35393D]'
                    : 'text-[#687179] hover:text-[#929BA3]'
                }`}
              >
                {r}
              </button>
            ))}
            <div className="p-1 text-[#687179]">
              <Calendar className="w-3 h-3" />
            </div>
          </div>
        </div>

        {/* HoneyHive Analytical Line Graph: Metrics Across Experiments: % Difference */}
        <div className="bg-[#1C1F22] border border-[#35393D] rounded-sm p-3.5 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2 pb-1 border-b border-[#2A2D31]">
            <span className="font-bold text-[#D9DEE2] uppercase tracking-wider text-[11px]">
              Metrics Across Experiments: % Difference
            </span>
            <div className="flex flex-wrap items-center gap-3 text-[10px] text-[#929BA3]">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                mrr_at_k (0.0-0.5)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                ndcg_at_k (0.0-0.4)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                precision_at_k (0.0-0.3)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-orange-500" />
                recall_at_k (0.0-0.5)
              </span>
            </div>
          </div>

          {/* SVG Multi-curve line chart */}
          <div className="h-44 w-full bg-[#101214] border border-[#2A2D31] rounded-sm p-2 flex items-center justify-center">
            <svg viewBox="0 0 680 150" className="w-full h-full">
              {/* Horizontal grid lines */}
              <line x1="35" y1="15" x2="670" y2="15" stroke="#232629" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="35" y1="45" x2="670" y2="45" stroke="#232629" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="35" y1="75" x2="670" y2="75" stroke="#232629" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="35" y1="105" x2="670" y2="105" stroke="#232629" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="35" y1="130" x2="670" y2="130" stroke="#35393D" strokeWidth="1" />

              {/* Y Axis percentage labels */}
              <text x="30" y="20" textAnchor="end" fontSize="8" fill="#687179" fontFamily="monospace">100%</text>
              <text x="30" y="50" textAnchor="end" fontSize="8" fill="#687179" fontFamily="monospace">75%</text>
              <text x="30" y="80" textAnchor="end" fontSize="8" fill="#687179" fontFamily="monospace">50%</text>
              <text x="30" y="110" textAnchor="end" fontSize="8" fill="#687179" fontFamily="monospace">25%</text>
              <text x="30" y="133" textAnchor="end" fontSize="8" fill="#687179" fontFamily="monospace">0%</text>

              {/* Curve 1: mrr_at_k (Amber) */}
              <path
                d="M 50 100 Q 110 80 170 85 T 260 25 T 350 70 T 440 25 L 480 130 L 530 130 Q 560 50 590 50 T 660 90"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="1.8"
              />

              {/* Curve 2: ndcg_at_k (Cyan) */}
              <path
                d="M 50 110 Q 110 95 170 90 T 260 30 T 350 85 T 440 20 L 480 130 L 530 130 Q 560 65 590 65 T 660 100"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="1.8"
              />

              {/* Curve 3: precision_at_k (Emerald) */}
              <path
                d="M 50 95 Q 110 60 170 70 T 260 18 T 350 95 T 440 35 L 480 130 L 530 130 Q 560 70 590 70 T 660 110"
                fill="none"
                stroke="#10b981"
                strokeWidth="1.8"
              />

              {/* Curve 4: recall_at_k (Orange) */}
              <path
                d="M 50 85 Q 110 105 170 80 T 260 40 T 350 80 T 440 30 L 480 130 L 530 130 Q 560 40 590 40 T 660 85"
                fill="none"
                stroke="#ea580c"
                strokeWidth="1.8"
              />

              {/* X Axis ticks 20 down to 1 */}
              {[20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((n, idx) => (
                <text
                  key={n}
                  x={50 + idx * 32}
                  y="142"
                  textAnchor="middle"
                  fontSize="7.5"
                  fill="#687179"
                  fontFamily="monospace"
                >
                  {n}
                </text>
              ))}
            </svg>
          </div>
        </div>

        {/* HoneyHive Experiments Run Table (Direct match to Reference 04 Image 2) */}
        <div className="bg-[#1C1F22] border border-[#35393D] rounded-sm overflow-hidden shadow-sm">
          <div className="px-3.5 py-2 border-b border-[#35393D] bg-[#17191B] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#D9DEE2] text-xs">Experiments (233)</span>
              <span className="text-[10px] text-[#687179]">// Click any run to inspect parameters</span>
            </div>

            <div className="relative">
              <Search className="w-3 h-3 text-[#687179] absolute left-2 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter runs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#111315] border border-[#35393D] rounded-sm pl-7 pr-2 py-0.5 text-[10px] text-[#D9DEE2] placeholder-[#687179] focus:outline-none focus:border-cyan-500 w-44"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="bg-[#101214] border-b border-[#35393D] text-[#687179] text-[9.5px] uppercase font-bold tracking-wider">
                  <th className="py-2 px-3">NAME</th>
                  <th className="py-2 px-3">RUN ID</th>
                  <th className="py-2 px-3">STATUS</th>
                  <th className="py-2 px-3">CREATED</th>
                  <th className="py-2 px-3">DATASET</th>
                  <th className="py-2 px-3">EVENTS</th>
                  <th className="py-2 px-3 text-right">FAITHFULNESS</th>
                  <th className="py-2 px-3 text-right">PRECISION</th>
                  <th className="py-2 px-3 text-right">CHAR-COUNT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2D31] text-[10.5px]">
                {filteredRuns.map((run) => {
                  const isSelected = selectedRun?.id === run.id;
                  return (
                    <tr
                      key={run.id}
                      onClick={() => setSelectedRun(run)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-cyan-500/10 text-cyan-200'
                          : 'hover:bg-[#232629] text-[#929BA3]'
                      }`}
                    >
                      <td className="py-2 px-3 font-semibold text-[#D9DEE2] max-w-[180px] truncate">
                        {run.name}
                      </td>
                      <td className="py-2 px-3 text-cyan-400 font-mono text-[10px]">
                        {run.runId.substring(0, 16)}...
                      </td>
                      <td className="py-2 px-3">
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded-sm font-semibold border ${
                            run.status === 'Completed'
                              ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/60'
                              : 'bg-amber-950/40 text-amber-400 border-amber-800/60'
                          }`}
                        >
                          {run.status}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-[#687179] text-[10px] whitespace-nowrap">
                        {run.created}
                      </td>
                      <td className="py-2 px-3 text-[#929BA3] text-[10px]">
                        {run.dataset}
                      </td>
                      <td className="py-2 px-3 text-[#D9DEE2]">{run.events}</td>
                      <td className="py-2 px-3 text-right text-[#D9DEE2]">{run.faithfulness}</td>
                      <td className="py-2 px-3 text-right text-[#D9DEE2]">{run.precision}</td>
                      <td className="py-2 px-3 text-right text-[#D9DEE2]">{run.charCount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="px-3.5 py-1.5 border-t border-[#35393D] bg-[#17191B] flex items-center justify-between text-[10px] text-[#687179]">
            <span>Showing 1 to {filteredRuns.length} of 233 results</span>
            <div className="flex items-center gap-1">
              <span>Rows: 20</span>
              <span className="text-[#35393D]">|</span>
              <span className="text-[#D9DEE2]">Page 1 of 12</span>
            </div>
          </div>
        </div>

        {/* Selected Experiment Detail Workspace / Inspector */}
        {selectedRun && (
          <div className="p-3.5 bg-[#1C1F22] border border-[#35393D] rounded-sm space-y-2 text-xs">
            <div className="flex items-center justify-between pb-1.5 border-b border-[#35393D]">
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-bold text-[#D9DEE2] uppercase tracking-wider text-[11px]">
                  EXPERIMENT DETAIL INSPECTOR: {selectedRun.name}
                </span>
              </div>
              <span className="text-[10px] text-cyan-400 font-mono">RUN: {selectedRun.runId}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-[11px]">
              <div className="p-2.5 bg-[#111315] rounded-sm border border-[#35393D] space-y-1">
                <span className="text-[#687179] block text-[9.5px] uppercase">Hypothesis</span>
                <p className="text-[#D9DEE2] leading-snug">{selectedRun.hypothesis}</p>
              </div>

              <div className="p-2.5 bg-[#111315] rounded-sm border border-[#35393D] space-y-1">
                <span className="text-[#687179] block text-[9.5px] uppercase">Model & Prompt</span>
                <div className="text-[#D9DEE2]">Target: <span className="font-bold text-cyan-300">{selectedRun.model}</span></div>
                <div className="text-[#929BA3]">Version: {selectedRun.promptVersion}</div>
              </div>

              <div className="p-2.5 bg-[#111315] rounded-sm border border-[#35393D] space-y-1">
                <span className="text-[#687179] block text-[9.5px] uppercase">Evaluation Protocol</span>
                <div className="text-[#D9DEE2]">Dataset: {selectedRun.dataset}</div>
                <div className="text-emerald-400 font-semibold">Status: {selectedRun.status} (Verified)</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Phase 2 Gate Modal */}
      <Modal
        isOpen={isGateModalOpen}
        onClose={() => setIsGateModalOpen(false)}
        title="Create Experiment Run Gate [501]"
        subtitle="Experiment execution engine will activate in Phase 2."
      >
        <div className="space-y-3 text-xs font-mono text-[#D9DEE2]">
          <p className="leading-relaxed font-sans text-[#929BA3]">
            The experiment database schema and workspace tracking architecture are active. Live execution against foundation models will be enabled in Phase 2.
          </p>
          <div className="p-2.5 rounded-sm bg-[#111315] border border-[#35393D] text-[10.5px] space-y-1">
            <div className="text-[#687179]">// Inactivity Gate Response</div>
            <div>
              POST /api/v1/modules/experiments/execute →{' '}
              <span className="text-amber-400 font-semibold">501 Not Implemented</span>
            </div>
            <div>Phase Target: Phase 2 (Model Playground & Integration)</div>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
};
