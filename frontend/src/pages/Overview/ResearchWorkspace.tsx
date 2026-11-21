import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Tabs, TabItem } from '../../components/ui/Tabs';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import {
  FlaskConical,
  PlaySquare,
  AlertTriangle,
  BookmarkCheck,
  FolderOpen,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const ResearchWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState('experiments');

  const tabs: TabItem[] = [
    { id: 'experiments', label: 'Recent Experiments', count: 0 },
    { id: 'evaluations', label: 'Evaluation Runs', count: 0 },
    { id: 'failures', label: 'Failure Investigations', count: 0 },
    { id: 'benchmarks', label: 'Saved Sessions', count: 0 },
  ];

  return (
    <Card className="overflow-hidden">
      <CardHeader
        title="Research Activity & Workbench"
        subtitle="Active evaluation sessions, tracked prompt experiments, and empirical test runs."
        icon={<FolderOpen className="w-4 h-4 text-sky-600" />}
        action={
          <Link to="/playground">
            <Button
              variant="secondary"
              size="xs"
              icon={<Plus className="w-3.5 h-3.5 text-slate-400" />}
            >
              Configure Experiment
            </Button>
          </Link>
        }
      />

      <div className="px-5 pt-1 bg-white">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} idPrefix="workspace-tab" />
      </div>

      <CardContent className="p-6">
        {activeTab === 'experiments' && (
          <EmptyState
            icon={<FlaskConical className="w-5 h-5" />}
            title="No Tracked Experiments Recorded Yet"
            description="The experiment workbench tracks hyperparameter sweeps, system prompt iterations, and model output artifacts across experimental revisions."
            purpose="Systematic tracking of prompt engineering hypotheses, temperature variations, and output token distributions."
            expectedData="Experiment names, tested model IDs, prompt templates, parameter hashes, execution timestamps, and run links."
            enablingCapability="Phase 2: Model Playground & Integration"
            currentActionText="Explore the Playground Instrument to preview parameter controls and prompt editor configurations."
            action={
              <Link to="/playground">
                <Button variant="primary" size="xs" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Inspect Playground Controls
                </Button>
              </Link>
            }
          />
        )}

        {activeTab === 'evaluations' && (
          <EmptyState
            icon={<PlaySquare className="w-5 h-5" />}
            title="No Evaluation Suites Executed Yet"
            description="Automated evaluation runs execute model responses against deterministic test suites, scoring rubrics, and judge models."
            purpose="Batch evaluation of model candidate outputs against golden datasets with statistical scoring and metric derivations."
            expectedData="Suite titles, test sample counts, accuracy rates, latency distributions, and score breakdowns."
            enablingCapability="Phase 4: Evaluation & Scoring Engine"
            currentActionText="Review the Visual Workflow Pipeline above to inspect the 5-stage evaluation lifecycle."
          />
        )}

        {activeTab === 'failures' && (
          <EmptyState
            icon={<AlertTriangle className="w-5 h-5 text-amber-500" />}
            title="No Failure Cases Logged"
            description="Failure investigations capture hallucination instances, reasoning lapses, formatting errors, and refusal patterns."
            purpose="Root-cause investigation, unsupervised failure clustering, and counter-prompt hypothesis generation."
            expectedData="Failure taxonomies, prompt context, flawed model outputs, expected ground truths, and severity rankings."
            enablingCapability="Phase 6: Failure Analysis & Error Intelligence"
            currentActionText="Navigate to Failure Analysis to inspect the planned 3-column investigation workstation."
            action={
              <Link to="/failure-analysis">
                <Button variant="secondary" size="xs">
                  View Investigation Workspace
                </Button>
              </Link>
            }
          />
        )}

        {activeTab === 'benchmarks' && (
          <EmptyState
            icon={<BookmarkCheck className="w-5 h-5" />}
            title="No Saved Benchmark Sessions"
            description="Saved benchmark sessions allow multi-model comparative analysis and historical performance tracking across standardized test sets."
            purpose="Longitudinal regression testing and comparison against academic standards (MMLU-Pro, GSM8K, ARC, HumanEval)."
            expectedData="Benchmark suite IDs, tested model checkpoints, baseline delta comparisons, and score matrices."
            enablingCapability="Phase 3: Benchmark & Dataset Engine"
            currentActionText="Navigate to Benchmarks to explore the planned data intelligence tables."
            action={
              <Link to="/benchmarks">
                <Button variant="secondary" size="xs">
                  Explore Benchmark Catalog
                </Button>
              </Link>
            }
          />
        )}
      </CardContent>
    </Card>
  );
};
