import React, { useState } from 'react';
import { PageContainer } from '../../components/layout/PageContainer';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { Modal } from '../../components/ui/Modal';
import {
  Activity,
  LineChart,
  Sliders,
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
      subtitle="Statistical calibration diagrams, Expected Calibration Error (ECE), and post-hoc temperature scaling."
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
        {/* Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {RELIABILITY_METRICS.map((m) => (
            <div
              key={m.key}
              className="bg-white border border-slate-200 rounded-lg p-3 space-y-1.5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
                    {m.key}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200">
                    {m.targetObjective}
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-slate-900 mb-1">{m.name}</h4>
                <div className="p-1.5 bg-slate-50 rounded border border-slate-200 font-mono text-[10px] text-slate-600 mb-1">
                  {m.formula}
                </div>
                <p className="text-slate-500 text-[11px] leading-snug">
                  {m.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Reliability Diagram & Temperature Scaling Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Reliability Diagram (~65% width) */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <LineChart className="w-4 h-4 text-slate-400" />
                <h3 className="text-xs font-semibold text-slate-900">
                  Reliability Diagram (Empirical Accuracy vs Predicted Confidence)
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                Bin Count: M=10
              </span>
            </div>

            {/* Clean SVG Diagram */}
            <div className="bg-slate-50 rounded-md border border-slate-200 p-4 flex flex-col items-center">
              <svg viewBox="0 0 320 180" className="w-full max-w-md h-40">
                <line x1="30" y1="20" x2="30" y2="150" stroke="#cbd5e1" strokeWidth="1" />
                <line x1="30" y1="150" x2="300" y2="150" stroke="#cbd5e1" strokeWidth="1" />
                <line x1="30" y1="85" x2="300" y2="85" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="2,2" />

                {/* Diagonal: Ideal Calibration */}
                <line x1="30" y1="150" x2="300" y2="20" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3,3" />

                {/* Sample Confidence Bins */}
                <rect x="50" y="135" width="16" height="15" fill="#0284c7" opacity="0.3" rx="1" />
                <rect x="90" y="115" width="16" height="35" fill="#0284c7" opacity="0.4" rx="1" />
                <rect x="130" y="90" width="16" height="60" fill="#0284c7" opacity="0.5" rx="1" />
                <rect x="170" y="65" width="16" height="85" fill="#0284c7" opacity="0.6" rx="1" />
                <rect x="210" y="45" width="16" height="105" fill="#0284c7" opacity="0.7" rx="1" />
                <rect x="250" y="30" width="16" height="120" fill="#0284c7" opacity="0.8" rx="1" />

                <text x="165" y="170" textAnchor="middle" fontSize="9" fill="#64748b" fontFamily="system-ui">
                  Confidence Interval Bin [0.0 → 1.0]
                </text>
                <text x="12" y="85" textAnchor="middle" fontSize="9" fill="#64748b" fontFamily="system-ui" transform="rotate(-90 12 85)">
                  Accuracy
                </text>
              </svg>
              <div className="flex items-center gap-4 text-[10px] text-slate-500 mt-1">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-0.5 bg-slate-400 inline-block border-t border-dashed" />
                  Ideal Calibration (acc = conf)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-sky-600 rounded-sm inline-block" />
                  Observed Confidence Bin (M=10)
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              Well-calibrated models produce output probabilities that reflect actual empirical accuracy. Overconfident models deviate below the dashed diagonal line.
            </p>
          </div>

          {/* Temperature Scaling Panel (~35% width) */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-lg p-4 space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                <Sliders className="w-3.5 h-3.5 text-slate-400" />
                <span>Post-Hoc Temperature Scaling</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-600 block">Target Model</label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 text-xs font-mono text-slate-900 focus:outline-none focus:border-sky-500"
                >
                  <option value="gpt-4o">OpenAI — gpt-4o</option>
                  <option value="claude-3-5-sonnet">Anthropic — claude-3-5-sonnet</option>
                  <option value="gemini-1-5-pro">Google — gemini-1.5-pro</option>
                </select>
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-[11px]">
                  <span className="font-medium text-slate-600">Calibration Temperature (T):</span>
                  <span className="font-mono text-slate-900 font-bold">{temperatureScale.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.05"
                  value={temperatureScale}
                  onChange={(e) => setTemperatureScale(parseFloat(e.target.value))}
                  className="w-full accent-sky-600 bg-slate-200 h-1 rounded appearance-none cursor-pointer"
                />
              </div>

              <div className="p-2.5 bg-slate-50 rounded-md border border-slate-200 font-mono text-[10px] text-slate-600 space-y-1">
                <div className="text-slate-400">// Softmax Platt Scaling</div>
                <div>q_i = exp(z_i / T) / ∑ exp(z_j / T)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Empty State */}
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <EmptyState
            icon={<Activity className="w-5 h-5 text-slate-400" />}
            title="No calibration sweep data recorded yet"
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
        <div className="space-y-3 text-xs text-slate-600">
          <p className="leading-relaxed">
            The calibration formulas and Platt scaling algorithms are defined. Empirical probability bucket sweeps will activate in Phase 9.
          </p>
          <div className="p-3 rounded bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-700 space-y-1">
            <div className="text-slate-400">// Inactivity Guard Status</div>
            <div>POST /api/v1/modules/reliability/execute → <span className="text-amber-600 font-semibold">501 Not Implemented</span></div>
            <div>Target Model: {selectedModel}</div>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
};
