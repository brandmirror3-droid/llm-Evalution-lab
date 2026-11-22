import React, { useState } from 'react';
import { Tabs, TabItem } from '../../components/ui/Tabs';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import {
  FlaskConical,
  PlaySquare,
  AlertTriangle,
  BookmarkCheck,
  FolderOpen,
  Plus,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface ResearchWorkspaceProps {
  onNewExperiment?: () => void;
}

export const ResearchWorkspace: React.FC<ResearchWorkspaceProps> = ({ onNewExperiment }) => {
  const [activeTab, setActiveTab] = useState('experiments');

  const tabs: TabItem[] = [
    { id: 'experiments', label: 'Recent Experiments', count: 0 },
    { id: 'evaluations', label: 'Evaluation Runs', count: 0 },
    { id: 'failures', label: 'Failure Cases', count: 0 },
    { id: 'benchmarks', label: 'Saved Sessions', count: 0 },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-lg">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FolderOpen className="w-4 h-4 text-slate-400" />
          <h3 className="text-xs font-semibold text-slate-900 tracking-tight">
            Research Activity & Workbench
          </h3>
        </div>
        <Link to="/playground">
          <Button variant="outline" size="xs" icon={<Plus className="w-3 h-3" />}>
            Configure in Playground
          </Button>
        </Link>
      </div>

      <div className="px-4 pt-2 border-b border-slate-100 bg-slate-50/50">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} idPrefix="workspace-tab" />
      </div>

      <div className="p-4">
        {activeTab === 'experiments' && (
          <EmptyState
            icon={<FlaskConical className="w-4 h-4" />}
            title="No experiments yet"
            description="Create your first experiment to compare prompts, model configurations and evaluation results."
            enablingPhase="Phase 2: Model Playground & Integration"
            actionLabel="Create experiment"
            onAction={onNewExperiment}
          />
        )}

        {activeTab === 'evaluations' && (
          <EmptyState
            icon={<PlaySquare className="w-4 h-4" />}
            title="No evaluation runs yet"
            description="Batch evaluations and judge models will run here across your test datasets."
            enablingPhase="Phase 4: Evaluation & Scoring Engine"
          />
        )}

        {activeTab === 'failures' && (
          <EmptyState
            icon={<AlertTriangle className="w-4 h-4 text-amber-500" />}
            title="No failure incidents logged"
            description="Captured hallucinations, reasoning lapses, and format constraint violations will appear here."
            enablingPhase="Phase 6: Failure Analysis & Error Intelligence"
          />
        )}

        {activeTab === 'benchmarks' && (
          <EmptyState
            icon={<BookmarkCheck className="w-4 h-4" />}
            title="No saved benchmark sessions"
            description="Saved runs across academic benchmarks (MMLU, GSM8K, HumanEval) will be cataloged here."
            enablingPhase="Phase 3: Benchmark & Dataset Engine"
          />
        )}
      </div>
    </div>
  );
};
