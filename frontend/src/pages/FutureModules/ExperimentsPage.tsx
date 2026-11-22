import React, { useState } from 'react';
import { PageContainer } from '../../components/layout/PageContainer';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { Modal } from '../../components/ui/Modal';
import {
  Search,
  Plus,
  FlaskConical,
  Code2,
  FileText,
} from 'lucide-react';

export const ExperimentsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modelFilter, setModelFilter] = useState('all');
  const [showExampleSchema, setShowExampleSchema] = useState(false);
  const [isGateModalOpen, setIsGateModalOpen] = useState(false);

  const handleNewExperiment = () => {
    setIsGateModalOpen(true);
  };

  return (
    <PageContainer
      title="Experiments"
      subtitle="Track prompt iterations, parameter variations, and model evaluation runs."
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowExampleSchema((prev) => !prev)}
            icon={<Code2 className="w-3.5 h-3.5 text-slate-400" />}
          >
            {showExampleSchema ? 'Hide Schema Spec' : 'Example Schema Spec'}
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-3.5 h-3.5" />}
            onClick={handleNewExperiment}
          >
            New Experiment
          </Button>
        </div>
      }
      maxWidth="wide"
    >
      <div className="space-y-4">
        {/* Compact Research Toolbar */}
        <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter experiments by name, model, or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-md pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 font-sans"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={modelFilter}
              onChange={(e) => setModelFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-md px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-sky-500"
            >
              <option value="all">All Models</option>
              <option value="gpt-4o">GPT-4o</option>
              <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
              <option value="gemini-1-5-pro">Gemini 1.5 Pro</option>
              <option value="llama-3-1-70b">Llama 3.1 70B</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-md px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-sky-500"
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="running">In Progress</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        {/* Experiment Runs Table */}
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium text-[11px]">
                <th className="py-2.5 px-3.5">Experiment ID</th>
                <th className="py-2.5 px-3.5">Experiment Name</th>
                <th className="py-2.5 px-3.5">Target Model</th>
                <th className="py-2.5 px-3.5">Dataset / Suite</th>
                <th className="py-2.5 px-3.5">Evaluator</th>
                <th className="py-2.5 px-3.5">Status</th>
                <th className="py-2.5 px-3.5 text-right">Created</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={7} className="py-12">
                  <EmptyState
                    icon={<FlaskConical className="w-5 h-5 text-slate-400" />}
                    title="No experiments yet"
                    description="Create your first experiment to compare prompts, model configurations, and evaluation results."
                    enablingPhase="Phase 2: Model Playground & Integration"
                    actionLabel="Create Experiment"
                    onAction={handleNewExperiment}
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <div className="px-3.5 py-2 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-[11px] text-slate-400">
            <span>Showing 0 experiments</span>
            <span className="font-mono">Storage: SQLite/PostgreSQL Ready</span>
          </div>
        </div>

        {/* Example Schema Specification (Explicitly labeled) */}
        {showExampleSchema && (
          <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-2.5 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-600" />
                <h4 className="font-semibold text-slate-900">
                  Example Experiment Execution Schema
                </h4>
              </div>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                Schema Definition Only
              </span>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              When an experiment run executes in Phase 2, the following JSON schema is persisted to track hyperparameters, output artifacts, and evaluation lineage:
            </p>

            <pre className="p-3 bg-slate-50 rounded-md border border-slate-200 font-mono text-[11px] text-slate-700 overflow-x-auto leading-relaxed">
{`{
  "experiment_id": "exp_example_001",
  "name": "Dijkstra Reasoning vs Ground Truth",
  "model": "gpt-4o",
  "hyperparameters": {
    "temperature": 0.2,
    "top_p": 0.95,
    "max_tokens": 2048,
    "seed": 42
  },
  "dataset_split": "validation",
  "evaluator": "g_eval_factual",
  "status": "completed"
}`}
            </pre>
          </div>
        )}
      </div>

      {/* Phase 2 Gate Modal */}
      <Modal
        isOpen={isGateModalOpen}
        onClose={() => setIsGateModalOpen(false)}
        title="Create Experiment"
        subtitle="Experiment execution engine will activate in Phase 2."
      >
        <div className="space-y-3 text-xs text-slate-600">
          <p className="leading-relaxed">
            The experiment database schema and workspace tracking architecture are active. Live execution against foundation models will be enabled in Phase 2.
          </p>
          <div className="p-3 rounded bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-700 space-y-1">
            <div className="text-slate-400">// Inactivity Gate Response</div>
            <div>POST /api/v1/modules/experiments/execute → <span className="text-amber-600 font-semibold">501 Not Implemented</span></div>
            <div>Phase Target: Phase 2 (Model Playground & Integration)</div>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
};
