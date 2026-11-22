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
      <div className="space-y-3 font-mono">
        {/* Compact Research Toolbar */}
        <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Q status = running or (status = done and metric > 0.8)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#101622] border border-slate-800 rounded pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500 font-mono"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={modelFilter}
              onChange={(e) => setModelFilter(e.target.value)}
              className="bg-[#101622] border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-sky-500 font-mono"
            >
              <option value="all">ALL_MODELS</option>
              <option value="gpt-4o">gpt-4o</option>
              <option value="claude-3-5-sonnet">claude-3-5-sonnet</option>
              <option value="gemini-1-5-pro">gemini-1.5-pro</option>
              <option value="llama-3-1-70b">llama-3.1-70b</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#101622] border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-sky-500 font-mono"
            >
              <option value="all">ALL_STATUS</option>
              <option value="completed">COMPLETED</option>
              <option value="running">RUNNING</option>
              <option value="failed">FAILED</option>
            </select>
          </div>
        </div>

        {/* Experiment Runs Table */}
        <div className="bg-[#0c111a] border border-slate-800 rounded-lg overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="bg-[#080c14] border-b border-slate-800/80 text-slate-400 font-bold text-[10.5px]">
                <th className="py-2.5 px-3.5">EXPERIMENT_ID</th>
                <th className="py-2.5 px-3.5">EXPERIMENT_NAME</th>
                <th className="py-2.5 px-3.5">TARGET_MODEL</th>
                <th className="py-2.5 px-3.5">DATASET_SUITE</th>
                <th className="py-2.5 px-3.5">EVALUATOR</th>
                <th className="py-2.5 px-3.5">STATUS</th>
                <th className="py-2.5 px-3.5 text-right">TIMESTAMP</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={7} className="py-12">
                  <EmptyState
                    icon={<FlaskConical className="w-5 h-5 text-sky-400" />}
                    title="No experiment records in current workspace"
                    description="Create your first experiment to configure hyperparameters, model targets, and evaluation criteria."
                    enablingPhase="Phase 2: Model Playground & Integration"
                    actionLabel="Create Experiment"
                    onAction={handleNewExperiment}
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <div className="px-3.5 py-2 border-t border-slate-800/80 bg-[#080c14] flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span>FILTER_MATCH: 0 ENTRIES</span>
            <span className="text-sky-400">PERSISTENCE_STATUS: SCHEMA_READY</span>
          </div>
        </div>

        {/* Example Schema Specification (Explicitly labeled) */}
        {showExampleSchema && (
          <div className="bg-[#0c111a] border border-slate-800 rounded-lg p-3.5 space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-400" />
                <h4 className="font-bold text-slate-100 uppercase tracking-wider">
                  Experiment Execution Schema Specification
                </h4>
              </div>
              <span className="text-[10px] font-mono text-sky-300 bg-sky-950/40 px-2 py-0.5 rounded border border-sky-800/50">
                JSON_SCHEMA_v7
              </span>
            </div>

            <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
              When an experiment executes in Phase 2, the following typed record is persisted into PostgreSQL:
            </p>

            <pre className="p-3 bg-[#080c14] rounded border border-slate-800 text-[11px] text-slate-300 overflow-x-auto leading-relaxed select-text">
{`{
  "experiment_id": "exp_example_001",
  "name": "Dijkstra Reasoning vs Ground Truth",
  "model": "gpt-4o",
  "hyperparameters": {
    "temperature": 0.20,
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
        title="Create Experiment Run Gate [501]"
        subtitle="Experiment execution engine will activate in Phase 2."
      >
        <div className="space-y-3 text-xs font-mono text-slate-300">
          <p className="leading-relaxed font-sans text-slate-400">
            The experiment database schema and workspace tracking architecture are active. Live execution against foundation models will be enabled in Phase 2.
          </p>
          <div className="p-3 rounded bg-[#080c14] border border-slate-800 text-[11px] text-slate-300 space-y-1">
            <div className="text-slate-500">// Inactivity Gate Response</div>
            <div>
              POST /api/v1/modules/experiments/execute →{' '}
              <span className="text-amber-400 font-semibold">501 Not Implemented</span>
            </div>
            <div>Phase Target: Phase 2 (Model Playground & Integration)</div>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
};
