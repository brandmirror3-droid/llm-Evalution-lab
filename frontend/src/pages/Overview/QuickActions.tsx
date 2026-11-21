import React, { useState } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import {
  FlaskConical,
  Play,
  Gauge,
  Scale,
  ArrowRight,
  Info,
} from 'lucide-react';

interface ActionItem {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  phaseNumber: number;
  phaseTitle: string;
  details: string;
}

const QUICK_ACTIONS: ActionItem[] = [
  {
    id: 'create-experiment',
    title: 'Create Experiment',
    description: 'Track prompt iterations, temperature variations, and output artifacts.',
    icon: FlaskConical,
    phaseNumber: 2,
    phaseTitle: 'Model Playground & Integration',
    details: 'The experiment tracking service will log hyperparameters, prompt variations, and lineage. Scheduled for implementation in Phase 2.',
  },
  {
    id: 'run-evaluation',
    title: 'Run Evaluation',
    description: 'Execute automated scoring rubrics, code checks, or judge models.',
    icon: Play,
    phaseNumber: 4,
    phaseTitle: 'Evaluation & Scoring Engine',
    details: 'The evaluation runner executes model responses through deterministic code tests and LLM-as-a-Judge rubrics. Scheduled for Phase 4.',
  },
  {
    id: 'explore-benchmarks',
    title: 'Explore Benchmarks',
    description: 'Inspect standardized research datasets (MMLU, GSM8K, ARC, HumanEval).',
    icon: Gauge,
    phaseNumber: 3,
    phaseTitle: 'Benchmark & Dataset Engine',
    details: 'The benchmark catalog and automated suite execution harness will arrive in Phase 3. No synthetic scores are shown prematurely.',
  },
  {
    id: 'compare-models',
    title: 'Compare Models',
    description: 'Perform side-by-side win-rate analysis and Pareto frontier graphing.',
    icon: Scale,
    phaseNumber: 8,
    phaseTitle: 'Model Intelligence & Comparative Analytics',
    details: 'Model comparison analytics calculate Bradley-Terry win rates, cost vs. accuracy tradeoffs, and intelligence radar plots in Phase 8.',
  },
];

export const QuickActions: React.FC = () => {
  const [selectedAction, setSelectedAction] = useState<ActionItem | null>(null);

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-mono font-semibold text-lab-text-muted uppercase tracking-wider">
        Quick Action Entry Points
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <Card
              key={action.id}
              hoverable
              onClick={() => setSelectedAction(action)}
              className="group transition-all"
            >
              <CardContent className="space-y-3 p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-lab-surface border border-lab-border flex items-center justify-center text-lab-text-secondary group-hover:text-lab-accent-lime group-hover:scale-105 group-hover:border-lab-accent-lime/40 transition-all duration-200 ease-apple">
                    <Icon className="w-4 h-4" />
                  </div>
                  <Badge variant="not_implemented" size="xs">
                    Phase {action.phaseNumber}
                  </Badge>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-lab-text-primary group-hover:text-white transition-colors duration-150">
                    {action.title}
                  </h4>
                  <p className="text-[11px] text-lab-text-muted mt-1 leading-relaxed line-clamp-2">
                    {action.description}
                  </p>
                </div>

                <div className="pt-1 flex items-center gap-1.5 text-[11px] font-mono text-lab-text-faint group-hover:text-lab-accent-lime transition-colors duration-150">
                  <span>View roadmap specs</span>
                  <ArrowRight className="w-3 h-3 transition-transform duration-200 ease-apple group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Action Roadmap Info Modal */}
      {selectedAction && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedAction(null)}
          title={selectedAction.title}
          subtitle={`Planned entry point for Roadmap Phase ${selectedAction.phaseNumber}.`}
        >
          <div className="space-y-4 text-xs text-lab-text-secondary">
            <div className="p-3.5 bg-neutral-900 rounded-xl border border-neutral-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-lab-text-primary">
                  {selectedAction.phaseTitle}
                </span>
                <Badge variant="pending" size="xs">
                  Phase {selectedAction.phaseNumber}
                </Badge>
              </div>
              <p className="text-neutral-400 text-[11px] leading-relaxed">
                {selectedAction.details}
              </p>
            </div>

            <div className="flex items-start gap-2.5 text-lab-text-muted text-[11px] leading-relaxed p-2.5 bg-lab-surface/50 rounded-lg border border-lab-borderSubtle">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                In adherence to Phase 1 engineering guidelines, mock wizards and fake execution buttons are disabled. Real model execution will be implemented in Phase 2.
              </span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
