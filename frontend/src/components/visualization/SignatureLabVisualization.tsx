import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { IntelligencePulseCanvas } from './IntelligencePulseCanvas';
import { Activity } from 'lucide-react';

interface StageSpec {
  id: string;
  number: string;
  name: string;
  phase: string;
  description: string;
  components: string[];
}

const STAGES: StageSpec[] = [
  {
    id: 'input',
    number: '01',
    name: 'INPUT',
    phase: 'Phase 3 Target',
    description: 'Dataset ingestion, few-shot prompt formulation, system constraints, and input token conditioning.',
    components: ['Prompt Templates', 'JSONL/CSV Ingestion', 'Adversarial Splits'],
  },
  {
    id: 'model',
    number: '02',
    name: 'MODEL',
    phase: 'Phase 2 Target',
    description: 'Multi-provider execution harness connecting to weights, APIs, local models, and parameter configurations.',
    components: ['Streaming Adapters', 'Token Telemetry', 'Temperature Sweeps'],
  },
  {
    id: 'eval',
    number: '03',
    name: 'EVALUATION',
    phase: 'Phase 4 Target',
    description: 'Automated evaluation rubrics, deterministic code execution, and calibrated LLM-as-a-judge pipelines.',
    components: ['Schema Validation', 'Semantic Similarity', 'Judge Calibration'],
  },
  {
    id: 'insight',
    number: '04',
    name: 'INSIGHTS',
    phase: 'Phase 6+ Target',
    description: 'Root-cause error clustering, refusal diagnosis, logprob calibration, and comparative Pareto intelligence.',
    components: ['Error Taxonomy', 'ECE Calibration Curves', 'Win-Rate Matrices'],
  },
];

export const SignatureLabVisualization: React.FC = () => {
  const [selectedStage, setSelectedStage] = useState<StageSpec>(STAGES[0]);

  return (
    <Card className="overflow-hidden border-lab-border">
      <CardHeader
        title="The Intelligence Pulse — Core System Architecture"
        subtitle="Ambient conceptual representation of the evaluation lifecycle: Input → Model → Evaluation → Insights."
        icon={<Activity className="w-4 h-4 text-sky-600" />}
        action={
          <Badge variant="verified" size="xs">
            Visual Identity
          </Badge>
        }
      />

      <CardContent className="p-0">
        {/* Dynamic Canvas Area */}
        <div className="relative border-b border-lab-borderSubtle bg-lab-bg/80">
          <IntelligencePulseCanvas
            variant="hero"
            showLabels={true}
            interactive={true}
          />

          {/* Transparent Watermark Label */}
          <div className="absolute bottom-3 left-4 text-[10px] font-mono text-lab-text-faint flex items-center gap-2 pointer-events-none">
            <span className="w-1.5 h-1.5 rounded-full bg-lab-accent-lime/60 animate-ping" />
            <span>Harmonic Lifecycle Stream</span>
            <span className="text-neutral-700">|</span>
            <span>Zero Simulated Execution</span>
          </div>
        </div>

        {/* Stage Navigation & Details */}
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {STAGES.map((stage) => {
              const isSelected = selectedStage.id === stage.id;
              return (
                <button
                  key={stage.id}
                  onClick={() => setSelectedStage(stage)}
                  className={`p-3 rounded-lg text-left transition-all border ${
                    isSelected
                      ? 'bg-lab-surface border-lab-accent-lime/60 shadow-glowLime'
                      : 'bg-lab-card/60 hover:bg-lab-surface border-lab-borderSubtle hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] text-lab-accent-lime">
                      {stage.number}
                    </span>
                    <span className="font-mono text-[9px] text-lab-text-faint">
                      {stage.phase}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-lab-text-primary tracking-tight">
                    {stage.name}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Stage Detail Panel */}
          <div className="p-4 rounded-xl bg-lab-surface/60 border border-lab-borderSubtle flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs">
            <div className="space-y-1 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-lab-text-primary">
                  {selectedStage.number} {selectedStage.name}
                </span>
                <span className="text-lab-text-faint">•</span>
                <span className="text-lab-text-muted">{selectedStage.phase}</span>
              </div>
              <p className="text-lab-text-secondary text-[11px] leading-relaxed">
                {selectedStage.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 shrink-0">
              {selectedStage.components.map((comp, idx) => (
                <span
                  key={idx}
                  className="font-mono text-[10px] text-lab-text-muted bg-lab-bg px-2 py-0.5 rounded border border-lab-borderSubtle"
                >
                  {comp}
                </span>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
