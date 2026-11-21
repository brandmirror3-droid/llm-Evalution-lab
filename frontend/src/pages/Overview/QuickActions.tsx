import React, { useState } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  Terminal,
  Gauge,
  CheckSquare,
  AlertOctagon,
  ArrowRight,
  Info,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface ActionItem {
  id: string;
  title: string;
  description: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  phaseNumber: number;
  phaseTitle: string;
  details: string;
}

const QUICK_ACTIONS: ActionItem[] = [
  {
    id: 'launch-playground',
    title: 'Model Playground',
    description: '3-pane configurable scientific instrument for prompt iteration and parameter tuning.',
    path: '/playground',
    icon: Terminal,
    phaseNumber: 2,
    phaseTitle: 'Model Playground & Integration',
    details: 'Configures system instructions, prompt variations, and hyperparameter controls across multiple provider models. Scheduled for Phase 2.',
  },
  {
    id: 'explore-benchmarks',
    title: 'Benchmark Engine',
    description: 'Standardized evaluation suites (MMLU-Pro, GSM8K, ARC, HumanEval) with score tables.',
    path: '/benchmarks',
    icon: Gauge,
    phaseNumber: 3,
    phaseTitle: 'Benchmark & Dataset Engine',
    details: 'Executes academic and custom evaluation suites with batch concurrency and reproducible seed matrices. Scheduled for Phase 3.',
  },
  {
    id: 'configure-evaluators',
    title: 'Evaluation Engines',
    description: 'Deterministic validators, semantic distance scorers, and calibrated LLM judges.',
    path: '/evaluators',
    icon: CheckSquare,
    phaseNumber: 4,
    phaseTitle: 'Evaluation & Scoring Engine',
    details: 'Configures exact match, regex assertions, JSON schema compliance, and multi-metric LLM-as-a-judge rubrics. Scheduled for Phase 4.',
  },
  {
    id: 'failure-investigation',
    title: 'Failure Analysis',
    description: '3-column root-cause investigation workspace for hallucinations and refusal modes.',
    path: '/failure-analysis',
    icon: AlertOctagon,
    phaseNumber: 6,
    phaseTitle: 'Failure Analysis & Error Intelligence',
    details: 'Automated clustering of error categories, refusal diagnosis, and cross-model failure patterns. Scheduled for Phase 6.',
  },
];

export const QuickActions: React.FC = () => {
  const [selectedAction, setSelectedAction] = useState<ActionItem | null>(null);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
          Scientific Module Launchers
        </h3>
        <span className="text-[11px] text-slate-400 font-mono">
          4 Research Workstations
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
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
                  <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 group-hover:text-sky-600 group-hover:bg-sky-50 group-hover:border-sky-200 transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <Badge variant="not_implemented" size="xs">
                    Phase {action.phaseNumber}
                  </Badge>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-sky-950 transition-colors">
                    {action.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed line-clamp-2">
                    {action.description}
                  </p>
                </div>

                <div className="pt-1 flex items-center gap-1.5 text-[11px] font-medium text-slate-400 group-hover:text-sky-600 transition-colors">
                  <span>Explore specifications</span>
                  <ArrowRight className="w-3 h-3 transition-transform duration-150 group-hover:translate-x-1" />
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
          subtitle={`Roadmap Milestone: Phase ${selectedAction.phaseNumber} (${selectedAction.phaseTitle})`}
          footer={
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="xs" onClick={() => setSelectedAction(null)}>
                Close
              </Button>
              <Link to={selectedAction.path}>
                <Button variant="primary" size="xs" icon={<ArrowRight className="w-3 h-3" />}>
                  Navigate to {selectedAction.title}
                </Button>
              </Link>
            </div>
          }
        >
          <div className="space-y-3.5 text-xs text-slate-600">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/90 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900">
                  {selectedAction.phaseTitle}
                </span>
                <Badge variant="pending" size="xs">
                  Phase {selectedAction.phaseNumber}
                </Badge>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                {selectedAction.details}
              </p>
            </div>

            <div className="flex items-start gap-2.5 text-slate-500 text-[11px] leading-relaxed p-3 bg-white rounded-lg border border-slate-200">
              <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>
                In strict compliance with Phase 1 design guidelines, fake model executions and dummy runs are disabled. The page provides a fully interactive ergonomic preview of the future instrument.
              </span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
