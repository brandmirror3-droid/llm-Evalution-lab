import React, { useState } from 'react';
import {
  Terminal,
  Layers,
  CheckCircle2,
  Play,
  RotateCcw,
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
  status: 'in_progress' | 'completed' | 'queued';
  runtime: string;
  tokens: string;
}

const RUN_QUEUE: RunTask[] = [
  { id: 'FA0354', name: 'gemma-3-4b-pg19-distill', model: 'gemma-3-4b', status: 'completed', runtime: '12m 44s', tokens: '1.4M' },
  { id: 'FA0380', name: 'sinktune-w256-eval', model: 'gemma-3-4b', status: 'completed', runtime: '18m 10s', tokens: '2.1M' },
  { id: 'FA0373', name: 'gatetune-w256-eval', model: 'gemma-3-4b', status: 'completed', runtime: '14m 02s', tokens: '1.8M' },
  { id: 'FA0376', name: 'multiseed-full-train-s42', model: 'gemma-3-4b', status: 'completed', runtime: '44m 19s', tokens: '8.4M' },
  { id: 'FA0317', name: 'multiseed-full-train-s123', model: 'gemma-3-4b', status: 'completed', runtime: '42m 55s', tokens: '8.1M' },
  { id: 'FA0206', name: 'optimize-gatetune-w256', model: 'gemma-3-4b', status: 'in_progress', runtime: '28m 34s', tokens: '5.2M' },
  { id: 'FA0292', name: 'gatetune-vs-sinktune-acc', model: 'gemma-3-4b', status: 'queued', runtime: '--', tokens: '--' },
  { id: 'FA0334', name: 'mechanistic-gate-variability', model: 'gemma-3-4b', status: 'queued', runtime: '--', tokens: '--' },
  { id: 'FA0306', name: 'prefill-throughput-bench', model: 'gemma-3-4b', status: 'queued', runtime: '--', tokens: '--' },
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

  const selectedRun = RUN_QUEUE.find((r) => r.id === selectedRunId) || RUN_QUEUE[5];
  const dbStatus = statusOverview?.subsystems?.database;
  const isDbOperational = dbStatus?.status === 'operational';

  // 6 clusters of 16 dots (4x4)
  const computeClusters = [
    { name: 'Cluster 01 [Core Inference]', activeCount: 14 },
    { name: 'Cluster 02 [Evaluator Judges]', activeCount: 11 },
    { name: 'Cluster 03 [Telemetry & Traces]', activeCount: 9 },
    { name: 'Cluster 04 [Vector Embeddings]', activeCount: 10 },
    { name: 'Cluster 05 [Failure Attribution]', activeCount: 8 },
    { name: 'Cluster 06 [Async Buffer Pool]', activeCount: 12 },
  ];

  return (
    <div className="space-y-3 font-sans text-slate-200">
      {/* Research Facility Control Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-1 pb-2 border-b border-slate-800/80 font-mono">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
            <h2 className="text-xs sm:text-sm font-bold text-slate-100 uppercase tracking-wider">
              Research Activity & Workbench
            </h2>
          </div>
          <span className="text-[11px] text-slate-400 font-sans leading-normal">
            Systematically measure accuracy, detect hallucinations, and evaluate foundation models across empirical testing suites.
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onRefresh}
            className="p-1 rounded bg-[#101622] hover:bg-[#162030] border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title="Refresh Live Telemetry"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-sky-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main 3-Column Instrument Surface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 items-stretch min-h-[620px]">
        {/* ======================================================== */}
        {/* LEFT COLUMN: Run Queue & Active Task Selector (~20% width) */}
        {/* ======================================================== */}
        <div className="lg:col-span-2 bg-[#0c111a] border border-slate-800 rounded-lg flex flex-col justify-between overflow-hidden shadow-sm">
          <div>
            {/* Run Filter Tabs */}
            <div className="p-2 border-b border-slate-800/80 flex items-center justify-between bg-[#080c14]">
              <div className="flex items-center gap-1 w-full bg-[#111724] p-0.5 rounded border border-slate-800">
                <button
                  onClick={() => setRunTab('in_progress')}
                  className={`flex-1 py-1 text-[10px] font-mono rounded transition-colors ${
                    runTab === 'in_progress'
                      ? 'bg-sky-500/20 text-sky-300 font-semibold border border-sky-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  In Progress (1)
                </button>
                <button
                  onClick={() => setRunTab('completed')}
                  className={`flex-1 py-1 text-[10px] font-mono rounded transition-colors ${
                    runTab === 'completed'
                      ? 'bg-sky-500/20 text-sky-300 font-semibold border border-sky-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Completed (5)
                </button>
              </div>
            </div>

            {/* Run ID List */}
            <div className="p-2 space-y-1.5 overflow-y-auto max-h-[520px]">
              {RUN_QUEUE.filter((r) => (runTab === 'in_progress' ? r.status !== 'completed' : r.status === 'completed')).map(
                (run) => {
                  const isSelected = run.id === selectedRunId;
                  return (
                    <button
                      key={run.id}
                      onClick={() => setSelectedRunId(run.id)}
                      className={`w-full text-left px-3 py-2 rounded font-mono text-xs transition-all flex items-center justify-between border ${
                        isSelected
                          ? 'bg-[#142033] border-sky-500/80 text-sky-200 shadow-[0_0_12px_rgba(56,189,248,0.15)] ring-1 ring-sky-400/30'
                          : 'bg-[#101622] border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            run.status === 'in_progress'
                              ? 'bg-sky-400 animate-pulse shadow-[0_0_6px_rgba(56,189,248,0.8)]'
                              : run.status === 'completed'
                              ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]'
                              : 'bg-slate-600'
                          }`}
                        />
                        <span className="font-semibold">{run.id}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 uppercase">{run.status === 'in_progress' ? 'RUNNING' : run.status}</span>
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {/* Bottom Manual / Auto Toggle */}
          <div className="p-2.5 border-t border-slate-800/80 bg-[#080c14] flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-500">EXEC_MODE</span>
            <div className="flex items-center gap-1.5 bg-[#111724] p-0.5 rounded border border-slate-800">
              <button
                onClick={() => setIsAutoMode(false)}
                className={`px-2 py-0.5 rounded text-[10px] transition-colors ${
                  !isAutoMode ? 'bg-slate-800 text-slate-100 font-semibold' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                Manual
              </button>
              <button
                onClick={() => setIsAutoMode(true)}
                className={`px-2 py-0.5 rounded text-[10px] flex items-center gap-1 transition-colors ${
                  isAutoMode ? 'bg-sky-500/20 text-sky-300 font-semibold border border-sky-500/40' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                Auto
              </button>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* CENTER COLUMN: Research Agenda & Step Trace (~50% width)  */}
        {/* ======================================================== */}
        <div className="lg:col-span-6 bg-[#0c111a] border border-slate-800 rounded-lg flex flex-col justify-between overflow-hidden shadow-sm">
          <div className="p-4 space-y-3.5">
            {/* Agenda Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-sky-400" />
                <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider font-mono">
                  Research Experiment Plan — [{selectedRun.id}: {selectedRun.name}]
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400 bg-[#111724] px-2 py-0.5 rounded border border-slate-800">
                10 Phases Tracked
              </span>
            </div>

            {/* Step Trace List (Direct match to Image 7 reference) */}
            <div className="space-y-2 text-xs font-mono">
              {/* Step 1 */}
              <div className="flex items-start justify-between p-2 rounded bg-[#101622]/60 border border-slate-800/60">
                <span className="text-slate-300">1. Dependencies Installation & Project Structure Initialization</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
                  Completed
                </span>
              </div>

              {/* Step 2 */}
              <div className="flex items-start justify-between p-2 rounded bg-[#101622]/60 border border-slate-800/60">
                <span className="text-slate-300">2. Teacher Upper Bound: Original Gemma 3 4B at W0=1024 on PG19</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
                  Completed
                </span>
              </div>

              {/* Step 3 */}
              <div className="flex items-start justify-between p-2 rounded bg-[#101622]/60 border border-slate-800/60">
                <span className="text-slate-300">3. Naive Window Shrink: Gemma 3 4B at W=256 (No Adapter) on PG19</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
                  Completed
                </span>
              </div>

              {/* Step 4 */}
              <div className="flex items-start justify-between p-2 rounded bg-[#101622]/60 border border-slate-800/60">
                <span className="text-slate-300">4. SinkTune Adapter at W=256 on Gemma 3 4B (PG19 Distillation)</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
                  Completed
                </span>
              </div>

              {/* Step 5 */}
              <div className="flex items-start justify-between p-2 rounded bg-[#101622]/60 border border-slate-800/60">
                <span className="text-slate-300">5. GateTune Adapter at W=256 on Gemma 3 4B (PG19 Distillation)</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
                  Completed
                </span>
              </div>

              {/* Step 6 — ACTIVE RUNNING STEP */}
              <div className="p-2.5 rounded bg-[#142033] border border-sky-500/80 shadow-[0_0_12px_rgba(56,189,248,0.12)] space-y-2">
                <div className="flex items-start justify-between">
                  <span className="text-sky-200 font-semibold">
                    6. Optimize: GateTune Adapter at W=256 on Gemma 3 4B (PG19 Distillation)
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-950/80 text-sky-300 border border-sky-500/50 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
                    Running
                  </span>
                </div>

                {/* Substeps */}
                <div className="pl-4 border-l border-sky-500/30 space-y-1.5 text-[11px] text-slate-300 pt-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Phase 3: Multi-seed full training (best config, seeds 42/123/456) - all succeeded</span>
                  </div>
                  <div className="flex items-center gap-2 text-sky-300 font-medium">
                    <span className="w-3.5 h-3.5 rounded-full border border-sky-400 border-t-transparent animate-spin shrink-0" />
                    <span>Phase 4: Full PG19 test evaluation (4 GPUs) for all 3 seeds</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <span className="w-3.5 h-3.5 rounded-full border border-slate-700 shrink-0" />
                    <span>Phase 5: Record results, write summary, update README, git commit</span>
                  </div>
                </div>
              </div>

              {/* Queued Future Steps */}
              <div className="flex items-start justify-between p-2 rounded bg-[#0e141f] border border-slate-800/40 text-slate-500">
                <span>7. GateTune vs SinkTune Effectiveness Assessment</span>
                <span className="text-[10px]">Queued</span>
              </div>
              <div className="flex items-start justify-between p-2 rounded bg-[#0e141f] border border-slate-800/40 text-slate-500">
                <span>8. Mechanistic Diagnostics: Gate Variability and Sink Usage Analysis</span>
                <span className="text-[10px]">Queued</span>
              </div>
              <div className="flex items-start justify-between p-2 rounded bg-[#0e141f] border border-slate-800/40 text-slate-500">
                <span>9. Window Size Sensitivity: GateTune vs SinkTune at W=128 and W=512</span>
                <span className="text-[10px]">Queued</span>
              </div>
              <div className="flex items-start justify-between p-2 rounded bg-[#0e141f] border border-slate-800/40 text-slate-500">
                <span>10. Prefill Throughput Benchmarking</span>
                <span className="text-[10px]">Queued</span>
              </div>
            </div>
          </div>

          {/* Plan Footer status */}
          <div className="p-3 border-t border-slate-800/80 bg-[#080c14] flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>TARGET_MODEL: <span className="text-slate-200">Gemma-3-4B-Instruct</span></span>
            <span>EVAL_SET: <span className="text-slate-200">PG-19 / W=256</span></span>
            <span>SEEDS: <span className="text-sky-400">[42, 123, 456]</span></span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: Live Telemetry & Compute Units (~30% width) */}
        {/* ======================================================== */}
        <div className="lg:col-span-4 bg-[#0c111a] border border-slate-800 rounded-lg flex flex-col justify-between overflow-hidden shadow-sm">
          {/* Top Console Stream */}
          <div className="p-3.5 space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-sky-400" />
                <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider font-mono">
                  Execution Telemetry Stream
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                LIVE_PIPE
              </span>
            </div>

            {/* Console Output Block */}
            <div className="bg-[#080c14] p-2.5 rounded border border-slate-800/90 font-mono text-[10.5px] text-slate-300 space-y-2 h-[220px] overflow-y-auto leading-relaxed select-text">
              <div className="text-sky-400 font-semibold flex items-center justify-between">
                <span>❯ Train Service get</span>
                <span className="text-slate-500">23:38:12</span>
              </div>
              <p className="text-slate-400">
                The NCCL abort suggests the first seed evaluation finished (NCCL teardown between accelerate launches). Verifying log checkpoint...
              </p>

              <div className="p-1.5 rounded bg-[#111724] border border-slate-800 space-y-0.5 text-slate-300">
                <div className="text-slate-500 text-[9.5px]">✓ Read .train_service_logs/dic1s9lclltjt9ft/output.log (11s)</div>
                <div className="text-slate-400">❯ Bash: Grep (Seed|PPL|results saved|done)</div>
                <div className="text-emerald-400 font-semibold">
                  Seed 42 completed: PPL@32k = 10.7041 (Loss: 2.3708, Acc: 84.1%)
                </div>
              </div>

              <div className="text-sky-400 font-semibold flex items-center justify-between pt-1">
                <span>❯ Seed 123 evaluation running</span>
                <span className="text-slate-500">23:50:04</span>
              </div>
              <p className="text-slate-400">
                Chunk 54/60 processed. Perplexity delta: <span className="text-emerald-400">-0.142</span> vs baseline.
              </p>
            </div>

            {/* Middle Section: Semicircular Hardware Gauges */}
            <div className="pt-2 border-t border-slate-800/80">
              <div className="grid grid-cols-2 gap-3">
                {/* Gauge 1: Used Compute Units */}
                <div className="p-2.5 rounded bg-[#080c14] border border-slate-800 flex flex-col items-center justify-center">
                  <div className="relative w-24 h-14 flex items-end justify-center">
                    <svg viewBox="0 0 100 55" className="w-24 h-14 overflow-visible">
                      <path
                        d="M 10 50 A 40 40 0 0 1 90 50"
                        fill="none"
                        stroke="#1e293b"
                        strokeWidth="8"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 10 50 A 40 40 0 0 1 76 20"
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="8"
                        strokeLinecap="round"
                        className="shadow-[0_0_8px_rgba(56,189,248,0.5)]"
                      />
                    </svg>
                    <span className="absolute bottom-1 font-mono font-bold text-base text-slate-100">154</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase mt-1">Used GPUs / Units</span>
                </div>

                {/* Gauge 2: Utilization % */}
                <div className="p-2.5 rounded bg-[#080c14] border border-slate-800 flex flex-col items-center justify-center">
                  <div className="relative w-24 h-14 flex items-end justify-center">
                    <svg viewBox="0 0 100 55" className="w-24 h-14 overflow-visible">
                      <path
                        d="M 10 50 A 40 40 0 0 1 90 50"
                        fill="none"
                        stroke="#1e293b"
                        strokeWidth="8"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 10 50 A 40 40 0 0 1 68 25"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="8"
                        strokeLinecap="round"
                        className="shadow-[0_0_8px_rgba(52,211,153,0.5)]"
                      />
                    </svg>
                    <span className="absolute bottom-1 font-mono font-bold text-base text-slate-100">62%</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase mt-1">Cluster Utilization</span>
                </div>
              </div>
            </div>

            {/* Compute Units 4x4 Dot Matrix (6 Clusters) */}
            <div className="pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase">GPU Compute Units (6 Clusters)</span>
                <div className="flex items-center gap-2 text-[9px] font-mono">
                  <span className="flex items-center gap-1 text-sky-400">
                    <span className="w-1.5 h-1.5 rounded-sm bg-sky-400" /> Active
                  </span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <span className="w-1.5 h-1.5 rounded-sm bg-[#1e293b]" /> Idle
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-6 gap-2 bg-[#080c14] p-2.5 rounded border border-slate-800">
                {computeClusters.map((cluster, cIdx) => (
                  <div key={cIdx} className="grid grid-cols-4 gap-1 p-1 bg-[#111724] rounded border border-slate-800/60" title={cluster.name}>
                    {Array.from({ length: 16 }).map((_, dotIdx) => {
                      const isActive = dotIdx < cluster.activeCount;
                      return (
                        <div
                          key={dotIdx}
                          className={`w-1.5 h-1.5 rounded-sm transition-all ${
                            isActive
                              ? 'bg-sky-400 shadow-[0_0_4px_rgba(56,189,248,0.7)]'
                              : 'bg-[#1e293b]'
                          }`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Infrastructure Health Indicator */}
          <div className="p-3 border-t border-slate-800/80 bg-[#080c14] flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400">STORAGE_STATUS:</span>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isDbOperational ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]' : 'bg-amber-400'}`} />
              <span className={isDbOperational ? 'text-emerald-300 font-semibold' : 'text-amber-400'}>
                {isDbOperational ? 'POSTGRES_OPERATIONAL' : 'OFFLINE (AWAITING_MIGRATION)'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* BOTTOM PERSISTENT RESEARCH TIMELINE BAR (Direct from Image 7) */}
      {/* ======================================================== */}
      <div className="bg-[#0c111a] border border-slate-800 rounded-lg p-3 px-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm font-mono select-none">
        {/* Left Gauges */}
        <div className="flex items-center gap-5 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full border border-slate-700 bg-[#080c14] flex items-center justify-center font-bold text-xs text-sky-400">
              425
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 uppercase">Hypothesis</span>
              <span className="text-xs font-semibold text-slate-200">Cataloged</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full border border-slate-700 bg-[#080c14] flex items-center justify-center font-bold text-xs text-emerald-400">
              159
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 uppercase">Benchmark</span>
              <span className="text-xs font-semibold text-slate-200">Papers Ref</span>
            </div>
          </div>
        </div>

        {/* Center Timeline Scrubber */}
        <div className="flex-1 max-w-xl w-full flex flex-col items-center gap-1">
          <div className="text-sm font-bold text-slate-100 tracking-wider">
            T+ 404:54:15
          </div>
          <div className="w-full relative flex items-center">
            <div className="w-2.5 h-2.5 rounded-full border-2 border-sky-400 bg-[#090d14] z-10 shrink-0" />
            <div className="flex-1 h-0.5 bg-slate-700 relative mx-1">
              <div className="absolute left-0 top-0 bottom-0 w-[68%] bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.7)]" />
              <div className="absolute left-[68%] -top-1 w-2.5 h-2.5 rounded-full border-2 border-sky-400 bg-sky-200 shadow-[0_0_8px_rgba(56,189,248,1)]" />
            </div>
            <div className="w-2.5 h-2.5 rounded-full border-2 border-slate-600 bg-[#090d14] z-10 shrink-0" />
          </div>
          <div className="w-full flex justify-between text-[9px] text-slate-500">
            <span>Launched (P1)</span>
            <span className="text-sky-400 font-semibold">Hypothesis x400 (Active)</span>
            <span>Target (P12)</span>
          </div>
        </div>

        {/* Right Metrics */}
        <div className="flex items-center gap-6 shrink-0">
          <div className="text-right">
            <div className="text-xs font-bold text-slate-100">20.8B</div>
            <div className="text-[10px] text-slate-500 uppercase">Tokens Tracked</div>
          </div>

          <div className="text-right">
            <div className="text-xs font-bold text-slate-100">$179K</div>
            <div className="text-[10px] text-slate-500 uppercase">Compute Budget</div>
          </div>

          <button
            onClick={onNewExperiment}
            className="px-3 py-1.5 rounded bg-sky-500 hover:bg-sky-400 active:bg-sky-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Launch Experiment</span>
          </button>
        </div>
      </div>
    </div>
  );
};
