import React, { useState } from 'react';
import { Badge } from '../ui/Badge';
import {
  FileText,
  Cpu,
  CheckCircle2,
  BarChart3,
  FileCheck,
  ChevronRight,
  Sliders,
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
    id: 'node-input',
    stageNumber: '01',
    type: 'input',
    title: 'Input & Prompts',
    subtitle: 'Golden Datasets & Templates',
    icon: FileText,
    params: [
      { label: 'Dataset', value: 'MMLU-Pro / GSM8K' },
      { label: 'Samples', value: '250 Test Cases' },
      { label: 'Few-Shot', value: '5 Examples' },
    ],
    targetPhase: 'Phase 3 Target',
    description: 'Feeds structured test cases, system prompts, few-shot conditioning, and user inputs into the evaluation pipeline.',
  },
  {
    id: 'node-model',
    stageNumber: '02',
    type: 'model',
    title: 'Model Execution',
    subtitle: 'Multi-Provider Runtime',
    icon: Cpu,
    params: [
      { label: 'Model', value: 'GPT-4o / Claude 3.5' },
      { label: 'Temp', value: '0.2' },
      { label: 'Max Tokens', value: '2,048' },
    ],
    targetPhase: 'Phase 2 Target',
    description: 'Executes inference against target language models with structured latency, per-token logprob tracking, and cost auditing.',
  },
  {
    id: 'node-evaluator',
    stageNumber: '03',
    type: 'evaluator',
    title: 'Evaluator Engines',
    subtitle: 'Deterministic & Judge Rubrics',
    icon: CheckCircle2,
    params: [
      { label: 'Correctness', value: 'Exact / Regex' },
      { label: 'Judge Rubric', value: 'Faithfulness' },
      { label: 'Hallucination', value: 'Citation Check' },
    ],
    targetPhase: 'Phase 4 Target',
    description: 'Applies automated scoring rubrics, Python assertion tests, semantic similarity distances, and calibrated LLM judges.',
  },
  {
    id: 'node-analysis',
    stageNumber: '04',
    type: 'analysis',
    title: 'Analysis & Clustering',
    subtitle: 'Taxonomy & Calibration',
    icon: BarChart3,
    params: [
      { label: 'Error Cluster', value: 'Embedding KNN' },
      { label: 'Calibration', value: 'ECE Curve' },
      { label: 'Win-Rate', value: 'Bradley-Terry' },
    ],
    targetPhase: 'Phase 6+ Target',
    description: 'Aggregates failure cases into automated semantic clusters, derives root causes, and computes confidence calibration diagrams.',
  },
  {
    id: 'node-result',
    stageNumber: '05',
    type: 'result',
    title: 'Evaluation Report',
    subtitle: 'Artifacts & Lineage',
    icon: FileCheck,
    params: [
      { label: 'Accuracy', value: 'Empirical Score' },
      { label: 'Failure Rate', value: 'Error Taxa' },
      { label: 'Artifact', value: 'JSONL Lineage' },
    ],
    targetPhase: 'Phase 4 Target',
    description: 'Generates reproducible research artifacts, versioned experiment records, and differential model comparison reports.',
  },
];

export const VisualWorkflowPipeline: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<WorkflowNode>(WORKFLOW_NODES[0]);

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-card overflow-hidden">
      {/* Header bar */}
      <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-50/50">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Evaluation Workflow Pipeline
            </h3>
            <Badge variant="accent" size="xs">
              Visual Architecture
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Interconnected lifecycle topology: Input → Model → Evaluator → Analysis → Result
          </p>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
          <span className="w-2 h-2 rounded-full bg-sky-500" />
          <span>Pipeline Stage: Conceptual Foundation</span>
        </div>
      </div>

      {/* Workflow Canvas Grid */}
      <div className="p-5 overflow-x-auto bg-slate-50/30">
        <div className="flex items-center gap-3 min-w-[850px] justify-between">
          {WORKFLOW_NODES.map((node, index) => {
            const isSelected = selectedNode.id === node.id;
            const Icon = node.icon;

            return (
              <React.Fragment key={node.id}>
                {/* Node Box */}
                <div
                  onClick={() => setSelectedNode(node)}
                  className={`relative flex-1 p-4 rounded-xl border transition-all cursor-pointer bg-white text-left ${
                    isSelected
                      ? 'border-sky-600 ring-2 ring-sky-500/15 shadow-cardHover'
                      : 'border-slate-200 hover:border-slate-300 hover:shadow-subtle'
                  }`}
                >
                  {/* Top meta */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] font-bold text-slate-400">
                      STAGE {node.stageNumber}
                    </span>
                    <Badge variant={isSelected ? 'accent' : 'default'} size="xs">
                      {node.type.toUpperCase()}
                    </Badge>
                  </div>

                  {/* Title & Icon */}
                  <div className="flex items-start gap-2.5 mb-3">
                    <div
                      className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-sky-50 border-sky-200 text-sky-700'
                          : 'bg-slate-50 border-slate-200 text-slate-500'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 tracking-tight truncate">
                        {node.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 truncate">{node.subtitle}</p>
                    </div>
                  </div>

                  {/* Parameter summary pill tags */}
                  <div className="space-y-1 bg-slate-50/70 p-2 rounded-lg border border-slate-100 text-[10px] font-mono">
                    {node.params.map((p, i) => (
                      <div key={i} className="flex justify-between items-center text-slate-500">
                        <span className="text-slate-400">{p.label}:</span>
                        <span className="font-medium text-slate-700 truncate max-w-[90px]">
                          {p.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Port Connectors */}
                  {index > 0 && (
                    <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 border-slate-300" />
                  )}
                  {index < WORKFLOW_NODES.length - 1 && (
                    <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 border-slate-300" />
                  )}
                </div>

                {/* Arrow Connector between nodes */}
                {index < WORKFLOW_NODES.length - 1 && (
                  <div className="shrink-0 flex items-center text-slate-300">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Selected Node Technical Inspection Drawer */}
      <div className="p-5 border-t border-slate-100 bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs">
        <div className="space-y-1 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">
              Stage {selectedNode.stageNumber}: {selectedNode.title}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-sky-700 font-mono text-[11px] font-medium">
              {selectedNode.targetPhase}
            </span>
          </div>
          <p className="text-slate-600 leading-relaxed text-[11px]">
            {selectedNode.description}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-slate-400" />
            <span>Interactive Node Topology</span>
          </div>
        </div>
      </div>
    </div>
  );
};
