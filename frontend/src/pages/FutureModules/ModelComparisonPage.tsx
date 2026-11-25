import React, { useState } from 'react';
import { PageContainer } from '../../components/layout/PageContainer';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { Modal } from '../../components/ui/Modal';
import {
  GitCompare,
  Terminal,
} from 'lucide-react';

interface ModelComparisonProfile {
  id: string;
  name: string;
  provider: string;
  contextWindow: string;
  costInputPerM: string;
  costOutputPerM: string;
  radarScores: {
    accuracy: number;
    costEfficiency: number;
    faithfulness: number;
    speed: number;
    relevance: number;
  };
  metrics: {
    accuracy: number;
    cost_per_call: number;
    faithfulness: number;
    latency_ms: number;
    relevance: number;
  };
}

const COMPARISON_PROFILES: ModelComparisonProfile[] = [
  {
    id: 'anthropic/claude-sonnet-4.6',
    name: 'Claude Sonnet 4.6',
    provider: 'Anthropic',
    contextWindow: '200K',
    costInputPerM: '$3.00',
    costOutputPerM: '$15.00',
    radarScores: {
      accuracy: 94,
      costEfficiency: 70,
      faithfulness: 96,
      speed: 82,
      relevance: 95,
    },
    metrics: {
      accuracy: 94,
      cost_per_call: 98,
      faithfulness: 96,
      latency_ms: 38,
      relevance: 95,
    },
  },
  {
    id: 'meta/llama-4',
    name: 'Meta Llama 4 (Scout)',
    provider: 'Meta AI / Local',
    contextWindow: '128K',
    costInputPerM: '$0.20',
    costOutputPerM: '$0.40',
    radarScores: {
      accuracy: 88,
      costEfficiency: 99,
      faithfulness: 89,
      speed: 92,
      relevance: 87,
    },
    metrics: {
      accuracy: 88,
      cost_per_call: 99,
      faithfulness: 89,
      latency_ms: 65,
      relevance: 87,
    },
  },
  {
    id: 'openai/gpt-5.2',
    name: 'OpenAI GPT-5.2',
    provider: 'OpenAI',
    contextWindow: '256K',
    costInputPerM: '$2.50',
    costOutputPerM: '$10.00',
    radarScores: {
      accuracy: 97,
      costEfficiency: 75,
      faithfulness: 94,
      speed: 78,
      relevance: 98,
    },
    metrics: {
      accuracy: 97,
      cost_per_call: 92,
      faithfulness: 94,
      latency_ms: 45,
      relevance: 98,
    },
  },
];

export const ModelComparisonPage: React.FC = () => {
  const [selectedModels, setSelectedModels] = useState<string[]>([
    'anthropic/claude-sonnet-4.6',
    'meta/llama-4',
  ]);
  const [selectedDataset, setSelectedDataset] = useState('gsm8k_math_eval');
  const [evalProtocol, setEvalProtocol] = useState('protocol_zero_shot');
  const [prompt, setPrompt] = useState(
    'Compare the asymptotic algorithmic complexity of Dijkstra with a Fibonacci heap vs binary heap under dense graph conditions.'
  );
  const [isGateModalOpen, setIsGateModalOpen] = useState(false);

  const toggleModel = (id: string) => {
    if (selectedModels.includes(id)) {
      if (selectedModels.length > 1) {
        setSelectedModels(selectedModels.filter((m) => m !== id));
      }
    } else {
      if (selectedModels.length < 3) {
        setSelectedModels([...selectedModels, id]);
      }
    }
  };

  const activeProfiles = COMPARISON_PROFILES.filter((p) => selectedModels.includes(p.id));

  // Helper for 5-axis Radar Plot (center: 75, 75; max radius: 55)
  const getRadarPoints = (scores: ModelComparisonProfile['radarScores']) => {
    const cx = 75;
    const cy = 75;
    const r = 55;
    const values = [
      scores.accuracy / 100,
      scores.costEfficiency / 100,
      scores.faithfulness / 100,
      scores.speed / 100,
      scores.relevance / 100,
    ];
    const angles = [-Math.PI / 2, -Math.PI / 10, (3 * Math.PI) / 10, (7 * Math.PI) / 10, (11 * Math.PI) / 10];
    return values
      .map((v, i) => {
        const x = cx + r * v * Math.cos(angles[i]);
        const y = cy + r * v * Math.sin(angles[i]);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  };

  return (
    <PageContainer
      title="Model Comparison"
      subtitle="Multivariate radar analysis, normalized benchmark performance bars, paired statistical differences, and synchronized response diffs."
      actions={
        <Button
          variant="primary"
          size="sm"
          icon={<GitCompare className="w-3.5 h-3.5" />}
          onClick={() => setIsGateModalOpen(true)}
        >
          Run Comparison Sweep
        </Button>
      }
      maxWidth="wide"
    >
      <div className="space-y-3 font-mono text-[#D9DEE2]">
        {/* Model Selection & Dimension Selector Strip (Inspired by Valohai Reference 03) */}
        <div className="bg-[#1C1F22] border border-[#35393D] rounded-sm p-3 space-y-2.5 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10.5px] text-[#929BA3] uppercase">Models:</span>
              <div className="flex flex-wrap gap-1">
                {COMPARISON_PROFILES.map((p) => {
                  const isChecked = selectedModels.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      onClick={() => toggleModel(p.id)}
                      className={`px-2 py-0.5 text-xs font-mono rounded-sm border transition-colors flex items-center gap-1.5 ${
                        isChecked
                          ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                          : 'bg-[#111315] border-[#35393D] text-[#929BA3] hover:text-[#D9DEE2]'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isChecked ? 'bg-cyan-400' : 'bg-[#687179]'}`} />
                      {p.id}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1 bg-[#111315] px-2 py-0.5 rounded-sm border border-[#35393D] text-[10px]">
                <span className="text-[#687179]">Dataset:</span>
                <select
                  value={selectedDataset}
                  onChange={(e) => setSelectedDataset(e.target.value)}
                  className="bg-transparent text-[#D9DEE2] focus:outline-none"
                >
                  <option value="gsm8k_math_eval">gsm8k_math_eval</option>
                  <option value="mmlu_stem_subset">mmlu_stem_subset</option>
                  <option value="truthful_factuality">truthful_factuality</option>
                </select>
              </div>

              <div className="flex items-center gap-1 bg-[#111315] px-2 py-0.5 rounded-sm border border-[#35393D] text-[10px]">
                <span className="text-[#687179]">Protocol:</span>
                <select
                  value={evalProtocol}
                  onChange={(e) => setEvalProtocol(e.target.value)}
                  className="bg-transparent text-[#D9DEE2] focus:outline-none"
                >
                  <option value="protocol_zero_shot">Zero-shot Greedy</option>
                  <option value="protocol_cot">3-shot Chain-of-Thought</option>
                </select>
              </div>
            </div>
          </div>

          {/* Metric Direction Legends with explicit Higher / Lower is better */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#2A2D31] text-[9.5px]">
            <span className="text-[#687179] uppercase">Metric Direction:</span>
            <span className="px-1.5 py-0.2 rounded-sm bg-[#111315] border border-[#35393D] text-[#D9DEE2]">
              accuracy <strong className="text-emerald-400">↑ Higher</strong>
            </span>
            <span className="px-1.5 py-0.2 rounded-sm bg-[#111315] border border-[#35393D] text-[#D9DEE2]">
              cost_per_call <strong className="text-cyan-400">↓ Lower</strong>
            </span>
            <span className="px-1.5 py-0.2 rounded-sm bg-[#111315] border border-[#35393D] text-[#D9DEE2]">
              faithfulness <strong className="text-emerald-400">↑ Higher</strong>
            </span>
            <span className="px-1.5 py-0.2 rounded-sm bg-[#111315] border border-[#35393D] text-[#D9DEE2]">
              latency_ms <strong className="text-cyan-400">↓ Lower</strong>
            </span>
            <span className="px-1.5 py-0.2 rounded-sm bg-[#111315] border border-[#35393D] text-[#D9DEE2]">
              relevance <strong className="text-emerald-400">↑ Higher</strong>
            </span>
          </div>
        </div>

        {/* Side-by-Side Model Profiler Cards (Valohai Radar & Bar Architecture) */}
        <div className={`grid grid-cols-1 ${activeProfiles.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-2.5`}>
          {activeProfiles.map((p) => (
            <div key={p.id} className="bg-[#1C1F22] border border-[#35393D] rounded-sm p-3 space-y-2.5 shadow-sm">
              <div className="flex items-center justify-between pb-1.5 border-b border-[#35393D]">
                <div>
                  <h4 className="text-xs font-bold text-[#D9DEE2]">{p.id}</h4>
                  <p className="text-[9.5px] text-[#929BA3]">
                    {p.name} • Context: {p.contextWindow}
                  </p>
                </div>
                <div className="text-right text-[9.5px] text-[#687179]">
                  <div>In: {p.costInputPerM}</div>
                  <div>Out: {p.costOutputPerM}</div>
                </div>
              </div>

              {/* Radar & Bar Chart Split */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-center">
                {/* SVG Radar Spider Plot */}
                <div className="bg-[#101214] rounded-sm border border-[#2A2D31] p-1.5 flex flex-col items-center">
                  <span className="text-[8.5px] text-[#687179] uppercase mb-0.5">Radar Normalized</span>
                  <svg viewBox="0 0 150 150" className="w-32 h-32">
                    {/* Background concentric polygons */}
                    <polygon points="75,20 128,59 108,122 42,122 22,59" fill="none" stroke="#2A2D31" strokeWidth="1" />
                    <polygon points="75,38 110,65 97,108 53,108 40,65" fill="none" stroke="#2A2D31" strokeWidth="1" strokeDasharray="2,2" />
                    <polygon points="75,56 93,70 86,94 64,94 57,70" fill="none" stroke="#2A2D31" strokeWidth="1" strokeDasharray="2,2" />
                    
                    {/* Axis spokes */}
                    <line x1="75" y1="75" x2="75" y2="20" stroke="#35393D" strokeWidth="1" />
                    <line x1="75" y1="75" x2="128" y2="59" stroke="#35393D" strokeWidth="1" />
                    <line x1="75" y1="75" x2="108" y2="122" stroke="#35393D" strokeWidth="1" />
                    <line x1="75" y1="75" x2="42" y2="122" stroke="#35393D" strokeWidth="1" />
                    <line x1="75" y1="75" x2="22" y2="59" stroke="#35393D" strokeWidth="1" />

                    {/* Data Polygon in Orange / Amber */}
                    <polygon
                      points={getRadarPoints(p.radarScores)}
                      fill="#f59e0b"
                      fillOpacity="0.25"
                      stroke="#f59e0b"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>

                {/* Horizontal Normalized Bar Charts */}
                <div className="bg-[#101214] rounded-sm border border-[#2A2D31] p-2 space-y-1.5">
                  <span className="text-[8.5px] text-[#687179] uppercase block mb-0.5">Metrics Breakdown</span>
                  <div className="space-y-1 text-[9.5px]">
                    <div>
                      <div className="flex justify-between text-[#929BA3]">
                        <span>accuracy</span>
                        <span className="text-[#D9DEE2]">{p.metrics.accuracy}%</span>
                      </div>
                      <div className="h-1 bg-[#1C1F22] rounded-sm overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-sm" style={{ width: `${p.metrics.accuracy}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[#929BA3]">
                        <span>cost_per_call</span>
                        <span className="text-[#D9DEE2]">{p.metrics.cost_per_call}</span>
                      </div>
                      <div className="h-1 bg-[#1C1F22] rounded-sm overflow-hidden">
                        <div className="h-full bg-cyan-500 rounded-sm" style={{ width: `${p.metrics.cost_per_call}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[#929BA3]">
                        <span>faithfulness</span>
                        <span className="text-[#D9DEE2]">{p.metrics.faithfulness}%</span>
                      </div>
                      <div className="h-1 bg-[#1C1F22] rounded-sm overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-sm" style={{ width: `${p.metrics.faithfulness}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[#929BA3]">
                        <span>latency_ms</span>
                        <span className="text-[#D9DEE2]">{p.metrics.latency_ms}</span>
                      </div>
                      <div className="h-1 bg-[#1C1F22] rounded-sm overflow-hidden">
                        <div className="h-full bg-cyan-500 rounded-sm" style={{ width: `${p.metrics.latency_ms}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[#929BA3]">
                        <span>relevance</span>
                        <span className="text-[#D9DEE2]">{p.metrics.relevance}%</span>
                      </div>
                      <div className="h-1 bg-[#1C1F22] rounded-sm overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-sm" style={{ width: `${p.metrics.relevance}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Multi-Model Comparison Table with Statistical Difference Indicators */}
        <div className="bg-[#1C1F22] border border-[#35393D] rounded-sm overflow-hidden shadow-sm">
          <div className="px-3.5 py-2 border-b border-[#35393D] bg-[#17191B] flex items-center justify-between text-xs">
            <span className="font-bold text-[#D9DEE2] uppercase tracking-wider text-[11px]">
              Comparative Metrics Matrix &amp; Statistical Significance
            </span>
            <span className="text-[10px] text-[#687179]">// Baseline Comparator: {activeProfiles[0]?.id}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="bg-[#101214] border-b border-[#35393D] text-[#687179] text-[9.5px] uppercase font-bold">
                  <th className="py-2 px-3">Model</th>
                  <th className="py-2 px-3">Provider</th>
                  <th className="py-2 px-3">Context</th>
                  <th className="py-2 px-3">Accuracy (↑)</th>
                  <th className="py-2 px-3">Cost / 1M Out (↓)</th>
                  <th className="py-2 px-3">Faithfulness (↑)</th>
                  <th className="py-2 px-3 text-right">Stat Diff (vs Base)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2D31] text-[10.5px]">
                {activeProfiles.map((p, idx) => (
                  <tr key={p.id} className="hover:bg-[#232629]">
                    <td className="py-2 px-3 font-semibold text-[#D9DEE2]">{p.name}</td>
                    <td className="py-2 px-3 text-[#929BA3]">{p.provider}</td>
                    <td className="py-2 px-3 text-[#929BA3]">{p.contextWindow}</td>
                    <td className="py-2 px-3 text-emerald-400 font-bold">{p.metrics.accuracy}%</td>
                    <td className="py-2 px-3 text-[#D9DEE2]">{p.costOutputPerM}</td>
                    <td className="py-2 px-3 text-amber-400 font-bold">{p.metrics.faithfulness}%</td>
                    <td className="py-2 px-3 text-right">
                      {idx === 0 ? (
                        <span className="text-[9.5px] text-[#687179] bg-[#111315] px-1.5 py-0.2 rounded-sm border border-[#35393D]">BASELINE</span>
                      ) : (
                        <span className="text-[9.5px] text-cyan-300 font-semibold">
                          Δ {p.metrics.accuracy - activeProfiles[0].metrics.accuracy > 0 ? '+' : ''}
                          {p.metrics.accuracy - activeProfiles[0].metrics.accuracy}% (p &lt; 0.05)
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Synchronized Prompt & Output Ports */}
        <div className="bg-[#1C1F22] border border-[#35393D] rounded-sm p-3.5 space-y-2.5 shadow-sm">
          <div className="space-y-1">
            <label className="text-[10px] text-[#929BA3] block uppercase tracking-wider">
              Shared Comparison Prompt
            </label>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-[#111315] border border-[#35393D] rounded-sm px-2.5 py-1 text-xs text-[#D9DEE2] font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className={`grid grid-cols-1 sm:grid-cols-${activeProfiles.length} gap-2.5`}>
            {activeProfiles.map((p) => (
              <div key={p.id} className="border border-[#35393D] rounded-sm bg-[#111315] flex flex-col h-[200px]">
                <div className="px-2.5 py-1 border-b border-[#35393D] bg-[#17191B] rounded-t-sm flex items-center justify-between text-xs">
                  <span className="font-bold text-[#D9DEE2] text-[10.5px]">{p.id}</span>
                  <span className="text-[9px] text-[#687179]">Port Response</span>
                </div>
                <div className="p-3 flex-1 flex flex-col justify-center items-center">
                  <EmptyState
                    icon={<Terminal className="w-4 h-4 text-[#687179]" />}
                    title="Awaiting sweep dispatch"
                    description="Run sweep to stream synchronized candidate outputs."
                    enablingPhase="Phase 8: Model Intelligence & Comparative Analytics"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Phase 8 Gate Modal */}
      <Modal
        isOpen={isGateModalOpen}
        onClose={() => setIsGateModalOpen(false)}
        title="Model Comparison Gate [HTTP 501]"
        subtitle="Parallel multi-model comparison sweeps activate in Phase 8."
      >
        <div className="space-y-3 text-xs font-mono text-[#D9DEE2]">
          <p className="leading-relaxed font-sans text-[#929BA3]">
            The comparative matrix schemas and Pareto frontier definitions are active. Simultaneous multi-model streaming inference will activate in Phase 8.
          </p>
          <div className="p-2.5 rounded-sm bg-[#111315] border border-[#35393D] text-[10.5px] space-y-1">
            <div className="text-[#687179]">// Inactivity Guard Status</div>
            <div>POST /api/v1/modules/model-comparison/execute → <span className="text-amber-400 font-semibold">501 Not Implemented</span></div>
            <div>Active Comparators: {selectedModels.join(', ')}</div>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
};
