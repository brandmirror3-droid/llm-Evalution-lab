import React, { useState } from 'react';
import {
  FileText,
  Cpu,
  CheckCircle2,
  BarChart3,
  FileCheck,
  ChevronRight,
  Sliders,
  X,
  Lock,
} from 'lucide-react';

interface WorkflowNode {
  id: string;
  stageNumber: string;
  type: 'input' | 'model' | 'evaluator' | 'analysis' | 'result';
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  params: { label: string; value: string }[];
  targetPhase: string;
  description: string;
}

const WORKFLOW_NODES: WorkflowNode[] = [
  {
    id: 'stage-1',
    stageNumber: '01',
    type: 'input',
    title: 'Input Stage',
    subtitle: 'Prompt & Dataset',
    icon: FileText,
    params: [
      { label: 'Template', value: 'system_eval_v1' },
      { label: 'Dataset', value: 'gsm8k_reasoning' },
      { label: 'Batch Size', value: 'k=25 samples' },
    ],
    targetPhase: 'Phase 3 (Datasets)',
    description: 'Ingests prompt variations, few-shot demonstration selectors, and dataset splits with strict schema validation.',
  },
  {
    id: 'stage-2',
    stageNumber: '02',
    type: 'model',
    title: 'Model Inference',
    subtitle: 'Execution Harness',
    icon: Cpu,
    params: [
      { label: 'Target Model', value: 'gpt-4o' },
      { label: 'Temperature', value: '0.20' },
      { label: 'Seed', value: '42 (Fixed)' },
    ],
    targetPhase: 'Phase 2 (Playground)',
    description: 'Routes inferences to OpenAI, Anthropic, or local model endpoints with streaming token capture and latency telemetry.',
  },
  {
    id: 'stage-3',
    stageNumber: '03',
    type: 'evaluator',
    title: 'Scoring Engine',
    subtitle: 'Rubrics & Judges',
    icon: CheckCircle2,
    params: [
      { label: 'Judge Model', value: 'claude-3-5-sonnet' },
      { label: 'Metric', value: 'G-Eval Factual' },
      { label: 'Threshold', value: '0.85' },
    ],
    targetPhase: 'Phase 4 (Evaluators)',
    description: 'Applies deterministic regex/schema checks and LLM-as-a-judge rubrics with inter-annotator confidence bounds.',
  },
  {
    id: 'stage-4',
    stageNumber: '04',
    type: 'analysis',
    title: 'Failure Analysis',
    subtitle: 'Error Taxonomy',
    icon: BarChart3,
    params: [
      { label: 'Taxonomy', value: 'Premise Hallucination' },
      { label: 'Diffing', value: 'Token-level LCS' },
      { label: 'Clustering', value: 'Semantic k-means' },
    ],
    targetPhase: 'Phase 6 (Errors)',
    description: 'Groups failures into error clusters (e.g. premise hallucination, false refusal) and synthesizes prompt countermeasures.',
  },
  {
    id: 'stage-5',
    stageNumber: '05',
    type: 'result',
    title: 'Artifact Report',
    subtitle: 'Pareto & Export',
    icon: FileCheck,
    params: [
      { label: 'Report Format', value: 'JSON / CSV' },
      { label: 'Pareto Metric', value: 'Accuracy vs Cost' },
      { label: 'Lineage Hash', value: 'sha256_verified' },
    ],
    targetPhase: 'Phase 8 (Intelligence)',
    description: 'Generates immutable experiment manifests, Pareto frontier efficiency curves, and verified evaluation reports.',
  },
];

export const VisualWorkflowPipeline: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);

  return (
    <div className="bg-[#0c111a] border border-slate-800 rounded-lg overflow-hidden font-sans select-none shadow-sm">
      {/* Canvas Header */}
      <div className="px-4 py-2.5 border-b border-slate-800/80 flex items-center justify-between bg-[#080c14]">
        <div className="flex items-center gap-2">
          <Sliders className="w-3.5 h-3.5 text-sky-400" />
          <div>
            <h3 className="text-xs font-bold text-slate-100 tracking-wider uppercase font-mono">
              Evaluation Pipeline Topology Canvas
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">
              01_INPUT ❯ 02_INFERENCE ❯ 03_EVAL_JUDGE ❯ 04_ERROR_TAXONOMY ❯ 05_ARTIFACT_MANIFEST
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-sky-300 bg-sky-950/40 border border-sky-800/60 px-2 py-0.5 rounded">
          <Lock className="w-3 h-3 text-sky-400" />
          <span>SCHEMA_VALIDATED</span>
        </div>
      </div>

      {/* Canvas Area with Dark Dot Grid */}
      <div className="relative p-4 sm:p-5 bg-[#080c14] bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] overflow-x-auto">
        <div className="flex items-center justify-between min-w-[780px] gap-2">
          {WORKFLOW_NODES.map((node, index) => {
            const Icon = node.icon;
            const isSelected = selectedNode?.id === node.id;

            return (
              <React.Fragment key={node.id}>
                {/* Node Box */}
                <div
                  onClick={() => setSelectedNode(node)}
                  className={`relative flex-1 p-3 rounded border bg-[#0e141f] cursor-pointer transition-all ${
                    isSelected
                      ? 'border-sky-400 bg-[#142033] ring-1 ring-sky-400/40 shadow-[0_0_12px_rgba(56,189,248,0.2)]'
                      : 'border-slate-800 hover:border-slate-700 hover:bg-[#111724]'
                  }`}
                >
                  {/* Visual Node Ports */}
                  <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-slate-700 border border-slate-900" />
                  <span className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-sky-400 border border-slate-900 shadow-[0_0_4px_rgba(56,189,248,0.8)]" />

                  {/* Stage number & status */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] text-sky-400 font-bold">
                      NODE_{node.stageNumber}
                    </span>
                    <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-[#090d14] text-slate-400 border border-slate-800">
                      {node.targetPhase.split(' ')[0]}
                    </span>
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded bg-[#101622] border border-slate-800 flex items-center justify-center text-sky-400 shrink-0">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-100 truncate">
                        {node.title}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono truncate">
                        {node.subtitle}
                      </div>
                    </div>
                  </div>

                  {/* Key parameters */}
                  <div className="space-y-1 pt-1.5 border-t border-slate-800/80 text-[10px] font-mono text-slate-400">
                    {node.params.slice(0, 2).map((p, i) => (
                      <div key={i} className="flex justify-between truncate">
                        <span className="text-slate-500">{p.label}:</span>
                        <span className="text-slate-300 font-medium truncate ml-1">{p.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Arrow Connector between nodes */}
                {index < WORKFLOW_NODES.length - 1 && (
                  <div className="shrink-0 flex items-center justify-center text-slate-600 px-1">
                    <ChevronRight className="w-4 h-4 text-sky-500/70" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Selected Node Inspector Drawer (Bottom of canvas) */}
      {selectedNode && (
        <div className="p-3.5 border-t border-slate-800 bg-[#080c14] flex flex-col sm:flex-row sm:items-start justify-between gap-4 text-xs font-mono">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sky-400 text-[11px]">
                [STAGE_{selectedNode.stageNumber}]
              </span>
              <h4 className="font-semibold text-slate-100">{selectedNode.title}</h4>
              <span className="text-[10px] text-slate-500">
                // Target: {selectedNode.targetPhase}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans leading-relaxed max-w-2xl">
              {selectedNode.description}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2 text-[10px] bg-[#101622] px-2 py-1 rounded border border-slate-800 text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>CONTRACT_VERIFIED</span>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              title="Close inspector"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="px-3.5 py-1.5 border-t border-slate-800/80 bg-[#06090f] flex items-center justify-between text-[10px] font-mono text-slate-500">
        <span>Click node to inspect stage parameters and I/O contracts.</span>
        <span className="text-sky-400">STATE: TOPOLOGY_LOCKED (PHASE_01)</span>
      </div>
    </div>
  );
};
