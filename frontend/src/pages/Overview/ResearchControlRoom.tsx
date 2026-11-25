import React, { useState } from 'react';
import {
  Terminal,
  Layers,
  CheckCircle2,
  Play,
  RotateCcw,
  Activity,
  Cpu,
  Database,
  Sliders,
  ShieldCheck,
  FileText,
  Radio,
} from 'lucide-react';
import { LabStatusOverview } from '../../types';

interface ResearchControlRoomProps {
  statusOverview: LabStatusOverview | null;
  isLoading: boolean;
  onRefresh: () => void;
  onNewExperiment: () => void;
}

interface RunTask {
  id: string;
  name: string;
  model: string;
  priority: 'CRITICAL' | 'HIGH' | 'NORMAL';
  status: 'completed' | 'in_progress' | 'queued';
  runtime: string;
  tokens: string;
}

const RUN_QUEUE: RunTask[] = [
  { id: 'FA0354', name: 'gemma-3-4b-pg19-distill', model: 'gemma-3-4b', priority: 'HIGH', status: 'completed', runtime: '12m 44s', tokens: '1.4M' },
  { id: 'FA0380', name: 'sinktune-w256-eval', model: 'gemma-3-4b', priority: 'NORMAL', status: 'completed', runtime: '18m 10s', tokens: '2.1M' },
  { id: 'FA0373', name: 'gatetune-w256-eval', model: 'gemma-3-4b', priority: 'HIGH', status: 'completed', runtime: '14m 02s', tokens: '1.8M' },
  { id: 'FA0376', name: 'multiseed-full-train-s42', model: 'gemma-3-4b', priority: 'NORMAL', status: 'completed', runtime: '44m 19s', tokens: '8.4M' },
  { id: 'FA0317', name: 'multiseed-full-train-s123', model: 'gemma-3-4b', priority: 'NORMAL', status: 'completed', runtime: '42m 55s', tokens: '8.1M' },
  { id: 'FA0206', name: 'optimize-gatetune-w256', model: 'gemma-3-4b', priority: 'CRITICAL', status: 'in_progress', runtime: '28m 34s', tokens: '5.2M' },
  { id: 'FA0292', name: 'gatetune-vs-sinktune-acc', model: 'gemma-3-4b', priority: 'HIGH', status: 'queued', runtime: '--', tokens: '--' },
  { id: 'FA0334', name: 'mechanistic-gate-variability', model: 'gemma-3-4b', priority: 'NORMAL', status: 'queued', runtime: '--', tokens: '--' },
  { id: 'FA0306', name: 'prefill-throughput-bench', model: 'gemma-3-4b', priority: 'NORMAL', status: 'queued', runtime: '--', tokens: '--' },
];

export const ResearchControlRoom: React.FC<ResearchControlRoomProps> = ({
  statusOverview,
  isLoading,
  onRefresh,
  onNewExperiment,
}) => {
  const [selectedRunId, setSelectedRunId] = useState('FA0206');
  const [runTab, setRunTab] = useState<'in_progress' | 'completed'>('in_progress');
  const [isAutoMode, setIsAutoMode] = useState(true);
  const [activeChannel, setActiveChannel] = useState<'A' | 'B' | 'C' | 'D'>('A');

  const selectedRun = RUN_QUEUE.find((r) => r.id === selectedRunId) || RUN_QUEUE[5];
  const dbStatus = statusOverview?.subsystems?.database;
  const isDbOperational = dbStatus?.status === 'operational';

  return (
    <div className="space-y-2.5 font-mono text-[#D9DEE2]">
      {/* Research Facility Control Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-1 pb-2 border-b border-[#35393D]">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-sm bg-cyan-400" />
            <h2 className="text-xs sm:text-sm font-bold text-[#D9DEE2] uppercase tracking-wider">
              Research Activity & Workbench
            </h2>
          </div>
          <span className="text-[11px] text-[#929BA3] font-sans">
            Systematically measure accuracy, detect hallucinations, and evaluate foundation models across empirical testing suites.
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onRefresh}
            className="p-1 rounded-sm bg-[#1C1F22] hover:bg-[#232629] border border-[#35393D] text-[#929BA3] hover:text-[#D9DEE2] transition-colors"
            title="Refresh System Telemetry"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main 3-Column Instrument Surface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 items-stretch min-h-[640px]">
        {/* ======================================================== */}
        {/* LEFT COLUMN: Run Queue & Active Task Selector (~22% width) */}
        {/* ======================================================== */}
        <div className="lg:col-span-3 bg-[#1C1F22] border border-[#35393D] rounded-sm flex flex-col justify-between overflow-hidden">
          <div>
            {/* Run Filter Tabs */}
            <div className="p-2 border-b border-[#35393D] flex items-center justify-between bg-[#17191B]">
              <div className="flex items-center gap-1 w-full bg-[#111315] p-0.5 rounded-sm border border-[#35393D]">
                <button
                  onClick={() => setRunTab('in_progress')}
                  className={`flex-1 py-1 text-[10px] uppercase font-semibold transition-colors ${
                    runTab === 'in_progress'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'text-[#929BA3] hover:text-[#D9DEE2]'
                  }`}
                >
                  Active ({RUN_QUEUE.filter((r) => r.status !== 'completed').length})
                </button>
                <button
                  onClick={() => setRunTab('completed')}
                  className={`flex-1 py-1 text-[10px] uppercase font-semibold transition-colors ${
                    runTab === 'completed'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'text-[#929BA3] hover:text-[#D9DEE2]'
                  }`}
                >
                  Completed ({RUN_QUEUE.filter((r) => r.status === 'completed').length})
                </button>
              </div>
            </div>

            {/* Run Queue Item List */}
            <div className="divide-y divide-[#2A2D31] max-h-[380px] overflow-y-auto">
              {RUN_QUEUE.filter((r) =>
                runTab === 'in_progress' ? r.status !== 'completed' : r.status === 'completed'
              ).map((run) => {
                const isSelected = selectedRunId === run.id;
                return (
                  <div
                    key={run.id}
                    onClick={() => setSelectedRunId(run.id)}
                    className={`p-2 cursor-pointer transition-colors text-[11px] ${
                      isSelected
                        ? 'bg-cyan-500/10 border-l-2 border-cyan-400 text-cyan-200'
                        : 'hover:bg-[#232629] text-[#929BA3]'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono">
                      <span className="font-bold text-[#D9DEE2]">{run.id}</span>
                      <span
                        className={`text-[9px] px-1 py-0.2 rounded-sm ${
                          run.priority === 'CRITICAL'
                            ? 'bg-red-950/50 text-red-400 border border-red-800/60'
                            : run.priority === 'HIGH'
                            ? 'bg-amber-950/50 text-amber-400 border border-amber-800/60'
                            : 'bg-[#111315] text-[#929BA3] border border-[#35393D]'
                        }`}
                      >
                        {run.priority}
                      </span>
                    </div>
                    <div className="text-[10px] text-[#D9DEE2] truncate mt-0.5">{run.name}</div>
                    <div className="flex items-center justify-between text-[9px] text-[#687179] mt-1 font-mono">
                      <span>{run.model}</span>
                      <span>{run.runtime}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Task Details Inspector */}
          <div className="p-2.5 bg-[#17191B] border-t border-[#35393D] text-[10px] space-y-1.5">
            <div className="flex items-center justify-between text-[#929BA3]">
              <span>ACTIVE HARNESS:</span>
              <span className="text-cyan-400 font-bold">{selectedRun.id}</span>
            </div>
            <div className="p-2 bg-[#111315] rounded-sm border border-[#35393D] space-y-1 text-[#929BA3]">
              <div className="flex justify-between">
                <span>Model:</span>
                <span className="text-[#D9DEE2]">{selectedRun.model}</span>
              </div>
              <div className="flex justify-between">
                <span>Priority:</span>
                <span className="text-amber-400">{selectedRun.priority}</span>
              </div>
              <div className="flex justify-between">
                <span>Tokens Est:</span>
                <span className="text-[#D9DEE2]">{selectedRun.tokens}</span>
              </div>
              <div className="flex justify-between">
                <span>Scheduler:</span>
                <span className={isAutoMode ? 'text-cyan-400' : 'text-[#929BA3]'}>
                  {isAutoMode ? 'AUTO_DISPATCH' : 'MANUAL_STEP'}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => setIsAutoMode(!isAutoMode)}
                className="text-[9px] px-2 py-0.5 rounded-sm bg-[#232629] hover:bg-[#35393D] text-[#D9DEE2] border border-[#35393D]"
              >
                MODE: {isAutoMode ? 'AUTO' : 'MANUAL'}
              </button>
              <button
                onClick={onNewExperiment}
                className="text-[9px] px-2 py-0.5 rounded-sm bg-cyan-600 hover:bg-cyan-500 text-white font-semibold flex items-center gap-1"
              >
                <Play className="w-2.5 h-2.5" />
                QUEUE RUN
              </button>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* CENTER COLUMN: Agenda Trace + OriginPro Paired Comparison Plot (~50% width) */}
        {/* ======================================================== */}
        <div className="lg:col-span-6 bg-[#1C1F22] border border-[#35393D] rounded-sm flex flex-col justify-between overflow-hidden">
          {/* Header */}
          <div className="p-2.5 border-b border-[#35393D] bg-[#17191B] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-xs font-semibold text-[#D9DEE2] uppercase tracking-wider">
                RESEARCH AGENDA & SCIENTIFIC WORKBENCH
              </span>
            </div>
            <span className="text-[10px] text-[#929BA3] bg-[#111315] px-1.5 py-0.5 rounded-sm border border-[#35393D]">
              PHASE_01: ACTIVE [STEP 01/10]
            </span>
          </div>

          <div className="p-3 space-y-3 flex-1 overflow-y-auto">
            {/* Numbered Agenda Trace */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-bold text-[#929BA3] uppercase tracking-wider flex items-center justify-between">
                <span>Execution Agenda Trace</span>
                <span className="text-emerald-400 text-[9px]">STEP 1 VERIFIED • CORE OPERATIONAL</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
                <div className="p-2 rounded-sm bg-[#17191B] border border-emerald-800/60 flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-emerald-300">Phase 1: Lab Foundation & Shell</div>
                    <div className="text-[9px] text-[#929BA3]">FastAPI core probes, React shell, dark research design system.</div>
                  </div>
                </div>

                <div className="p-2 rounded-sm bg-[#17191B] border border-cyan-800/60 flex items-start gap-2">
                  <Activity className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5 animate-pulse" />
                  <div>
                    <div className="font-semibold text-cyan-300">Phase 2: Playground & Orchestration</div>
                    <div className="text-[9px] text-[#929BA3]">Multi-provider streaming runner & prompt testing harness.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* OriginPro Scientific Graph (Directly matching Reference 01: Multi-Panel Paired Comparison) */}
            <div className="bg-[#101214] border border-[#35393D] rounded-sm p-3 space-y-2">
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-semibold text-[#D9DEE2] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-sm bg-purple-400" />
                  ORIGINPRO PAIRED COMPARISON PLOT [SAMPLE VALIDATION CORPUS]
                </span>
                <span className="text-[#687179] text-[9px]">Graph306: Layer 1 (Lines) + Layer 2 (Mean±SE)</span>
              </div>

              {/* Multi-series SVG Plot */}
              <div className="h-44 w-full bg-[#101214] border border-[#2A2D31] rounded-sm relative flex items-center justify-center p-2">
                <svg viewBox="0 0 460 160" className="w-full h-full">
                  {/* Grid Lines */}
                  <line x1="40" y1="15" x2="440" y2="15" stroke="#232629" strokeWidth="1" strokeDasharray="2,2" />
                  <line x1="40" y1="50" x2="440" y2="50" stroke="#232629" strokeWidth="1" strokeDasharray="2,2" />
                  <line x1="40" y1="85" x2="440" y2="85" stroke="#232629" strokeWidth="1" strokeDasharray="2,2" />
                  <line x1="40" y1="120" x2="440" y2="120" stroke="#232629" strokeWidth="1" strokeDasharray="2,2" />
                  
                  {/* Axes */}
                  <line x1="40" y1="15" x2="40" y2="135" stroke="#454A50" strokeWidth="1" />
                  <line x1="40" y1="135" x2="440" y2="135" stroke="#454A50" strokeWidth="1" />

                  {/* Y Axis Tick Labels */}
                  <text x="32" y="20" textAnchor="end" fontSize="8" fill="#687179" fontFamily="monospace">0.20</text>
                  <text x="32" y="55" textAnchor="end" fontSize="8" fill="#687179" fontFamily="monospace">0.15</text>
                  <text x="32" y="90" textAnchor="end" fontSize="8" fill="#687179" fontFamily="monospace">0.10</text>
                  <text x="32" y="125" textAnchor="end" fontSize="8" fill="#687179" fontFamily="monospace">0.05</text>
                  <text x="32" y="138" textAnchor="end" fontSize="8" fill="#687179" fontFamily="monospace">0.00</text>

                  {/* Layer 2: Mean ± SE Bars */}
                  <rect x="90" y="85" width="40" height="50" fill="#dc2626" opacity="0.8" />
                  <line x1="110" y1="75" x2="110" y2="85" stroke="#ffffff" strokeWidth="1.5" />
                  <line x1="102" y1="75" x2="118" y2="75" stroke="#ffffff" strokeWidth="1.5" />

                  <rect x="230" y="98" width="40" height="37" fill="#0891b2" opacity="0.8" />
                  <line x1="250" y1="90" x2="250" y2="98" stroke="#ffffff" strokeWidth="1.5" />
                  <line x1="242" y1="90" x2="258" y2="90" stroke="#ffffff" strokeWidth="1.5" />

                  <rect x="370" y="92" width="40" height="43" fill="#cbd5e1" opacity="0.8" />
                  <line x1="390" y1="83" x2="390" y2="92" stroke="#ffffff" strokeWidth="1.5" />
                  <line x1="382" y1="83" x2="398" y2="83" stroke="#ffffff" strokeWidth="1.5" />

                  {/* Layer 1: 3-point Line Series with Markers */}
                  {/* Series 1 (Red) */}
                  <polyline points="110,35 250,68 390,62" fill="none" stroke="#ef4444" strokeWidth="1.5" />
                  <circle cx="110" cy="35" r="3" fill="#ef4444" stroke="#ffffff" strokeWidth="1" />
                  <circle cx="250" cy="68" r="3" fill="#ef4444" stroke="#ffffff" strokeWidth="1" />
                  <circle cx="390" cy="62" r="3" fill="#ef4444" stroke="#ffffff" strokeWidth="1" />

                  {/* Series 2 (Cyan) */}
                  <polyline points="110,65 250,78 390,70" fill="none" stroke="#06b6d4" strokeWidth="1.5" />
                  <circle cx="110" cy="65" r="3" fill="#06b6d4" stroke="#ffffff" strokeWidth="1" />
                  <circle cx="250" cy="78" r="3" fill="#06b6d4" stroke="#ffffff" strokeWidth="1" />
                  <circle cx="390" cy="70" r="3" fill="#06b6d4" stroke="#ffffff" strokeWidth="1" />

                  {/* Series 3 (Amber) */}
                  <polyline points="110,82 250,96 390,118" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
                  <circle cx="110" cy="82" r="3" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />
                  <circle cx="250" cy="96" r="3" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />
                  <circle cx="390" cy="118" r="3" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />

                  {/* Statistical Significance Bracket (OriginPro ** bracket) */}
                  <path d="M 110,60 L 110,50 L 250,50 L 250,60" fill="none" stroke="#929BA3" strokeWidth="1" />
                  <text x="180" y="47" textAnchor="middle" fontSize="9" fill="#D9DEE2" fontFamily="monospace">**</text>

                  {/* X Axis Labels */}
                  <text x="110" y="150" textAnchor="middle" fontSize="8.5" fill="#929BA3" fontFamily="monospace">Test Epoch 1</text>
                  <text x="250" y="150" textAnchor="middle" fontSize="8.5" fill="#929BA3" fontFamily="monospace">Test Epoch 2</text>
                  <text x="390" y="150" textAnchor="middle" fontSize="8.5" fill="#929BA3" fontFamily="monospace">Test Epoch 3</text>
                </svg>
              </div>

              {/* OriginPro Notes Box */}
              <div className="p-2 bg-[#17191B] border border-[#2A2D31] rounded-sm text-[9.5px] text-[#929BA3] space-y-0.5">
                <div className="font-semibold text-emerald-400 flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  Scientific Plotting Notes:
                </div>
                <div>
                  Upper Layer: 3-point line series tracking individual checkpoint loss divergence. Lower Layer: Mean ± SE bars of empirical variance. Asterisk brackets indicate p &lt; 0.01 significance across evaluation epochs.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: Oscilloscope Instrument Pane + Subsystems (~28% width) */}
        {/* ======================================================== */}
        <div className="lg:col-span-3 bg-[#1C1F22] border border-[#35393D] rounded-sm flex flex-col justify-between overflow-hidden">
          {/* Header */}
          <div className="p-2.5 border-b border-[#35393D] bg-[#17191B] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-xs font-semibold text-[#D9DEE2] uppercase tracking-wider">
                INSTRUMENT TELEMETRY
              </span>
            </div>
            <span className="text-[9px] text-emerald-400 bg-emerald-950/40 px-1 py-0.2 rounded-sm border border-emerald-800/60 font-semibold">
              RUNNING
            </span>
          </div>

          <div className="p-2.5 space-y-3 flex-1 overflow-y-auto">
            {/* PicoScope Oscilloscope Interface (Directly matching Reference 02) */}
            <div className="bg-[#101214] border border-[#35393D] rounded-sm p-2 space-y-2">
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-bold text-[#D9DEE2]">PicoScope 7 T&amp;M — Signal Scope</span>
                <span className="text-[#687179] font-mono text-[9px]">500 μs/div • 97.7 kS</span>
              </div>

              {/* Channel Selector Buttons */}
              <div className="grid grid-cols-4 gap-1 text-[9px] font-mono">
                {(['A', 'B', 'C', 'D'] as const).map((ch) => (
                  <button
                    key={ch}
                    onClick={() => setActiveChannel(ch)}
                    className={`py-0.5 rounded-sm border text-center transition-colors ${
                      activeChannel === ch
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500 font-bold'
                        : 'bg-[#17191B] text-[#929BA3] border-[#35393D]'
                    }`}
                  >
                    CH-{ch}
                  </button>
                ))}
              </div>

              {/* Black Oscilloscope Plot Surface with Grid */}
              <div className="h-32 w-full oscilloscope-grid border border-[#2A2D31] rounded-sm relative overflow-hidden flex items-center justify-center">
                <svg viewBox="0 0 240 120" className="w-full h-full">
                  {/* Oscilloscope Center Crosshair */}
                  <line x1="0" y1="60" x2="240" y2="60" stroke="#35393D" strokeWidth="1" strokeDasharray="3,3" />
                  <line x1="120" y1="0" x2="120" y2="120" stroke="#35393D" strokeWidth="1" strokeDasharray="3,3" />

                  {/* Channel A Signal: Sine Wave Trace */}
                  {activeChannel === 'A' && (
                    <path
                      d="M 0 60 Q 30 15 60 60 T 120 60 T 180 60 T 240 60"
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="1.5"
                    />
                  )}

                  {/* Channel B Signal: Token Stream Pulse */}
                  {activeChannel === 'B' && (
                    <path
                      d="M 0 60 L 30 60 L 30 25 L 70 25 L 70 95 L 110 95 L 110 60 L 150 60 L 150 30 L 190 30 L 190 60 L 240 60"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="1.5"
                    />
                  )}

                  {/* Channel C Signal: Latency Step Trace */}
                  {activeChannel === 'C' && (
                    <path
                      d="M 0 90 L 50 85 L 100 55 L 150 40 L 200 35 L 240 32"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="1.5"
                    />
                  )}

                  {/* Channel D Signal: Error Spike */}
                  {activeChannel === 'D' && (
                    <path
                      d="M 0 60 L 90 60 L 95 15 L 100 105 L 105 60 L 240 60"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="1.5"
                    />
                  )}

                  {/* Axis scale marks */}
                  <text x="4" y="12" fill="#687179" fontSize="7" fontFamily="monospace">+1.0 V</text>
                  <text x="4" y="65" fill="#687179" fontSize="7" fontFamily="monospace">0.0 V</text>
                  <text x="4" y="115" fill="#687179" fontSize="7" fontFamily="monospace">-1.0 V</text>
                  <text x="210" y="115" fill="#687179" fontSize="7" fontFamily="monospace">2.5 ms</text>
                </svg>
              </div>

              <div className="flex items-center justify-between text-[9px] text-[#929BA3] font-mono">
                <span>Scale: ±1.0 V</span>
                <span className="text-cyan-400">Trigger: 0 V Auto</span>
                <span>Time: 500 μs</span>
              </div>
            </div>

            {/* Subsystem Diagnostics Panel */}
            <div className="p-2 bg-[#17191B] rounded-sm border border-[#35393D] space-y-1.5 text-[10px]">
              <div className="flex items-center justify-between font-bold text-[#D9DEE2]">
                <span>FACILITY SUBSYSTEMS:</span>
                <span className="text-emerald-400">PHASE 1 READY</span>
              </div>

              <div className="space-y-1 text-[#929BA3]">
                <div className="flex items-center justify-between py-0.5 border-b border-[#2A2D31]">
                  <span className="flex items-center gap-1">
                    <Cpu className="w-3 h-3 text-purple-400" />
                    Runtime Engine:
                  </span>
                  <span className="text-[#D9DEE2]">Python 3.14.6</span>
                </div>

                <div className="flex items-center justify-between py-0.5 border-b border-[#2A2D31]">
                  <span className="flex items-center gap-1">
                    <Database className="w-3 h-3 text-cyan-400" />
                    PostgreSQL Pool:
                  </span>
                  <span className={isDbOperational ? 'text-emerald-400' : 'text-amber-400'}>
                    {isDbOperational ? 'OPERATIONAL' : 'STANDBY (AWAITING)'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-0.5 border-b border-[#2A2D31]">
                  <span className="flex items-center gap-1">
                    <Sliders className="w-3 h-3 text-amber-400" />
                    Providers:
                  </span>
                  <span className="text-[#D9DEE2]">OpenAI, Anthropic, Gemini</span>
                </div>

                <div className="flex items-center justify-between py-0.5">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    Execution Gate:
                  </span>
                  <span className="text-cyan-300">HTTP_501_ENFORCED</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* BOTTOM AREA: Event Stream & System Console */}
      {/* ======================================================== */}
      <div className="bg-[#1C1F22] border border-[#35393D] rounded-sm p-2.5 space-y-2">
        <div className="flex items-center justify-between text-xs border-b border-[#35393D] pb-1.5 bg-[#17191B] -mx-2.5 -mt-2.5 p-2">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold text-[#D9DEE2] uppercase tracking-wider text-[11px]">
              SYSTEM EVENT STREAM & RESEARCH TRACE CONSOLE
            </span>
          </div>
          <span className="text-[10px] text-[#687179]">EVENT_COUNT: 4 ACTIVE LOGS</span>
        </div>

        <div className="p-2 bg-[#101214] rounded-sm border border-[#2A2D31] font-mono text-[10px] space-y-1 text-[#929BA3] max-h-24 overflow-y-auto">
          <div className="flex gap-2 text-emerald-400">
            <span className="text-[#687179]">[2026-11-23 21:52:01.104]</span>
            <span className="font-bold">[SYS_INIT]</span>
            <span>Laboratory core architecture loaded. FastAPI gateway mounted on /api/v1.</span>
          </div>
          <div className="flex gap-2 text-cyan-300">
            <span className="text-[#687179]">[2026-11-23 21:52:01.112]</span>
            <span className="font-bold">[GATE_CHECK]</span>
            <span>Phase 1 validation passed. Execution routes configured with honest HTTP 501 inactive gates.</span>
          </div>
          <div className="flex gap-2 text-amber-300">
            <span className="text-[#687179]">[2026-11-23 21:52:01.140]</span>
            <span className="font-bold">[DB_PROBE]</span>
            <span>PostgreSQL target pool initialized. Connection awaiting DATABASE_URL configuration.</span>
          </div>
          <div className="flex gap-2 text-[#D9DEE2]">
            <span className="text-[#687179]">[2026-11-23 21:52:01.155]</span>
            <span className="font-bold">[STATION_READY]</span>
            <span>Research workstation active. Interactive node pipeline canvas and telemetry listening.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
