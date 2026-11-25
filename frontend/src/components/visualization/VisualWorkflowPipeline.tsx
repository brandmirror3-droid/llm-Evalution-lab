import React, { useState } from 'react';
import {
  Cpu,
  CheckCircle2,
  BarChart3,
  FileCheck,
  Sliders,
  Search,
  ChevronDown,
  ChevronRight,
  Plus,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Database,
  GitBranch,
} from 'lucide-react';

interface CanvasNode {
  id: string;
  name: string;
  category: string;
  x: number;
  y: number;
  inputs: string[];
  outputs: string[];
  params: Record<string, string>;
  description: string;
}

const INITIAL_NODES: CanvasNode[] = [
  {
    id: 'node-dataset',
    name: 'Ex Machina Dataset',
    category: 'Input Data',
    x: 40,
    y: 80,
    inputs: [],
    outputs: ['Dataset'],
    params: { 'Corpus': 'gsm8k_math_eval', 'Format': 'JSONL', 'Rows': '1,319' },
    description: 'Ingests ground-truth evaluation corpora and splits data into validation partitions.',
  },
  {
    id: 'node-prompt',
    name: 'Prompt Builder & Scaler',
    category: 'Transform',
    x: 280,
    y: 70,
    inputs: ['Dataset'],
    outputs: ['Prompts'],
    params: { 'Template': 'system_eval_strict_v2', 'FewShot': 'k=3 shots', 'Schema': 'Strict JSON' },
    description: 'Interpolates dataset items into evaluation prompt templates with few-shot exemplars.',
  },
  {
    id: 'node-inference',
    name: 'Model Inference Engine',
    category: 'Model Inference',
    x: 520,
    y: 70,
    inputs: ['Prompts'],
    outputs: ['Completions', 'Latency_ms'],
    params: { 'Model': 'gpt-4o', 'Temperature': '0.20', 'MaxTokens': '2048' },
    description: 'Dispatches prompts to target model endpoints with streaming token capture.',
  },
  {
    id: 'node-judge',
    name: 'LLM Multi-Metric Judge',
    category: 'Evaluator',
    x: 760,
    y: 30,
    inputs: ['Completions'],
    outputs: ['Scores'],
    params: { 'Judge': 'claude-3-5-sonnet', 'Rubric': 'G-Eval Correctness', 'Scale': '1..5' },
    description: 'Evaluates model responses against reference solutions using structured grading rubrics.',
  },
  {
    id: 'node-failure',
    name: 'Failure Classifier',
    category: 'Analyze',
    x: 760,
    y: 130,
    inputs: ['Completions'],
    outputs: ['Incidents'],
    params: { 'Taxonomy': 'Hallucination & Refusal', 'DiffMethod': 'LCS Token Diff' },
    description: 'Identifies error categories, attribution patterns, and safety constraint violations.',
  },
  {
    id: 'node-output',
    name: 'Pipeline Output Sink',
    category: 'Output Data',
    x: 1000,
    y: 80,
    inputs: ['Scores', 'Incidents'],
    outputs: [],
    params: { 'Format': 'JSON Manifest', 'Pareto': 'Accuracy vs Cost', 'Lineage': 'sha256' },
    description: 'Aggregates evaluation scores and generates verifiable research manifests.',
  },
];

const NODE_LIBRARY = [
  {
    category: 'Input Data',
    icon: Database,
    items: ['Ex Machina Dataset', 'Corpus Stream', 'CSV Ingestion'],
  },
  {
    category: 'Transform',
    icon: Sliders,
    items: ['Prompt Builder', 'Standard Scaler', 'Stop Sequence Filter'],
  },
  {
    category: 'Model Inference',
    icon: Cpu,
    items: ['Model Inference Engine', 'Model Router', 'Ensemble Dispatcher'],
  },
  {
    category: 'Evaluator',
    icon: CheckCircle2,
    items: ['LLM Multi-Metric Judge', 'Exact Match Evaluator', 'JSON Schema Checker'],
  },
  {
    category: 'Analyze',
    icon: BarChart3,
    items: ['Failure Classifier', 'Statistical Variance', 'Weibull Drift Analyzer'],
  },
  {
    category: 'Output Data',
    icon: FileCheck,
    items: ['Pipeline Output Sink', 'Artifact Manifest', 'Experiment Exporter'],
  },
];

export const VisualWorkflowPipeline: React.FC = () => {
  const [nodes] = useState<CanvasNode[]>(INITIAL_NODES);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-inference');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [searchLibrary, setSearchLibrary] = useState<string>('');
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    'Input Data': true,
    'Transform': true,
    'Model Inference': true,
    'Evaluator': true,
    'Analyze': true,
    'Output Data': true,
  });

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[2];

  const toggleCategory = (cat: string) => {
    setOpenCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  return (
    <div className="bg-[#1C1F22] border border-[#35393D] rounded-sm overflow-hidden font-mono select-none shadow-sm flex flex-col">
      {/* C3 AI Canvas Top Header Bar (Directly matching Reference 03 Ex Machina) */}
      <div className="h-9 px-3 border-b border-[#35393D] bg-[#17191B] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-[#111315] border border-[#35393D] text-[#D9DEE2] font-semibold text-[11px]">
            <GitBranch className="w-3 h-3 text-cyan-400" />
            <span>ML pipeline</span>
          </div>
          <button className="p-1 rounded-sm hover:bg-[#232629] text-[#929BA3] hover:text-[#D9DEE2]" title="New Pipeline">
            <Plus className="w-3 h-3" />
          </button>
          <span className="text-[#35393D] mx-1">|</span>
          <span className="text-[10px] text-[#687179] hidden md:inline">
            Version 1: active topology design (Phase 1 Baseline)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Memory Indicator */}
          <div className="text-[10px] text-[#929BA3] px-2 py-0.5 rounded-sm bg-[#111315] border border-[#35393D]">
            <span>Memory Used: </span>
            <span className="text-emerald-400 font-semibold">0% of 32G</span>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-0.5 bg-[#111315] p-0.5 rounded-sm border border-[#35393D]">
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 10, 60))}
              className="p-1 rounded-sm hover:bg-[#232629] text-[#929BA3] hover:text-[#D9DEE2]"
              title="Zoom Out"
            >
              <ZoomOut className="w-2.5 h-2.5" />
            </button>
            <span className="text-[9px] px-1 text-[#D9DEE2] min-w-[32px] text-center font-mono">
              {zoomLevel}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 10, 140))}
              className="p-1 rounded-sm hover:bg-[#232629] text-[#929BA3] hover:text-[#D9DEE2]"
              title="Zoom In"
            >
              <ZoomIn className="w-2.5 h-2.5" />
            </button>
            <button
              onClick={() => setZoomLevel(100)}
              className="p-1 rounded-sm hover:bg-[#232629] text-[#929BA3] hover:text-[#D9DEE2]"
              title="Reset Zoom"
            >
              <RotateCcw className="w-2.5 h-2.5" />
            </button>
          </div>

          <button className="px-2 py-0.5 rounded-sm bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-[10px] transition-colors">
            Publish pipeline
          </button>
        </div>
      </div>

      {/* Main Canvas Area: Left Library + Center Canvas + Right Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[380px]">
        {/* ======================================================== */}
        {/* LEFT PANEL: C3 AI Component Library (~20% width) */}
        {/* ======================================================== */}
        <div className="lg:col-span-3 border-r border-[#35393D] bg-[#17191B] flex flex-col justify-between">
          <div>
            {/* Search Nodes */}
            <div className="p-2 border-b border-[#35393D]">
              <div className="relative">
                <Search className="w-3 h-3 text-[#687179] absolute left-2 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search nodes..."
                  value={searchLibrary}
                  onChange={(e) => setSearchLibrary(e.target.value)}
                  className="w-full bg-[#111315] border border-[#35393D] rounded-sm pl-7 pr-2 py-1 text-[10px] text-[#D9DEE2] placeholder-[#687179] focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
            </div>

            {/* Accordion Categories */}
            <div className="divide-y divide-[#2A2D31] max-h-[320px] overflow-y-auto text-[11px]">
              {NODE_LIBRARY.map((cat) => {
                const Icon = cat.icon;
                const isOpen = openCategories[cat.category];
                return (
                  <div key={cat.category} className="py-0.5">
                    <button
                      onClick={() => toggleCategory(cat.category)}
                      className="w-full px-2.5 py-1 flex items-center justify-between text-[#D9DEE2] hover:bg-[#232629] transition-colors text-left"
                    >
                      <span className="flex items-center gap-1.5 text-[10.5px] font-semibold text-[#D9DEE2]">
                        <Icon className="w-3 h-3 text-cyan-400" />
                        {cat.category}
                      </span>
                      {isOpen ? (
                        <ChevronDown className="w-3 h-3 text-[#687179]" />
                      ) : (
                        <ChevronRight className="w-3 h-3 text-[#687179]" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="pl-6 pr-2 py-0.5 space-y-0.5">
                        {cat.items
                          .filter((i) => i.toLowerCase().includes(searchLibrary.toLowerCase()))
                          .map((item) => (
                            <div
                              key={item}
                              className="px-2 py-1 text-[10px] text-[#929BA3] hover:text-[#D9DEE2] hover:bg-[#1C1F22] rounded-sm cursor-grab active:cursor-grabbing flex items-center justify-between transition-colors"
                            >
                              <span>{item}</span>
                              <span className="text-[8px] text-[#687179] border border-[#35393D] px-1 rounded-sm">
                                NODE
                              </span>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-2 border-t border-[#35393D] text-[9.5px] text-[#687179]">
            Drag &amp; drop nodes to add to pipeline canvas.
          </div>
        </div>

        {/* ======================================================== */}
        {/* CENTER PANEL: Dotted Canvas with Curved Bezier Splines (~60% width) */}
        {/* ======================================================== */}
        <div className="lg:col-span-6 relative c3-canvas-grid min-h-[360px] overflow-x-auto overflow-y-hidden border-r border-[#35393D] flex items-center justify-center">
          <div
            className="relative min-w-[1150px] h-[340px] transition-transform duration-100"
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top left' }}
          >
            {/* SVG Connecting Cables Layer */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              {/* Cable 1: Dataset -> Prompt Builder */}
              <path
                d="M 180 100 C 220 100, 240 90, 280 90"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2"
                strokeDasharray="4,2"
              />
              {/* Cable 2: Prompt Builder -> Model Inference */}
              <path
                d="M 420 90 C 460 90, 480 90, 520 90"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2"
              />
              {/* Cable 3: Model Inference -> LLM Judge */}
              <path
                d="M 660 80 C 700 80, 720 50, 760 50"
                fill="none"
                stroke="#a855f7"
                strokeWidth="2"
              />
              {/* Cable 4: Model Inference -> Failure Classifier */}
              <path
                d="M 660 100 C 700 100, 720 150, 760 150"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2"
              />
              {/* Cable 5: LLM Judge -> Output Sink */}
              <path
                d="M 900 50 C 940 50, 960 90, 1000 90"
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
              />
              {/* Cable 6: Failure Classifier -> Output Sink */}
              <path
                d="M 900 150 C 940 150, 960 110, 1000 110"
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
              />
            </svg>

            {/* Draggable / Clickable Nodes (Directly matching C3 AI Ex Machina Nodes) */}
            {nodes.map((node) => {
              const isSelected = selectedNodeId === node.id;
              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  style={{ left: node.x, top: node.y }}
                  className={`absolute w-36 bg-[#1C1F22] border rounded-sm p-2 cursor-pointer transition-all z-10 shadow-md ${
                    isSelected
                      ? 'border-cyan-400 ring-1 ring-cyan-400/50 bg-[#232629]'
                      : 'border-[#35393D] hover:border-[#454A50] hover:bg-[#202327]'
                  }`}
                >
                  {/* Left Input Port */}
                  {node.inputs.length > 0 && (
                    <span className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#111315] border-2 border-cyan-400" />
                  )}
                  {/* Right Output Port */}
                  {node.outputs.length > 0 && (
                    <span className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-cyan-400 border-2 border-[#111315]" />
                  )}

                  {/* Node Header */}
                  <div className="flex items-center justify-between text-[8px] text-[#687179] uppercase font-bold mb-1">
                    <span>{node.category}</span>
                    <span className="text-cyan-400">●</span>
                  </div>
                  <div className="text-[10px] font-bold text-[#D9DEE2] truncate mb-1">
                    {node.name}
                  </div>

                  {/* Node Param Badges */}
                  <div className="space-y-0.5 pt-1 border-t border-[#2A2D31] text-[8.5px] text-[#929BA3]">
                    {Object.entries(node.params).slice(0, 2).map(([k, v]) => (
                      <div key={k} className="flex justify-between truncate">
                        <span className="text-[#687179]">{k}:</span>
                        <span className="text-[#D9DEE2] truncate ml-1">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Minimap Widget (Bottom Left corner matching C3 AI Ex Machina) */}
            <div className="absolute left-3 bottom-3 w-28 h-18 bg-[#111315]/90 border border-[#35393D] rounded-sm p-1 z-20 pointer-events-none">
              <div className="relative w-full h-full bg-[#17191B] border border-[#2A2D31]">
                {/* Node micro-rectangles in minimap */}
                <div className="absolute left-1 top-3 w-2.5 h-2 bg-cyan-400/80 rounded-xs" />
                <div className="absolute left-6 top-3 w-2.5 h-2 bg-cyan-400/80 rounded-xs" />
                <div className="absolute left-11 top-3 w-2.5 h-2 bg-cyan-400/80 rounded-xs" />
                <div className="absolute left-16 top-1.5 w-2.5 h-2 bg-purple-400/80 rounded-xs" />
                <div className="absolute left-16 top-4.5 w-2.5 h-2 bg-amber-400/80 rounded-xs" />
                <div className="absolute left-21 top-3 w-2.5 h-2 bg-emerald-400/80 rounded-xs" />
                {/* Viewport Frame */}
                <div className="absolute inset-0.5 border border-cyan-400/60 rounded-xs" />
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT PANEL: C3 AI Node Inspector (~25% width) */}
        {/* ======================================================== */}
        <div className="lg:col-span-3 bg-[#17191B] p-3 space-y-3 flex flex-col justify-between">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between pb-1.5 border-b border-[#35393D]">
              <span className="text-[10px] font-bold text-[#D9DEE2] uppercase tracking-wider">
                NODE INSPECTOR
              </span>
              <span className="text-[9px] text-cyan-400 bg-cyan-950/40 px-1 py-0.2 rounded-sm border border-cyan-800/60">
                ACTIVE
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-[11px] font-bold text-[#D9DEE2]">{selectedNode.name}</div>
              <div className="text-[9.5px] text-cyan-400 font-mono">ID: {selectedNode.id}</div>
              <p className="text-[10px] text-[#929BA3] font-sans leading-relaxed pt-1">
                {selectedNode.description}
              </p>
            </div>

            {/* I/O Ports */}
            <div className="space-y-1 text-[10px]">
              <div className="text-[9px] text-[#687179] uppercase font-bold">I/O Ports</div>
              <div className="p-1.5 bg-[#111315] rounded-sm border border-[#35393D] space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#687179]">Inputs:</span>
                  <span className="text-[#D9DEE2]">{selectedNode.inputs.join(', ') || 'None (Source)'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#687179]">Outputs:</span>
                  <span className="text-cyan-300">{selectedNode.outputs.join(', ') || 'None (Sink)'}</span>
                </div>
              </div>
            </div>

            {/* Parameters */}
            <div className="space-y-1 text-[10px]">
              <div className="text-[9px] text-[#687179] uppercase font-bold">Node Parameters</div>
              <div className="p-1.5 bg-[#111315] rounded-sm border border-[#35393D] space-y-1">
                {Object.entries(selectedNode.params).map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-[#687179]">{k}:</span>
                    <span className="text-[#D9DEE2] font-semibold">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-2 bg-[#111315] rounded-sm border border-[#35393D] text-[9px] text-[#687179]">
            Execution Contract: Phase 1 Validated. In Phase 2, this DAG compiles into an async runner pipeline.
          </div>
        </div>
      </div>
    </div>
  );
};
