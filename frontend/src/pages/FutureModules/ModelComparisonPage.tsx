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
    accuracy: number; // 0..100
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

  // Helper to compute SVG polygon points for radar chart (center: 80, 80; max radius: 60)
  const getRadarPoints = (scores: ModelComparisonProfile['radarScores']) => {
    const cx = 80;
    const cy = 80;
    const r = 60;
    const values = [
      scores.accuracy / 100,
      scores.costEfficiency / 100,
      scores.faithfulness / 100,
      scores.speed / 100,
      scores.relevance / 100,
    ];
    // 5 angles: -90, -18, 54, 126, 198 degrees
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
      subtitle="Multivariate radar analysis, normalized benchmark performance bars, and synchronized prompt response diffs."
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
      <div className="space-y-4">
        {/* Model Selection & Metric Direction Strip (Directly inspired by Valohai Image 3) */}
        <div className="bg-[#0c111a] border border-[#1e293b] rounded-lg p-4 space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-slate-400">Models:</span>
              <div className="flex flex-wrap gap-1.5">
                {COMPARISON_PROFILES.map((p) => {
                  const isChecked = selectedModels.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      onClick={() => toggleModel(p.id)}
                      className={`px-2.5 py-1 text-xs font-mono rounded border transition-colors flex items-center gap-1.5 ${
                        isChecked
                          ? 'bg-sky-500/20 border-sky-500/60 text-sky-300'
                          : 'bg-[#101622] border-[#1e293b] text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isChecked ? 'bg-sky-400' : 'bg-slate-600'}`} />
                      {p.id}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-slate-500">Facet: model</span>
              <span className="text-[10px] font-mono text-slate-500 bg-[#101622] px-2 py-0.5 rounded border border-[#1e293b]">
                Normalized [0..100]
              </span>
            </div>
          </div>

          {/* Metric Direction Legends (Exact Valohai Reference) */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#1e293b] text-[10px] font-mono">
            <span className="text-slate-500">Metric direction:</span>
            <span className="px-2 py-0.5 rounded bg-[#101622] border border-[#1e293b] text-slate-300">
              accuracy ↑
            </span>
            <span className="px-2 py-0.5 rounded bg-[#101622] border border-[#1e293b] text-slate-300">
              cost_per_call ↓
            </span>
            <span className="px-2 py-0.5 rounded bg-[#101622] border border-[#1e293b] text-slate-300">
              faithfulness ↑
            </span>
            <span className="px-2 py-0.5 rounded bg-[#101622] border border-[#1e293b] text-slate-300">
              latency_ms ↓
            </span>
            <span className="px-2 py-0.5 rounded bg-[#101622] border border-[#1e293b] text-slate-300">
              relevance ↑
            </span>
            <span className="text-slate-500 text-[9px] ml-auto">
              (↑ higher is better, ↓ lower is better)
            </span>
          </div>
        </div>

        {/* Side-by-Side Model Profiler Cards (Valohai Radar & Horizontal Bar Structure) */}
        <div className={`grid grid-cols-1 ${activeProfiles.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-4`}>
          {activeProfiles.map((p) => (
            <div key={p.id} className="bg-[#0c111a] border border-[#1e293b] rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#1e293b]">
                <div>
                  <h4 className="text-xs font-semibold text-slate-200 font-mono">{p.id}</h4>
                  <p className="text-[10px] text-slate-400 font-mono">
                    {p.name} • Context: {p.contextWindow}
                  </p>
                </div>
                <div className="text-right font-mono text-[10px] text-slate-400">
                  <div>In: {p.costInputPerM}</div>
                  <div>Out: {p.costOutputPerM}</div>
                </div>
              </div>

              {/* Radar & Bar Chart Split */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                {/* SVG Radar Plot */}
                <div className="bg-[#101622] rounded border border-[#1e293b] p-2 flex flex-col items-center">
                  <span className="text-[9px] font-mono text-slate-400 mb-1">Radar (normalized)</span>
                  <svg viewBox="0 0 160 160" className="w-36 h-36">
                    {/* Background concentric polygons */}
                    <polygon points="80,20 137,61 115,128 45,128 23,61" fill="none" stroke="#1e293b" strokeWidth="1" />
                    <polygon points="80,40 118,67 103,112 57,112 42,67" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="2,2" />
                    <polygon points="80,60 99,74 92,96 68,96 61,74" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="2,2" />
                    {/* Axis spokes */}
                    <line x1="80" y1="80" x2="80" y2="20" stroke="#1e293b" strokeWidth="1" />
                    <line x1="80" y1="80" x2="137" y2="61" stroke="#1e293b" strokeWidth="1" />
                    <line x1="80" y1="80" x2="115" y2="128" stroke="#1e293b" strokeWidth="1" />
                    <line x1="80" y1="80" x2="45" y2="128" stroke="#1e293b" strokeWidth="1" />
                    <line x1="80" y1="80" x2="23" y2="61" stroke="#1e293b" strokeWidth="1" />
                    {/* Data Polygon */}
                    <polygon
                      points={getRadarPoints(p.radarScores)}
                      fill="#f97316"
                      fillOpacity="0.25"
                      stroke="#f97316"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>

                {/* Horizontal Normalized Bar Charts */}
                <div className="bg-[#101622] rounded border border-[#1e293b] p-2.5 space-y-2">
                  <span className="text-[9px] font-mono text-slate-400 block mb-1">Bar (normalized)</span>
                  <div className="space-y-1.5 text-[10px] font-mono">
                    <div>
                      <div className="flex justify-between text-slate-400">
                        <span>accuracy</span>
                        <span className="text-slate-200">{p.metrics.accuracy}%</span>
                      </div>
                      <div className="h-1.5 bg-[#080c14] rounded overflow-hidden">
                        <div className="h-full bg-amber-500 rounded" style={{ width: `${p.metrics.accuracy}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-400">
                        <span>cost_per_call</span>
                        <span className="text-slate-200">{p.metrics.cost_per_call}</span>
                      </div>
                      <div className="h-1.5 bg-[#080c14] rounded overflow-hidden">
                        <div className="h-full bg-sky-500 rounded" style={{ width: `${p.metrics.cost_per_call}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-400">
                        <span>faithfulness</span>
                        <span className="text-slate-200">{p.metrics.faithfulness}%</span>
                      </div>
                      <div className="h-1.5 bg-[#080c14] rounded overflow-hidden">
                        <div className="h-full bg-amber-500 rounded" style={{ width: `${p.metrics.faithfulness}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-400">
                        <span>latency_ms</span>
                        <span className="text-slate-200">{p.metrics.latency_ms}</span>
                      </div>
                      <div className="h-1.5 bg-[#080c14] rounded overflow-hidden">
                        <div className="h-full bg-sky-500 rounded" style={{ width: `${p.metrics.latency_ms}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-400">
                        <span>relevance</span>
                        <span className="text-slate-200">{p.metrics.relevance}%</span>
                      </div>
                      <div className="h-1.5 bg-[#080c14] rounded overflow-hidden">
                        <div className="h-full bg-amber-500 rounded" style={{ width: `${p.metrics.relevance}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Shared Prompt & Output Comparison Workbench */}
        <div className="bg-[#0c111a] border border-[#1e293b] rounded-lg p-4 space-y-3">
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-300 block">
              Shared Evaluation Prompt
            </label>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-[#101622] border border-[#1e293b] rounded px-3 py-1.5 text-xs text-slate-200 font-sans focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className={`grid grid-cols-1 sm:grid-cols-${activeProfiles.length} gap-3`}>
            {activeProfiles.map((p) => (
              <div key={p.id} className="border border-[#1e293b] rounded bg-[#101622]/40 flex flex-col h-[240px]">
                <div className="px-3 py-1.5 border-b border-[#1e293b] bg-[#101622] rounded-t flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-200 font-mono text-[11px]">{p.id}</span>
                  <span className="text-[10px] font-mono text-slate-400">Response Port</span>
                </div>
                <div className="p-3 flex-1 flex flex-col justify-center items-center">
                  <EmptyState
                    icon={<Terminal className="w-4 h-4 text-slate-500" />}
                    title="Awaiting comparative inference"
                    description="Click 'Run Comparison Sweep' to stream outputs across selected models."
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
        title="Model Comparison Gate"
        subtitle="Parallel multi-model comparison sweeps activate in Phase 8."
      >
        <div className="space-y-3 text-xs text-slate-300">
          <p className="leading-relaxed">
            The comparative matrix schemas and Pareto frontier definitions are active. Simultaneous multi-model streaming inference will activate in Phase 8.
          </p>
          <div className="p-3 rounded bg-[#080c14] border border-[#1e293b] font-mono text-[11px] text-slate-300 space-y-1">
            <div className="text-slate-500">// Inactivity Guard Status</div>
            <div>POST /api/v1/modules/model-comparison/execute → <span className="text-amber-400 font-semibold">501 Not Implemented</span></div>
            <div>Active Comparators: {selectedModels.join(', ')}</div>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
};