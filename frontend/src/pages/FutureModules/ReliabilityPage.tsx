import React, { useState } from 'react';
import { PageContainer } from '../../components/layout/PageContainer';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { Modal } from '../../components/ui/Modal';
import {
  Activity,
  LineChart,
  Sliders,
  BarChart2,
  TrendingDown,
} from 'lucide-react';

interface MetricDef {
  key: string;
  name: string;
  formula: string;
  targetObjective: string;
  description: string;
}

const RELIABILITY_METRICS: MetricDef[] = [
  {
    key: 'ece',
    name: 'Expected Calibration Error (ECE)',
    formula: '∑ ( |acc(B_m) - conf(B_m)| * |B_m| / N )',
    targetObjective: '< 0.05 (Ideal)',
    description: 'Weighted difference between model confidence and actual empirical accuracy across confidence bins.',
  },
  {
    key: 'mce',
    name: 'Maximum Calibration Error (MCE)',
    formula: 'max_m |acc(B_m) - conf(B_m)|',
    targetObjective: '< 0.15 (Acceptable)',
    description: 'Identifies the single worst confidence bucket deviation, bounding catastrophic overconfidence.',
  },
  {
    key: 'brier',
    name: 'Brier Score Decomposition',
    formula: '(1/N) ∑ (p_i - y_i)^2',
    targetObjective: '0.00 (Calibrated)',
    description: 'Strictly proper scoring rule measuring both calibration and refinement of probabilistic predictions.',
  },
  {
    key: 'overconfidence',
    name: 'Overconfidence Ratio (OCR)',
    formula: 'P(Incorrect | Confidence > 0.85)',
    targetObjective: '< 0.02 (Bounded)',
    description: 'Quantifies frequency of severe hallucinations accompanied by high model certainty.',
  },
];

export const ReliabilityPage: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState('gpt-4o');
  const [temperatureScale, setTemperatureScale] = useState(1.0);
  const [isGateModalOpen, setIsGateModalOpen] = useState(false);

  return (
    <PageContainer
      title="Reliability & Calibration"
      subtitle="Statistical calibration diagrams, Expected Calibration Error (ECE), Weibull distribution analysis, and post-hoc temperature scaling."
      actions={
        <Button
          variant="primary"
          size="sm"
          icon={<Activity className="w-3.5 h-3.5" />}
          onClick={() => setIsGateModalOpen(true)}
        >
          Run Calibration Sweep
        </Button>
      }
      maxWidth="wide"
    >
      <div className="space-y-4">
        {/* Metric Summary Cards in Dark Technical Style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {RELIABILITY_METRICS.map((m) => (
            <div
              key={m.key}
              className="bg-[#0c111a] border border-[#1e293b] rounded-lg p-3.5 space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
                    {m.key}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-1.5 py-0.2 rounded border border-emerald-800/60">
                    {m.targetObjective}
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-slate-200 mb-1">{m.name}</h4>
                <div className="p-1.5 bg-[#101622] rounded border border-[#1e293b] font-mono text-[10px] text-sky-300 mb-1">
                  {m.formula}
                </div>
                <p className="text-slate-400 text-[11px] leading-snug">
                  {m.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 4-Quadrant Statistical Distribution Grid (Directly inspired by i-Analyzer Reference Image 6) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Quadrant 1: Reliability Calibration Diagram */}
          <div className="bg-[#0c111a] border border-[#1e293b] rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#1e293b]">
              <div className="flex items-center gap-2">
                <LineChart className="w-4 h-4 text-sky-400" />
                <h3 className="text-xs font-semibold text-slate-200 font-mono uppercase tracking-wider">
                  Reliability Diagram (Empirical Acc vs Conf)
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400 bg-[#101622] border border-[#1e293b] px-1.5 py-0.5 rounded">
                Bin Count: M=10
              </span>
            </div>

            <div className="bg-[#101622] rounded border border-[#1e293b] p-3 flex flex-col items-center">
              <svg viewBox="0 0 320 160" className="w-full max-w-md h-36">
                <line x1="30" y1="15" x2="30" y2="135" stroke="#1e293b" strokeWidth="1" />
                <line x1="30" y1="135" x2="300" y2="135" stroke="#1e293b" strokeWidth="1" />
                <line x1="30" y1="75" x2="300" y2="75" stroke="#1e293b" strokeWidth="1" strokeDasharray="2,2" />

                {/* Diagonal: Ideal Calibration (acc = conf) */}
                <line x1="30" y1="135" x2="300" y2="15" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3,3" />

                {/* Confidence Bins (Cyan theme) */}
                <rect x="50" y="120" width="16" height="15" fill="#38bdf8" opacity="0.4" rx="1" />
                <rect x="90" y="100" width="16" height="35" fill="#38bdf8" opacity="0.5" rx="1" />
                <rect x="130" y="78" width="16" height="57" fill="#38bdf8" opacity="0.6" rx="1" />
                <rect x="170" y="55" width="16" height="80" fill="#38bdf8" opacity="0.7" rx="1" />
                <rect x="210" y="38" width="16" height="97" fill="#38bdf8" opacity="0.8" rx="1" />
                <rect x="250" y="24" width="16" height="111" fill="#38bdf8" opacity="0.9" rx="1" />

                <text x="165" y="152" textAnchor="middle" fontSize="9" fill="#94a3b8" fontFamily="ui-monospace">
                  Confidence Interval Bin [0.0 → 1.0]
                </text>
                <text x="12" y="75" textAnchor="middle" fontSize="9" fill="#94a3b8" fontFamily="ui-monospace" transform="rotate(-90 12 75)">
                  Accuracy
                </text>
              </svg>
              <div className="flex items-center gap-4 text-[10px] text-slate-400 mt-1 font-mono">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-0.5 bg-slate-500 inline-block border-t border-dashed" />
                  Ideal (acc = conf)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-sky-400 rounded-sm inline-block" />
                  Observed Confidence Bins
                </span>
              </div>
            </div>
          </div>

          {/* Quadrant 2: Token Entropy & Log-Normal Distribution (i-Analyzer Style) */}
          <div className="bg-[#0c111a] border border-[#1e293b] rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#1e293b]">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-semibold text-slate-200 font-mono uppercase tracking-wider">
                  Prediction Entropy Log-Normal Distribution
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-1.5 py-0.5 rounded">
                Fit: μ=0.42, σ=0.18
              </span>
            </div>

            <div className="bg-[#101622] rounded border border-[#1e293b] p-3 flex flex-col items-center">
              <svg viewBox="0 0 320 160" className="w-full max-w-md h-36">
                <line x1="30" y1="15" x2="30" y2="135" stroke="#1e293b" strokeWidth="1" />
                <line x1="30" y1="135" x2="300" y2="135" stroke="#1e293b" strokeWidth="1" />
                {/* Histogram Bars in Teal / Emerald */}
                <rect x="45" y="125" width="18" height="10" fill="#2dd4bf" opacity="0.8" />
                <rect x="67" y="105" width="18" height="30" fill="#2dd4bf" opacity="0.8" />
                <rect x="89" y="70" width="18" height="65" fill="#2dd4bf" opacity="0.8" />
                <rect x="111" y="45" width="18" height="90" fill="#2dd4bf" opacity="0.8" />
                <rect x="133" y="30" width="18" height="105" fill="#2dd4bf" opacity="0.8" />
                <rect x="155" y="50" width="18" height="85" fill="#2dd4bf" opacity="0.8" />
                <rect x="177" y="75" width="18" height="60" fill="#2dd4bf" opacity="0.8" />
                <rect x="199" y="100" width="18" height="35" fill="#2dd4bf" opacity="0.8" />
                <rect x="221" y="115" width="18" height="20" fill="#2dd4bf" opacity="0.8" />
                <rect x="243" y="125" width="18" height="10" fill="#2dd4bf" opacity="0.8" />
                <rect x="265" y="130" width="18" height="5" fill="#2dd4bf" opacity="0.8" />

                {/* Fitted distribution curve */}
                <path
                  d="M 45 130 Q 133 15 155 45 T 280 132"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                />
              </svg>
              <div className="text-[10px] text-slate-400 font-mono mt-1">
                Token Prediction Shannon Entropy Density
              </div>
            </div>
          </div>

          {/* Quadrant 3: Weibull Distribution Error Spread (i-Analyzer Style) */}
          <div className="bg-[#0c111a] border border-[#1e293b] rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#1e293b]">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-semibold text-slate-200 font-mono uppercase tracking-wider">
                  Weibull Failure Risk Distribution (Sequence Drift)
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400 bg-[#101622] border border-[#1e293b] px-1.5 py-0.5 rounded">
                k=1.82, λ=420 tok
              </span>
            </div>

            <div className="bg-[#101622] rounded border border-[#1e293b] p-3 flex flex-col items-center">
              <svg viewBox="0 0 320 160" className="w-full max-w-md h-36">
                <line x1="30" y1="15" x2="30" y2="135" stroke="#1e293b" strokeWidth="1" />
                <line x1="30" y1="135" x2="300" y2="135" stroke="#1e293b" strokeWidth="1" />
                {/* Weibull Bars */}
                <rect x="45" y="115" width="22" height="20" fill="#f59e0b" opacity="0.7" />
                <rect x="71" y="85" width="22" height="50" fill="#f59e0b" opacity="0.7" />
                <rect x="97" y="55" width="22" height="80" fill="#f59e0b" opacity="0.7" />
                <rect x="123" y="40" width="22" height="95" fill="#f59e0b" opacity="0.7" />
                <rect x="149" y="60" width="22" height="75" fill="#f59e0b" opacity="0.7" />
                <rect x="175" y="80" width="22" height="55" fill="#f59e0b" opacity="0.7" />
                <rect x="201" y="98" width="22" height="37" fill="#f59e0b" opacity="0.7" />
                <rect x="227" y="112" width="22" height="23" fill="#f59e0b" opacity="0.7" />
                <rect x="253" y="122" width="22" height="13" fill="#f59e0b" opacity="0.7" />

                {/* Weibull curve */}
                <path
                  d="M 40 125 C 90 40, 130 35, 175 75 S 270 130, 290 133"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2"
                />
              </svg>
              <div className="text-[10px] text-slate-400 font-mono mt-1">
                Failure Probability Hazard Rate over Generated Token Length
              </div>
            </div>
          </div>

          {/* Quadrant 4: Post-Hoc Temperature Scaling & Calibration Config */}
          <div className="bg-[#0c111a] border border-[#1e293b] rounded-lg p-4 space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#1e293b]">
              <div className="flex items-center gap-1.5 font-semibold text-slate-200 font-mono">
                <Sliders className="w-3.5 h-3.5 text-purple-400" />
                <span>POST-HOC TEMPERATURE SCALING</span>
              </div>
              <span className="text-[10px] font-mono text-purple-400 bg-purple-950/40 border border-purple-800/60 px-1.5 py-0.5 rounded">
                Platt Scaling
              </span>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-300 block">Target Inference Model</label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full bg-[#101622] border border-[#1e293b] rounded px-2.5 py-1 text-xs font-mono text-slate-200 focus:outline-none focus:border-sky-500"
                >
                  <option value="gpt-4o">OpenAI — gpt-4o</option>
                  <option value="claude-3-5-sonnet">Anthropic — claude-3-5-sonnet</option>
                  <option value="gemini-1-5-pro">Google — gemini-1.5-pro</option>
                </select>
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-slate-300">Calibration Temperature (T):</span>
                  <span className="text-sky-400 font-bold">{temperatureScale.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.05"
                  value={temperatureScale}
                  onChange={(e) => setTemperatureScale(parseFloat(e.target.value))}
                  className="w-full accent-sky-400 bg-[#1e293b] h-1 rounded appearance-none cursor-pointer"
                />
              </div>

              <div className="p-2.5 bg-[#101622] rounded border border-[#1e293b] font-mono text-[10px] text-slate-300 space-y-1">
                <div className="text-slate-500">// Softmax Logit Temperature Re-calibration</div>
                <div className="text-sky-300">q_i = exp(z_i / T) / ∑ exp(z_j / T)</div>
                <div className="text-slate-400 text-[9px] pt-1">
                  Adjusting T modifies prediction confidence without changing top-1 class ordering.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Empty State */}
        <div className="bg-[#0c111a] border border-[#1e293b] rounded-lg p-4">
          <EmptyState
            icon={<Activity className="w-5 h-5 text-slate-500" />}
            title="Calibration sweep engine awaiting activation"
            description="Run an evaluation sweep across dataset splits to plot empirical reliability diagrams and compute ECE metrics."
            enablingPhase="Phase 9: Confidence, Calibration & Reliability"
            actionLabel="Verify Reliability Gate"
            onAction={() => setIsGateModalOpen(true)}
          />
        </div>
      </div>

      {/* Phase 9 Gate Modal */}
      <Modal
        isOpen={isGateModalOpen}
        onClose={() => setIsGateModalOpen(false)}
        title="Reliability & Calibration Gate"
        subtitle="Uncertainty calibration and ECE scoring activate in Phase 9."
      >
        <div className="space-y-3 text-xs text-slate-300">
          <p className="leading-relaxed">
            The calibration formulas and Platt scaling algorithms are defined. Empirical probability bucket sweeps will activate in Phase 9.
          </p>
          <div className="p-3 rounded bg-[#080c14] border border-[#1e293b] font-mono text-[11px] text-slate-300 space-y-1">
            <div className="text-slate-500">// Inactivity Guard Status</div>
            <div>POST /api/v1/modules/reliability/execute → <span className="text-amber-400 font-semibold">501 Not Implemented</span></div>
            <div>Target Model: {selectedModel}</div>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
};