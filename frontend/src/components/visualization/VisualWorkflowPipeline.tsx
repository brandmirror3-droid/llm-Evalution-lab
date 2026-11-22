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
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
      {/* Canvas Header */}
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-xs font-semibold text-slate-900 tracking-tight">
            Evaluation Pipeline Architecture
          </h3>
          <p className="text-[11px] text-slate-500">
            Conceptual five-stage evaluation workflow: Input → Model → Evaluator → Analysis → Result
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
          <Lock className="w-3 h-3 text-slate-400" />
          <span>Phase 1 Architecture</span>
        </div>
      </div>

      {/* Canvas Area with Dot Grid */}
      <div className="relative p-4 sm:p-6 bg-slate-50/60 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] overflow-x-auto">
        <div className="flex items-center justify-between min-w-[760px] gap-2">
          {WORKFLOW_NODES.map((node, index) => {
            const Icon = node.icon;
            const isSelected = selectedNode?.id === node.id;

            return (
              <React.Fragment key={node.id}>
                {/* Node Box */}
                <div
                  onClick={() => setSelectedNode(node)}
                  className={`relative flex-1 p-3 rounded-lg border bg-white cursor-pointer transition-all ${
                    isSelected
                      ? 'border-sky-500 ring-2 ring-sky-100 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 hover:shadow-subtle'
                  }`}
                >
                  {/* Stage number & status */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] text-slate-400 font-semibold">
                      {node.stageNumber}
                    </span>
                    <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-slate-100 text-slate-500">
                      {node.targetPhase.split(' ')[0]}
                    </span>
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-900 truncate">
                        {node.title}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        {node.subtitle}
                      </div>
                    </div>
                  </div>

                  {/* Key parameters */}
                  <div className="space-y-1 pt-1.5 border-t border-slate-100 text-[10px] font-mono text-slate-500">
                    {node.params.slice(0, 2).map((p, i) => (
                      <div key={i} className="flex justify-between truncate">
                        <span className="text-slate-400">{p.label}:</span>
                        <span className="text-slate-700 font-medium truncate ml-1">{p.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Arrow Connector between nodes */}
                {index < WORKFLOW_NODES.length - 1 && (
                  <div className="shrink-0 flex items-center justify-center text-slate-300 px-1">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Selected Node Inspector Drawer (Bottom of canvas) */}
      {selectedNode && (
        <div className="p-4 border-t border-slate-200 bg-white flex flex-col sm:flex-row sm:items-start justify-between gap-4 text-xs">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-mono font-semibold text-sky-600 text-[11px]">
                Stage {selectedNode.stageNumber}:
              </span>
              <h4 className="font-semibold text-slate-900">{selectedNode.title}</h4>
              <span className="text-[10px] font-mono text-slate-400">
                Target: {selectedNode.targetPhase}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed max-w-2xl">
              {selectedNode.description}
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="flex items-center gap-2 font-mono text-[11px] bg-slate-50 px-2.5 py-1.5 rounded border border-slate-200">
              <Sliders className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-700">Schema Verified</span>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="p-1 rounded text-slate-400 hover:text-slate-700 transition-colors"
              title="Close inspection"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-[11px] text-slate-500">
        <span>Click any stage node to inspect its execution parameters and schemas.</span>
        <span className="font-mono text-slate-400">State: Architecture Validated</span>
      </div>
    </div>
  );
};
