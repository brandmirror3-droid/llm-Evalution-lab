import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Tabs, TabItem } from '../../components/ui/Tabs';
import { EmptyState } from '../../components/ui/EmptyState';
import {
  FlaskConical,
  PlaySquare,
  AlertTriangle,
  BookmarkCheck,
  FolderOpen,
} from 'lucide-react';

export const ResearchWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState('experiments');

  const tabs: TabItem[] = [
    { id: 'experiments', label: 'Recent Experiments', count: 0 },
    { id: 'evaluations', label: 'Evaluation Runs', count: 0 },
    { id: 'failures', label: 'Failure Investigations', count: 0 },
    { id: 'benchmarks', label: 'Saved Sessions', count: 0 },
  ];

  return (
    <Card>
      <CardHeader
        title="Research Workspace"
        subtitle="Active evaluation sessions and tracked model experiments."
        icon={<FolderOpen className="w-4 h-4 text-lab-accent-lime" />}
      />

      <div className="px-4 pt-2">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      <CardContent className="p-6">
        {activeTab === 'experiments' && (
          <EmptyState
            icon={<FlaskConical className="w-5 h-5" />}
            title="No Tracked Experiments Yet"
            description="Experiments will log model hyperparameters, system prompts, output artifacts, and token latency across runs."
            note="Scheduled for Phase 2: Model Playground & Integration"
          />
        )}

        {activeTab === 'evaluations' && (
          <EmptyState
            icon={<PlaySquare className="w-5 h-5" />}
            title="No Evaluation Runs Executed"
            description="Evaluation runs execute automated test suites and scoring rubrics against benchmark datasets."
            note="Scheduled for Phase 4: Evaluation & Scoring Engine"
          />
        )}

        {activeTab === 'failures' && (
          <EmptyState
            icon={<AlertTriangle className="w-5 h-5" />}
            title="No Failure Cases Logged"
            description="Failure investigations classify model hallucinations, reasoning breakdowns, and format violations."
            note="Scheduled for Phase 6: Failure Analysis & Error Intelligence"
          />
        )}

        {activeTab === 'benchmarks' && (
          <EmptyState
            icon={<BookmarkCheck className="w-5 h-5" />}
            title="No Saved Benchmark Sessions"
            description="Saved benchmark sessions allow multi-model comparison replays and historical tracking."
            note="Scheduled for Phase 3: Benchmark & Dataset Engine"
          />
        )}
      </CardContent>
    </Card>
  );
};
