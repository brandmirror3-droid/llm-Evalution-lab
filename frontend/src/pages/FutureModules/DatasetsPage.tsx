import React, { useState } from 'react';
import { PageContainer } from '../../components/layout/PageContainer';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { Modal } from '../../components/ui/Modal';
import {
  Database,
  Search,
  Upload,
  FileCode,
  CheckCircle2,
  PieChart,
} from 'lucide-react';

interface DatasetMeta {
  key: string;
  filename: string;
  domain: string;
  format: string;
  sampleCount: number;
  tokensEstimated: string;
  status: 'Validated' | 'Pending';
}

const BASELINE_DATASETS: DatasetMeta[] = [
  {
    key: 'gsm8k_math_eval',
    filename: 'gsm8k_reasoning_test.jsonl',
    domain: 'Mathematical Proofs',
    format: 'JSONL',
    sampleCount: 1319,
    tokensEstimated: '482K tokens',
    status: 'Validated',
  },
  {
    key: 'mmlu_stem_subset',
    filename: 'mmlu_stem_eval.jsonl',
    domain: 'STEM Knowledge',
    format: 'JSONL',
    sampleCount: 3200,
    tokensEstimated: '1.2M tokens',
    status: 'Validated',
  },
  {
    key: 'truthful_factuality',
    filename: 'truthful_pairs_eval.jsonl',
    domain: 'Factuality & Hallucination',
    format: 'JSONL',
    sampleCount: 817,
    tokensEstimated: '290K tokens',
    status: 'Validated',
  },
  {
    key: 'adversarial_jailbreaks',
    filename: 'adversarial_injection_v1.jsonl',
    domain: 'Safety & Robustness',
    format: 'JSONL',
    sampleCount: 450,
    tokensEstimated: '175K tokens',
    status: 'Validated',
  },
];

export const DatasetsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDataset, setSelectedDataset] = useState<DatasetMeta>(BASELINE_DATASETS[0]);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const filteredDatasets = BASELINE_DATASETS.filter(
    (d) =>
      d.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageContainer
      title="Datasets"
      subtitle="Evaluation corpora catalog, JSON schema validation, and train/val/test split distributions."
      actions={
        <Button
          variant="primary"
          size="sm"
          icon={<Upload className="w-3.5 h-3.5" />}
          onClick={() => setIsImportModalOpen(true)}
        >
          Import Dataset
        </Button>
      }
      maxWidth="wide"
    >
      <div className="space-y-4">
        {/* Dataset Catalog Table */}
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden space-y-3 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-slate-400" />
              <div>
                <h3 className="text-xs font-semibold text-slate-900">
                  Evaluation Corpora Catalog
                </h3>
                <p className="text-[11px] text-slate-500">
                  Preloaded baseline schemas and validation datasets.
                </p>
              </div>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search datasets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-md pl-8 pr-3 py-1 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 w-52 font-sans"
              />
            </div>
          </div>

          <div className="border border-slate-200 rounded-md overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium text-[11px]">
                  <th className="py-2 px-3">Dataset Key</th>
                  <th className="py-2 px-3">Filename</th>
                  <th className="py-2 px-3">Evaluation Domain</th>
                  <th className="py-2 px-3">Format</th>
                  <th className="py-2 px-3">Samples</th>
                  <th className="py-2 px-3">Est. Tokens</th>
                  <th className="py-2 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {filteredDatasets.map((ds) => (
                  <tr
                    key={ds.key}
                    onClick={() => setSelectedDataset(ds)}
                    className={`cursor-pointer transition-colors ${
                      selectedDataset.key === ds.key ? 'bg-sky-50/50' : 'hover:bg-slate-50/60'
                    }`}
                  >
                    <td className="py-2.5 px-3 font-mono font-medium text-slate-900">
                      {ds.key}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">
                      {ds.filename}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700">
                      {ds.domain}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">
                      {ds.format}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-800">
                      {ds.sampleCount.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-500">
                      {ds.tokensEstimated}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {ds.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Dataset Details: Schema & Split Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Schema Viewer (~65% width) */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-sky-600" />
                <h4 className="text-xs font-semibold text-slate-900">
                  Example JSONL Record Schema: <span className="font-mono text-sky-700 font-normal">{selectedDataset.key}</span>
                </h4>
              </div>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                Strict Schema v1
              </span>
            </div>

            <pre className="p-3 bg-slate-50 rounded-md border border-slate-200 font-mono text-[11px] text-slate-700 overflow-x-auto leading-relaxed">
{`{
  "id": "item_0042",
  "prompt": "Calculate the derivative of f(x) = x^3 * ln(x) at x=e.",
  "reference_solution": "4 * e^2",
  "metadata": {
    "domain": "${selectedDataset.domain}",
    "strict_match": true
  }
}`}
            </pre>
          </div>

          {/* Split Breakdown (~35% width) */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900">
                <PieChart className="w-3.5 h-3.5 text-slate-400" />
                <span>Split Distribution</span>
              </div>
              <span className="font-mono text-[10px] text-slate-400">
                {selectedDataset.sampleCount} total
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                  <span>Validation Split (60%)</span>
                  <span className="font-mono text-slate-500">791 items</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-500 rounded-full" style={{ width: '60%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                  <span>Held-Out Test (25%)</span>
                  <span className="font-mono text-slate-500">330 items</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: '25%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                  <span>Adversarial Perturbation (15%)</span>
                  <span className="font-mono text-slate-500">198 items</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '15%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Custom Uploads Empty State */}
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <EmptyState
            icon={<Database className="w-5 h-5 text-slate-400" />}
            title="No custom datasets imported yet"
            description="Upload JSONL or CSV prompt-response pairs to evaluate models on your proprietary domain data."
            enablingPhase="Phase 3: Benchmark & Dataset Engine"
            actionLabel="Import Dataset"
            onAction={() => setIsImportModalOpen(true)}
          />
        </div>
      </div>

      {/* Import Modal */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Import Dataset"
        subtitle="Custom dataset upload pipelines will activate in Phase 3."
      >
        <div className="space-y-3 text-xs text-slate-600">
          <p className="leading-relaxed">
            The dataset schema validator and split partitioner are architected. Live file upload and vector embedding indexing will activate in Phase 3.
          </p>
          <div className="p-3 rounded bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-700 space-y-1">
            <div className="text-slate-400">// Inactivity Guard Status</div>
            <div>POST /api/v1/modules/datasets/execute → <span className="text-amber-600 font-semibold">501 Not Implemented</span></div>
            <div>Phase Target: Phase 3 (Benchmark & Dataset Engine)</div>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
};
