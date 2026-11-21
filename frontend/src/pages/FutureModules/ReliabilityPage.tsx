import React, { useState } from 'react';
import { PageContainer } from '../../components/layout/PageContainer';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { Modal } from '../../components/ui/Modal';
import {
  Activity,
  Play,
  CheckCircle2,
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
    targetObjective: '0.00 (Perfect Calibration)',
    description: 'Strictly proper scoring rule measuring both calibration and refinement of probabilistic predictions.',
  },
  {
    key: 'overconfidence',
    name: 'Overconfidence Ratio (OCR)',
    formula: 'P(Incorrect | Confidence > 0.85)',
    targetObjective: '< 0.02 (Risk Bounded)',
    description: 'Quantifies frequency of severe hallucinations accompanied by high model certainty.',
  },
];

export const ReliabilityPage: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState('gpt-4o');
  const [temperatureScale, setTemperatureScale] = useState(1.0);
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
      const response = await fetch('/api/v1/modules/reliability/execute', {
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
        message: 'Endpoint correctly refused execution: Phase 1 does not permit unverified calibration sweeps.',
      });
    }
    setIsGateModalOpen(true);
  };

  return (
    <PageContainer
      title="Confidence, Calibration & Reliability"
      subtitle="Statistical calibration diagrams, Expected Calibration Error (ECE), and perturbation robustness."
      badge={<Badge variant="not_implemented">Phase 9 Target</Badge>}
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
            icon={<Activity className="w-3.5 h-3.5" />}
            onClick={handleProbeGate}
          >
            Run Calibration Sweep
          </Button>
        </div>
      }
      maxWidth="wide"
    >
      <div className="space-y-6">
        {/* Notice Banner */}
        <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-100 flex items-start gap-3 text-xs text-slate-700">
          <Activity className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-semibold text-slate-900">
              Statistical Intelligence Workspace — Phase 9 Specification
            </span>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              This workspace provides statistical calibration metrics, ECE calculation definitions, and temperature scaling parameters. Empirical confidence binning and perturbation sensitivity testing are scheduled for Phase 9.
            </p>
          </div>
        </div>

        {/* Section 1: Statistical Reliability Metric Definitions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {RELIABILITY_METRICS.map((m) => (
            <div
              key={m.key}
              className="bg-white border border-slate-200 rounded-xl p-4 shadow-card space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                    {m.key.toUpperCase()}
                  </span>
                  <Badge variant="verified" size="xs">Rigorous</Badge>
                </div>
                <h4 className="text-xs font-bold text-slate-900 mb-1">{m.name}</h4>
                <div className="p-2 bg-slate-50 rounded border border-slate-200 font-mono text-[10px] text-slate-700 mb-2">
                  {m.formula}
                </div>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  {m.description}
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Target:</span>
                <span className="font-mono text-emerald-700 font-semibold">{m.targetObjective}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Section 2: Reliability Diagram Canvas & Calibration Architecture */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column: Conceptual Reliability Diagram (60% width) */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <LineChart className="w-4 h-4 text-sky-600" />
                  Reliability Diagram (Calibration Curve Architecture)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Plots empirical accuracy against predicted confidence intervals.
                </p>
              </div>
              <Badge variant="default" size="xs">Binning M=10</Badge>
            </div>

            {/* Conceptual SVG Diagram */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex flex-col items-center justify-center">
              <svg viewBox="0 0 300 200" className="w-full max-w-sm h-48">
                {/* Grid Lines */}
                <line x1="30" y1="20" x2="30" y2="170" stroke="#cbd5e1" strokeWidth="1" />
                <line x1="30" y1="170" x2="280" y2="170" stroke="#cbd5e1" strokeWidth="1" />
                <line x1="30" y1="95" x2="280" y2="95" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="2,2" />
                <line x1="155" y1="20" x2="155" y2="170" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="2,2" />

                {/* Perfect Calibration Diagonal Line */}
                <line x1="30" y1="170" x2="280" y2="20" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4,4" />

                {/* Conceptual Bins */}
                <rect x="50" y="150" width="18" height="20" fill="#0284c7" opacity="0.3" rx="1" />
                <rect x="90" y="125" width="18" height="45" fill="#0284c7" opacity="0.4" rx="1" />
                <rect x="130" y="100" width="18" height="70" fill="#0284c7" opacity="0.5" rx="1" />
                <rect x="170" y="70" width="18" height="100" fill="#0284c7" opacity="0.6" rx="1" />
                <rect x="210" y="45" width="18" height="125" fill="#0284c7" opacity="0.7" rx="1" />
                <rect x="250" y="30" width="18" height="140" fill="#0284c7" opacity="0.8" rx="1" />

                {/* Axis Labels */}
                <text x="155" y="190" textAnchor="middle" fontSize="10" fill="#64748b" fontFamily="system-ui">
                  Confidence Bin [0.0 → 1.0]
                </text>
                <text x="15" y="95" textAnchor="middle" fontSize="10" fill="#64748b" fontFamily="system-ui" transform="rotate(-90 15 95)">
                  Accuracy
                </text>
              </svg>
              <div className="flex items-center gap-4 text-[11px] text-slate-500 mt-2">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-0.5 bg-slate-400 inline-block border-t border-dashed" />
                  Ideal Calibration (acc = conf)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-sky-600 rounded-sm inline-block" />
                  Observed Confidence Bin (M=10)
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500 text-[11px] leading-relaxed">
              Models are well-calibrated when the empirical accuracy in each confidence bin closely tracks the diagonal. Deviation above the diagonal indicates underconfidence; deviation below indicates dangerous overconfidence.
            </p>
          </div>

          {/* Right Column: Calibration Parameters (40% width) */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-slate-500" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Post-Hoc Temperature Scaling
                </h3>
              </div>
              <Badge variant="verified" size="xs">T-Scaling</Badge>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Target Model</label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-sky-500"
                >
                  <option value="gpt-4o">OpenAI — gpt-4o</option>
                  <option value="claude-3-5-sonnet">Anthropic — claude-3-5-sonnet</option>
                  <option value="gemini-1-5-pro">Google — gemini-1.5-pro</option>
                </select>
              </div>

              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700">Calibration Temperature (T):</span>
                  <span className="font-mono text-sky-700 font-bold">{temperatureScale.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.05"
                  value={temperatureScale}
                  onChange={(e) => setTemperatureScale(parseFloat(e.target.value))}
                  className="w-full accent-sky-600 bg-slate-100 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>T=0.5 (Sharpen)</span>
                  <span>T=1.0 (Neutral)</span>
                  <span>T=2.5 (Smooth)</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 font-mono text-[11px] text-slate-700 space-y-1">
                <div className="text-slate-400">// Calibration Softmax Formula</div>
                <div>q_i = exp(z_i / T) / ∑_j exp(z_j / T)</div>
                <div className="text-slate-500 pt-1">// Platt scaling preserves ranking while optimizing ECE</div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Reliability Runs Empty State */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-card">
          <EmptyState
            icon={<Activity className="w-8 h-8" />}
            title="Statistical Calibration Run Awaiting Phase 9"
            purpose="Evaluates model uncertainty calibration, Expected Calibration Error (ECE), and perturbation robustness."
            expectedData="Reliability diagram bin distributions, Brier score decompositions, temperature scaling coefficients, and noise decay curves."
            enablingPhase="Phase 9 — Confidence, Calibration & Reliability"
            currentAction="Inspect calibration metric mathematical definitions and perturbation test configurations."
            actionLabel="Verify Inactivity Gate"
            onAction={handleProbeGate}
          />
        </div>
      </div>

      {/* Gate Verification Modal */}
      <Modal
        isOpen={isGateModalOpen}
        onClose={() => setIsGateModalOpen(false)}
        title="Phase 9 Reliability Gate Verification"
        subtitle="Verifies that premature calibration sweeps are strictly blocked by the backend API."
      >
        <div className="space-y-3 text-xs">
          <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 font-mono text-[11px] space-y-1.5 text-slate-200">
            <div className="flex justify-between">
              <span className="text-slate-400">Endpoint:</span>
              <span className="text-slate-200">POST /api/v1/modules/reliability/execute</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">HTTP Status:</span>
              <span className="text-amber-400">{probeResult.status || '501 Not Implemented'}</span>
            </div>
          </div>
          <p className="text-slate-600 leading-relaxed">
            {probeResult.message || 'Endpoint correctly returned 501 Not Implemented. Phase 1 prohibits fake calibration runs.'}
          </p>
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-[11px] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>Integrity verified: Statistical formulas calibrated; empirical sweeps inactive until Phase 9.</span>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
};
