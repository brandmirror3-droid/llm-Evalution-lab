import React, { useState } from 'react';
import { PageContainer } from '../../components/layout/PageContainer';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import {
  Activity,
  LineChart,
  Sliders,
  BarChart2,
  TrendingDown,
  Sparkles,
  Search,
  Eye,
  Maximize2,
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
    formula: 'P(Incorrect | Conf > 0.85)',
    targetObjective: '< 0.02 (Bounded)',
    description: 'Quantifies frequency of severe hallucinations accompanied by high model certainty.',
  },
];

interface SweepRun {
  id: string;
  name: string;
  valAcc: number;
  nParams: number;
  activation: 'relu' | 'gelu' | 'tanh' | 'swish';
  batchSize: number;
  shape: 'narrow' | 'wide' | 'bottleneck' | 'deep';
  color: string;
}

const SWEEP_RUNS: SweepRun[] = [
  { id: 'run_1', name: 'lucky-sweep-5', valAcc: 0.9810, nParams: 180000, activation: 'swish', batchSize: 128, shape: 'wide', color: '#f59e0b' },
  { id: 'run_2', name: 'northern-sweep-111', valAcc: 0.9804, nParams: 172000, activation: 'gelu', batchSize: 128, shape: 'wide', color: '#f59e0b' },
  { id: 'run_3', name: 'atomic-sweep-63', valAcc: 0.9795, nParams: 160000, activation: 'gelu', batchSize: 64, shape: 'deep', color: '#ec4899' },
  { id: 'run_4', name: 'drawn-sweep-169', valAcc: 0.9793, nParams: 154000, activation: 'swish', batchSize: 64, shape: 'deep', color: '#ec4899' },
  { id: 'run_5', name: 'proud-sweep-42', valAcc: 0.9784, nParams: 140000, activation: 'tanh', batchSize: 64, shape: 'bottleneck', color: '#d946ef' },
  { id: 'run_6', name: 'visionary-sweep-118', valAcc: 0.9781, nParams: 135000, activation: 'gelu', batchSize: 32, shape: 'bottleneck', color: '#c084fc' },
  { id: 'run_7', name: 'scarlet-sweep-79', valAcc: 0.9760, nParams: 110000, activation: 'relu', batchSize: 32, shape: 'narrow', color: '#a855f7' },
  { id: 'run_8', name: 'rural-sweep-109', valAcc: 0.9756, nParams: 95000, activation: 'relu', batchSize: 16, shape: 'narrow', color: '#8b5cf6' },
  { id: 'run_9', name: 'morning-sweep-139', valAcc: 0.9754, nParams: 85000, activation: 'tanh', batchSize: 16, shape: 'bottleneck', color: '#7c3aed' },
  { id: 'run_10', name: 'prime-sweep-135', valAcc: 0.9752, nParams: 78000, activation: 'relu', batchSize: 16, shape: 'narrow', color: '#6366f1' },
];

interface ParamImportance {
  parameter: string;
  importance: number;
  correlation: number;
}

const PARAM_IMPORTANCE: ParamImportance[] = [
  { parameter: 'n_params', importance: 0.82, correlation: 0.76 },
  { parameter: 'budget', importance: 0.58, correlation: 0.64 },
  { parameter: 'parameter_budget', importance: 0.44, correlation: 0.55 },
  { parameter: 'Runtime', importance: 0.32, correlation: -0.48 },
  { parameter: 'lr', importance: 0.18, correlation: 0.31 },
];

export const ReliabilityPage: React.FC = () => {
  const [selectedSweepRun, setSelectedSweepRun] = useState<string>('lucky-sweep-5');
  const [temperatureScale, setTemperatureScale] = useState(1.08);
  const [isGateModalOpen, setIsGateModalOpen] = useState(false);

  // Parallel Coordinates Axis Coordinate Helpers
  // 5 vertical axes spread across width 0..720, height 0..240
  // Axis X positions:
  const axX = [80, 220, 360, 500, 640];
  const plotYTop = 35;
  const plotYBottom = 205;
  const plotH = plotYBottom - plotYTop;

  // Normalized Y position generators for 5 axes
  const getY_nParams = (val: number) => plotYBottom - ((val - 50000) / 150000) * plotH;
  const getY_activation = (act: string) => {
    switch (act) {
      case 'swish': return plotYTop + plotH * 0.15;
      case 'gelu': return plotYTop + plotH * 0.40;
      case 'tanh': return plotYTop + plotH * 0.65;
      case 'relu': return plotYTop + plotH * 0.90;
      default: return plotYTop + plotH * 0.5;
    }
  };
  const getY_batchSize = (bs: number) => {
    // 16 -> 128
    const norm = (Math.log2(bs) - 4) / 3; // 16:0, 32:1/3, 64:2/3, 128:1
    return plotYBottom - norm * plotH;
  };
  const getY_shape = (shape: string) => {
    switch (shape) {
      case 'wide': return plotYTop + plotH * 0.15;
      case 'deep': return plotYTop + plotH * 0.40;
      case 'bottleneck': return plotYTop + plotH * 0.65;
      case 'narrow': return plotYTop + plotH * 0.90;
      default: return plotYTop + plotH * 0.5;
    }
  };
  const getY_valAcc = (acc: number) => {
    // 0.970 -> 0.985
    const norm = Math.max(0, Math.min(1, (acc - 0.970) / 0.015));
    return plotYBottom - norm * plotH;
  };

  return (
    <PageContainer
      title="Reliability & Calibration Diagnostics"
      subtitle="Statistical calibration, hyperparameter sweep parallel coordinates, Expected Calibration Error (ECE), and Weibull failure hazard rates."
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
        {/* Metric Summary Cards in Lab Scientific Style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {RELIABILITY_METRICS.map((m) => (
            <div
              key={m.key}
              className="bg-[#1C1F22] border border-[#35393D] rounded-sm p-3.5 space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono text-[#06b6d4] uppercase font-bold tracking-wider">
                    {m.key}
                  </span>
                  <span className="text-[10px] font-mono text-[#10b981] bg-[#10b981]/10 px-1.5 py-0.2 rounded-sm border border-[#10b981]/30">
                    {m.targetObjective}
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-[#D9DEE2] mb-1">{m.name}</h4>
                <div className="p-1.5 bg-[#101214] rounded-sm border border-[#35393D] font-mono text-[10px] text-[#06b6d4] mb-1.5 overflow-x-auto">
                  {m.formula}
                </div>
                <p className="text-[#929BA3] text-[11px] leading-snug">
                  {m.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* SECTION 1: REFERENCE 05 — STATISTICAL DIAGNOSTIC WORKBENCH */}
        {/* Hyperparameter Sweep Parallel Coordinates Workbench */}
        <div className="bg-[#1C1F22] border border-[#35393D] rounded-sm overflow-hidden">
          {/* Top Workbench Title Bar */}
          <div className="bg-[#17191B] px-4 py-2.5 border-b border-[#35393D] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-3">
              <span className="text-[#929BA3]">Sweep:</span>
              <span className="font-bold text-[#D9DEE2] flex items-center gap-1.5">
                shape_sweep
                <Sparkles className="w-3.5 h-3.5 text-[#06b6d4]" />
              </span>
              <span className="text-[10px] text-[#687179] border-l border-[#35393D] pl-3">
                156 runs visualized
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#929BA3]">TARGET:</span>
              <span className="text-[10px] font-bold text-[#f59e0b] bg-[#f59e0b]/10 border border-[#f59e0b]/30 px-2 py-0.5 rounded-sm">
                val-full/accuracy
              </span>
              <span className="text-[10px] text-[#06b6d4] bg-[#06b6d4]/10 border border-[#06b6d4]/30 px-2 py-0.5 rounded-sm">
                PHASE_01_CALIBRATION
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#35393D]">
            {/* Left Column: Sweep Runs List (col-span-3) */}
            <div className="lg:col-span-3 p-3 space-y-2 bg-[#17191B]/50">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#929BA3] pb-1.5 border-b border-[#35393D]">
                <div className="flex items-center gap-1.5">
                  <Search className="w-3 h-3 text-[#687179]" />
                  <span>Runs (10 of 156)</span>
                </div>
                <span>val-full/a...</span>
              </div>

              <div className="space-y-1 max-h-[300px] overflow-y-auto pr-1">
                {SWEEP_RUNS.map((run) => {
                  const isSelected = selectedSweepRun === run.name;
                  return (
                    <div
                      key={run.id}
                      onClick={() => setSelectedSweepRun(run.name)}
                      className={`flex items-center justify-between px-2 py-1.5 rounded-sm text-xs font-mono cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-[#232629] border border-[#06b6d4] text-[#D9DEE2]'
                          : 'hover:bg-[#232629]/60 text-[#929BA3] border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Eye className={`w-3 h-3 ${isSelected ? 'text-[#06b6d4]' : 'text-[#687179]'}`} />
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: run.color }}
                        />
                        <span className="truncate text-[11px]">{run.name}</span>
                      </div>
                      <span className="font-bold text-[11px] text-[#D9DEE2] shrink-0 ml-2">
                        {run.valAcc.toFixed(4)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Center: Parallel Coordinates Plot (col-span-9) */}
            <div className="lg:col-span-9 p-4 bg-[#101214] flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <LineChart className="w-4 h-4 text-[#06b6d4]" />
                  <h3 className="text-xs font-bold text-[#D9DEE2] font-mono uppercase tracking-wider">
                    Results of Hyperparameter Sweep
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-[#929BA3]">
                  <span>5 Dimensions</span>
                  <Maximize2 className="w-3 h-3 text-[#687179]" />
                </div>
              </div>

              {/* Parallel Coordinates SVG Plot */}
              <div className="relative w-full overflow-x-auto">
                <svg viewBox="0 0 720 240" className="w-full h-56 min-w-[580px]">
                  {/* Background Grid Lines */}
                  <rect x="20" y="20" width="670" height="200" fill="#101214" stroke="#35393D" strokeWidth="0.75" />

                  {/* 5 Vertical Axes */}
                  {axX.map((x, i) => (
                    <g key={i}>
                      <line x1={x} y1={plotYTop} x2={x} y2={plotYBottom} stroke="#4b5563" strokeWidth="1.2" />
                      {/* Ticks */}
                      <line x1={x - 4} y1={plotYTop} x2={x + 4} y2={plotYTop} stroke="#4b5563" strokeWidth="1" />
                      <line x1={x - 4} y1={(plotYTop + plotYBottom) / 2} x2={x + 4} y2={(plotYTop + plotYBottom) / 2} stroke="#4b5563" strokeWidth="1" />
                      <line x1={x - 4} y1={plotYBottom} x2={x + 4} y2={plotYBottom} stroke="#4b5563" strokeWidth="1" />
                    </g>
                  ))}

                  {/* Axis 1 Labels: n_params */}
                  <text x={axX[0]} y={plotYTop - 12} textAnchor="middle" fontSize="10" fill="#929BA3" fontFamily="ui-monospace" fontWeight="bold">n_params</text>
                  <text x={axX[0] - 8} y={plotYTop + 4} textAnchor="end" fontSize="8" fill="#687179" fontFamily="ui-monospace">2e+5</text>
                  <text x={axX[0] - 8} y={(plotYTop + plotYBottom) / 2 + 3} textAnchor="end" fontSize="8" fill="#687179" fontFamily="ui-monospace">1e+5</text>
                  <text x={axX[0] - 8} y={plotYBottom + 3} textAnchor="end" fontSize="8" fill="#687179" fontFamily="ui-monospace">5e+4</text>

                  {/* Axis 2 Labels: activation */}
                  <text x={axX[1]} y={plotYTop - 12} textAnchor="middle" fontSize="10" fill="#929BA3" fontFamily="ui-monospace" fontWeight="bold">activation</text>
                  <text x={axX[1] + 8} y={plotYTop + plotH * 0.15 + 3} textAnchor="start" fontSize="8" fill="#687179" fontFamily="ui-monospace">swish</text>
                  <text x={axX[1] + 8} y={plotYTop + plotH * 0.40 + 3} textAnchor="start" fontSize="8" fill="#687179" fontFamily="ui-monospace">gelu</text>
                  <text x={axX[1] + 8} y={plotYTop + plotH * 0.65 + 3} textAnchor="start" fontSize="8" fill="#687179" fontFamily="ui-monospace">tanh</text>
                  <text x={axX[1] + 8} y={plotYTop + plotH * 0.90 + 3} textAnchor="start" fontSize="8" fill="#687179" fontFamily="ui-monospace">relu</text>

                  {/* Axis 3 Labels: batch_size */}
                  <text x={axX[2]} y={plotYTop - 12} textAnchor="middle" fontSize="10" fill="#929BA3" fontFamily="ui-monospace" fontWeight="bold">batch_size</text>
                  <text x={axX[2] - 8} y={plotYTop + 4} textAnchor="end" fontSize="8" fill="#687179" fontFamily="ui-monospace">128</text>
                  <text x={axX[2] - 8} y={plotYTop + plotH * 0.33 + 3} textAnchor="end" fontSize="8" fill="#687179" fontFamily="ui-monospace">64</text>
                  <text x={axX[2] - 8} y={plotYTop + plotH * 0.67 + 3} textAnchor="end" fontSize="8" fill="#687179" fontFamily="ui-monospace">32</text>
                  <text x={axX[2] - 8} y={plotYBottom + 3} textAnchor="end" fontSize="8" fill="#687179" fontFamily="ui-monospace">16</text>

                  {/* Axis 4 Labels: shape */}
                  <text x={axX[3]} y={plotYTop - 12} textAnchor="middle" fontSize="10" fill="#929BA3" fontFamily="ui-monospace" fontWeight="bold">shape</text>
                  <text x={axX[3] + 8} y={plotYTop + plotH * 0.15 + 3} textAnchor="start" fontSize="8" fill="#687179" fontFamily="ui-monospace">wide</text>
                  <text x={axX[3] + 8} y={plotYTop + plotH * 0.40 + 3} textAnchor="start" fontSize="8" fill="#687179" fontFamily="ui-monospace">deep</text>
                  <text x={axX[3] + 8} y={plotYTop + plotH * 0.65 + 3} textAnchor="start" fontSize="8" fill="#687179" fontFamily="ui-monospace">bottleneck</text>
                  <text x={axX[3] + 8} y={plotYTop + plotH * 0.90 + 3} textAnchor="start" fontSize="8" fill="#687179" fontFamily="ui-monospace">narrow</text>

                  {/* Axis 5 Labels: val-full/accuracy */}
                  <text x={axX[4]} y={plotYTop - 12} textAnchor="middle" fontSize="10" fill="#929BA3" fontFamily="ui-monospace" fontWeight="bold">val-full/accuracy</text>
                  <text x={axX[4] - 8} y={plotYTop + 4} textAnchor="end" fontSize="8" fill="#687179" fontFamily="ui-monospace">0.985</text>
                  <text x={axX[4] - 8} y={(plotYTop + plotYBottom) / 2 + 3} textAnchor="end" fontSize="8" fill="#687179" fontFamily="ui-monospace">0.978</text>
                  <text x={axX[4] - 8} y={plotYBottom + 3} textAnchor="end" fontSize="8" fill="#687179" fontFamily="ui-monospace">0.970</text>

                  {/* Splines for each sweep run */}
                  {SWEEP_RUNS.map((run) => {
                    const y1 = getY_nParams(run.nParams);
                    const y2 = getY_activation(run.activation);
                    const y3 = getY_batchSize(run.batchSize);
                    const y4 = getY_shape(run.shape);
                    const y5 = getY_valAcc(run.valAcc);
                    const isSelected = selectedSweepRun === run.name;

                    // Smooth Bezier path connecting the 5 points
                    const pathD = `M ${axX[0]} ${y1} ` +
                      `C ${axX[0] + 70} ${y1}, ${axX[1] - 70} ${y2}, ${axX[1]} ${y2} ` +
                      `C ${axX[1] + 70} ${y2}, ${axX[2] - 70} ${y3}, ${axX[2]} ${y3} ` +
                      `C ${axX[2] + 70} ${y3}, ${axX[3] - 70} ${y4}, ${axX[3]} ${y4} ` +
                      `C ${axX[3] + 70} ${y4}, ${axX[4] - 70} ${y5}, ${axX[4]} ${y5}`;

                    return (
                      <path
                        key={run.id}
                        d={pathD}
                        fill="none"
                        stroke={run.color}
                        strokeWidth={isSelected ? 2.5 : 1.2}
                        opacity={isSelected ? 1.0 : 0.65}
                      />
                    );
                  })}

                  {/* Right Colorbar Gradient Legend (Direct from Ref 05) */}
                  <defs>
                    <linearGradient id="valAccGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" />
                      <stop offset="35%" stopColor="#ec4899" />
                      <stop offset="70%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                  </defs>
                  <rect x="670" y={plotYTop} width="12" height={plotH} fill="url(#valAccGradient)" rx="1" />
                  <text x="686" y={plotYTop + 8} fontSize="8" fill="#f59e0b" fontFamily="ui-monospace">0.99</text>
                  <text x="686" y={(plotYTop + plotYBottom) / 2 + 3} fontSize="8" fill="#ec4899" fontFamily="ui-monospace">0.97</text>
                  <text x="686" y={plotYBottom} fontSize="8" fill="#6366f1" fontFamily="ui-monospace">0.90</text>
                </svg>
              </div>

              {/* Bottom Split: Parameter Importance (Left) + Best Model Callout (Right) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-3 border-t border-[#35393D] mt-3">
                {/* Parameter Importance Table/Bars (col-span-7) */}
                <div className="md:col-span-7 bg-[#17191B] border border-[#35393D] rounded-sm p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono font-bold text-[#D9DEE2]">
                      Parameter importance with respect to <span className="text-[#06b6d4]">val-full/accuracy</span>
                    </span>
                    <span className="text-[10px] font-mono text-[#687179]">Page 1 of 2</span>
                  </div>

                  <div className="space-y-1.5 font-mono text-[11px]">
                    <div className="grid grid-cols-12 text-[#687179] text-[9.5px] pb-1 border-b border-[#35393D]">
                      <span className="col-span-5">Config parameter</span>
                      <span className="col-span-4">Importance</span>
                      <span className="col-span-3">Correlation</span>
                    </div>

                    {PARAM_IMPORTANCE.map((pi) => (
                      <div key={pi.parameter} className="grid grid-cols-12 items-center text-[#D9DEE2]">
                        <span className="col-span-5 truncate text-[#929BA3]">{pi.parameter}</span>
                        {/* Importance Bar */}
                        <div className="col-span-4 pr-3">
                          <div className="h-2 w-full bg-[#101214] rounded-xs overflow-hidden border border-[#35393D]/50">
                            <div
                              className="h-full bg-[#06b6d4]"
                              style={{ width: `${pi.importance * 100}%` }}
                            />
                          </div>
                        </div>
                        {/* Correlation Bar (Positive green, Negative red) */}
                        <div className="col-span-3 pr-2">
                          <div className="h-2 w-full bg-[#101214] rounded-xs overflow-hidden border border-[#35393D]/50">
                            <div
                              className={`h-full ${pi.correlation >= 0 ? 'bg-[#10b981]' : 'bg-[#ef4444]'}`}
                              style={{ width: `${Math.abs(pi.correlation) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Best Model Callout & Loss Curve (col-span-5) */}
                <div className="md:col-span-5 bg-[#17191B] border border-[#35393D] rounded-sm p-3 flex flex-col justify-between">
                  <div>
                    <div className="text-[10px] font-mono text-[#687179] uppercase">Best Model by Val Acc</div>
                    <div className="text-xs font-mono text-[#f59e0b] font-bold mt-0.5">lucky-sweep-5</div>
                    <div className="text-3xl font-bold font-mono text-[#D9DEE2] tracking-tight mt-1">
                      0.981
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-[#35393D]">
                    <div className="text-[9.5px] font-mono text-[#687179] mb-1">
                      loss/val-batch (first 10 runs)
                    </div>
                    {/* Multi-run Loss Convergence Curves */}
                    <svg viewBox="0 0 200 45" className="w-full h-11">
                      <path d="M 5 40 Q 30 15 70 12 T 195 8" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
                      <path d="M 5 42 Q 35 22 75 16 T 195 10" fill="none" stroke="#ec4899" strokeWidth="1" strokeDasharray="2,2" />
                      <path d="M 5 38 Q 40 28 85 20 T 195 14" fill="none" stroke="#8b5cf6" strokeWidth="1" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: STATISTICAL DISTRIBUTION & CALIBRATION 4-QUADRANT GRID */}
        {/* Direct match to capind.com.tw i-Analyzer Weibull & Log-Normal Curves */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Quadrant 1: Reliability Calibration Diagram */}
          <div className="bg-[#1C1F22] border border-[#35393D] rounded-sm p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#35393D]">
              <div className="flex items-center gap-2">
                <LineChart className="w-4 h-4 text-[#06b6d4]" />
                <h3 className="text-xs font-semibold text-[#D9DEE2] font-mono uppercase tracking-wider">
                  Reliability Diagram (Empirical Acc vs Conf)
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#929BA3] bg-[#101214] border border-[#35393D] px-1.5 py-0.5 rounded-sm">
                Bin Count: M=10
              </span>
            </div>

            <div className="bg-[#101214] rounded-sm border border-[#35393D] p-3 flex flex-col items-center">
              <svg viewBox="0 0 320 160" className="w-full max-w-md h-36">
                <line x1="30" y1="15" x2="30" y2="135" stroke="#35393D" strokeWidth="1" />
                <line x1="30" y1="135" x2="300" y2="135" stroke="#35393D" strokeWidth="1" />
                <line x1="30" y1="75" x2="300" y2="75" stroke="#35393D" strokeWidth="1" strokeDasharray="2,2" />

                {/* Diagonal: Ideal Calibration (acc = conf) */}
                <line x1="30" y1="135" x2="300" y2="15" stroke="#687179" strokeWidth="1.5" strokeDasharray="3,3" />

                {/* Confidence Bins (Cyan theme) */}
                <rect x="50" y="120" width="16" height="15" fill="#06b6d4" opacity="0.4" />
                <rect x="90" y="100" width="16" height="35" fill="#06b6d4" opacity="0.5" />
                <rect x="130" y="78" width="16" height="57" fill="#06b6d4" opacity="0.6" />
                <rect x="170" y="55" width="16" height="80" fill="#06b6d4" opacity="0.7" />
                <rect x="210" y="38" width="16" height="97" fill="#06b6d4" opacity="0.8" />
                <rect x="250" y="24" width="16" height="111" fill="#06b6d4" opacity="0.9" />

                <text x="165" y="152" textAnchor="middle" fontSize="9" fill="#929BA3" fontFamily="ui-monospace">
                  Confidence Interval Bin [0.0 → 1.0]
                </text>
                <text x="12" y="75" textAnchor="middle" fontSize="9" fill="#929BA3" fontFamily="ui-monospace" transform="rotate(-90 12 75)">
                  Accuracy
                </text>
              </svg>
              <div className="flex items-center gap-4 text-[10px] text-[#929BA3] mt-1 font-mono">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-0.5 bg-[#687179] inline-block border-t border-dashed" />
                  Ideal (acc = conf)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-[#06b6d4] inline-block" />
                  Observed Confidence Bins
                </span>
              </div>
            </div>
          </div>

          {/* Quadrant 2: Token Entropy & Log-Normal Distribution */}
          <div className="bg-[#1C1F22] border border-[#35393D] rounded-sm p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#35393D]">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-[#10b981]" />
                <h3 className="text-xs font-semibold text-[#D9DEE2] font-mono uppercase tracking-wider">
                  Prediction Entropy Log-Normal Distribution
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#10b981] bg-[#10b981]/10 border border-[#10b981]/30 px-1.5 py-0.5 rounded-sm">
                Fit: μ=0.42, σ=0.18
              </span>
            </div>

            <div className="bg-[#101214] rounded-sm border border-[#35393D] p-3 flex flex-col items-center">
              <svg viewBox="0 0 320 160" className="w-full max-w-md h-36">
                <line x1="30" y1="15" x2="30" y2="135" stroke="#35393D" strokeWidth="1" />
                <line x1="30" y1="135" x2="300" y2="135" stroke="#35393D" strokeWidth="1" />
                {/* Histogram Bars in Teal / Emerald */}
                <rect x="45" y="125" width="18" height="10" fill="#10b981" opacity="0.8" />
                <rect x="67" y="105" width="18" height="30" fill="#10b981" opacity="0.8" />
                <rect x="89" y="70" width="18" height="65" fill="#10b981" opacity="0.8" />
                <rect x="111" y="45" width="18" height="90" fill="#10b981" opacity="0.8" />
                <rect x="133" y="30" width="18" height="105" fill="#10b981" opacity="0.8" />
                <rect x="155" y="50" width="18" height="85" fill="#10b981" opacity="0.8" />
                <rect x="177" y="75" width="18" height="60" fill="#10b981" opacity="0.8" />
                <rect x="199" y="100" width="18" height="35" fill="#10b981" opacity="0.8" />
                <rect x="221" y="115" width="18" height="20" fill="#10b981" opacity="0.8" />
                <rect x="243" y="125" width="18" height="10" fill="#10b981" opacity="0.8" />
                <rect x="265" y="130" width="18" height="5" fill="#10b981" opacity="0.8" />

                {/* Fitted distribution curve */}
                <path
                  d="M 45 130 Q 133 15 155 45 T 280 132"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                />
              </svg>
              <div className="text-[10px] text-[#929BA3] font-mono mt-1">
                Token Prediction Shannon Entropy Density
              </div>
            </div>
          </div>

          {/* Quadrant 3: Weibull Distribution Error Spread (Sequence Drift) */}
          <div className="bg-[#1C1F22] border border-[#35393D] rounded-sm p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#35393D]">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-[#f59e0b]" />
                <h3 className="text-xs font-semibold text-[#D9DEE2] font-mono uppercase tracking-wider">
                  Weibull Failure Risk Distribution (Sequence Drift)
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#929BA3] bg-[#101214] border border-[#35393D] px-1.5 py-0.5 rounded-sm">
                k=1.82, λ=420 tok
              </span>
            </div>

            <div className="bg-[#101214] rounded-sm border border-[#35393D] p-3 flex flex-col items-center">
              <svg viewBox="0 0 320 160" className="w-full max-w-md h-36">
                <line x1="30" y1="15" x2="30" y2="135" stroke="#35393D" strokeWidth="1" />
                <line x1="30" y1="135" x2="300" y2="135" stroke="#35393D" strokeWidth="1" />
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
              <div className="text-[10px] text-[#929BA3] font-mono mt-1">
                Failure Probability Hazard Rate over Generated Token Length
              </div>
            </div>
          </div>

          {/* Quadrant 4: Post-Hoc Temperature Scaling Config */}
          <div className="bg-[#1C1F22] border border-[#35393D] rounded-sm p-4 space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#35393D]">
              <div className="flex items-center gap-1.5 font-semibold text-[#D9DEE2] font-mono">
                <Sliders className="w-3.5 h-3.5 text-[#8b5cf6]" />
                <span>POST-HOC TEMPERATURE SCALING (PLATT)</span>
              </div>
              <span className="text-[10px] font-mono text-[#8b5cf6] bg-[#8b5cf6]/10 px-1.5 py-0.5 rounded-sm border border-[#8b5cf6]/30">
                T = {temperatureScale.toFixed(2)}
              </span>
            </div>

            <p className="text-[#929BA3] text-[11px] leading-relaxed">
              Minimizes NLL on validation logits <span className="font-mono text-[#D9DEE2]">p_i = softmax(z_i / T)</span> without altering argmax accuracy rankings.
            </p>

            <div className="space-y-2 bg-[#101214] p-3 rounded-sm border border-[#35393D]">
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="text-[#929BA3]">Temperature Scaling Parameter (T)</span>
                <span className="text-[#06b6d4] font-bold">{temperatureScale.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.5"
                step="0.01"
                value={temperatureScale}
                onChange={(e) => setTemperatureScale(parseFloat(e.target.value))}
                className="w-full accent-[#06b6d4] cursor-pointer"
              />
              <div className="flex justify-between text-[9px] font-mono text-[#687179]">
                <span>Underconfident (T=0.5)</span>
                <span>Uncalibrated (T=1.0)</span>
                <span>Overconfident Mitigation (T=2.5)</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center font-mono">
              <div className="p-2 bg-[#101214] rounded-sm border border-[#35393D]">
                <span className="text-[10px] text-[#687179] block">Unscaled ECE</span>
                <span className="text-sm font-bold text-[#ef4444]">0.0842</span>
              </div>
              <div className="p-2 bg-[#101214] rounded-sm border border-[#35393D]">
                <span className="text-[10px] text-[#687179] block">Calibrated ECE</span>
                <span className="text-sm font-bold text-[#10b981]">
                  {(0.0842 / (temperatureScale > 1 ? temperatureScale * 1.4 : 1)).toFixed(4)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inactive Gate Modal [501] */}
      <Modal
        isOpen={isGateModalOpen}
        onClose={() => setIsGateModalOpen(false)}
        title="Reliability Calibration Gate [501]"
        subtitle="Automated calibration sweeps activate in Phase 8."
      >
        <div className="space-y-3 text-xs font-mono text-[#D9DEE2]">
          <p className="leading-relaxed font-sans text-[#929BA3]">
            Statistical calibration formulas and sweep topologies are loaded into the diagnostic engine. Active logit extraction and automated temperature optimization sweeps will activate in Phase 8.
          </p>
          <div className="p-3 rounded-sm bg-[#101214] border border-[#35393D] text-[11px] space-y-1">
            <div className="text-[#687179]">// Inactivity Guard Status</div>
            <div>
              POST /api/v1/modules/reliability/execute →{' '}
              <span className="text-[#f59e0b] font-semibold">501 Not Implemented</span>
            </div>
            <div>Phase Target: Phase 8 (Reliability, Drift & Calibration)</div>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
};
