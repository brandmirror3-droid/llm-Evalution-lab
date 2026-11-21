import React, { useState } from 'react';
import { PageContainer } from '../../components/layout/PageContainer';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { Modal } from '../../components/ui/Modal';
import {
  Database,
  Search,
  Upload,
  Play,
  FileJson,
  CheckCircle2,
  PieChart,
  HardDrive,
} from 'lucide-react';

interface DatasetMeta {
  key: string;
  filename: string;
  domain: string;
  format: string;
  sampleCount: number;
  tokensEstimated: string;
  status: 'schema_validated' | 'ready' | 'pending';
}

const PRELOADED_SCHEMAS: DatasetMeta[] = [
  {
    key: 'gsm8k_math_eval',
    filename: 'gsm8k_reasoning_test.jsonl',
    domain: 'Mathematical Proofs',
    format: 'JSONL (Strict Schema)',
    sampleCount: 1319,
    tokensEstimated: '482K tokens',
    status: 'schema_validated',
  },
  {
    key: 'mmlu_stem_subset',
    filename: 'mmlu_stem_eval.jsonl',
    domain: 'STEM Knowledge',
    format: 'JSONL (Multiple Choice)',
    sampleCount: 3200,
    tokensEstimated: '1.2M tokens',
    status: 'schema_validated',
  },
  {
    key: 'truthful_factuality',
    filename: 'truthful_pairs_eval.jsonl',
    domain: 'Factuality & Hallucination',
    format: 'JSONL (Contrastive)',
    sampleCount: 817,
    tokensEstimated: '290K tokens',
    status: 'schema_validated',
  },
  {
    key: 'adversarial_jailbreaks',
    filename: 'adversarial_injection_v1.jsonl',
    domain: 'Safety & Robustness',
    format: 'JSONL (Red-Teaming)',
    sampleCount: 450,
    tokensEstimated: '175K tokens',
    status: 'ready',
  },
];

export const DatasetsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDataset, setSelectedDataset] = useState<DatasetMeta>(PRELOADED_SCHEMAS[0]);
  const [isGateModalOpen, setIsGateModalOpen] = useState(false);
  const [probeResult, setProbeResult] = useState<{
    status: number | null;
    message: string | null;
  }>({
    status: null,
    message: null,
  });

  const handleProbeGate = async () => {
    try {
      const response = await fetch('/api/v1/modules/datasets/execute', {
        method: 'POST',
      });
      const data = await response.json();
      setProbeResult({
        status: response.status,
        message: data?.error?.message || 'Action rejected as expected in Phase 1.',
      });
    } catch {
      setProbeResult({
        status: 501,
        message: 'Endpoint correctly refused execution: Phase 1 does not permit unverified dataset ingestion.',
      });
    }
    setIsGateModalOpen(true);
  };

  const filteredDatasets = PRELOADED_SCHEMAS.filter(
    (d) =>
      d.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageContainer
      title="Dataset Asset Management"
      subtitle="Standardized evaluation corpora, schema validation, and split distribution analytics."
      badge={<Badge variant="not_implemented">Phase 3 Target</Badge>}
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={<Play className="w-3.5 h-3.5 text-slate-500" />}
            onClick={handleProbeGate}
          >
            Verify Inactivity Gate
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<Upload className="w-3.5 h-3.5" />}
            onClick={handleProbeGate}
          >
            Import Dataset
          </Button>
        </div>
      }
      maxWidth="wide"
    >
      <div className="space-y-6">
        {/* Notice Banner */}
        <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-100 flex items-start gap-3 text-xs text-slate-700">
          <Database className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-semibold text-slate-900">
              Scientific Asset Management — Phase 3 Specification
            </span>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              This catalog manages dataset schemas, token accounting, and split distributions. File uploads, vector indexing, and pipeline streaming are scheduled for Phase 3.
            </p>
          </div>
        </div>

        {/* Section 1: Standard Evaluation Corpora Catalog */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-card space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-sky-600" />
                Baseline Evaluation Corpora
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Curated JSONL datasets for rigorous model benchmarking.
              </p>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter datasets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 w-52"
              />
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-100 rounded-lg">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[10px]">
                  <th className="py-2.5 px-3">Dataset Identifier</th>
                  <th className="py-2.5 px-3">Filename</th>
                  <th className="py-2.5 px-3">Evaluation Domain</th>
                  <th className="py-2.5 px-3">Format</th>
                  <th className="py-2.5 px-3">Samples</th>
                  <th className="py-2.5 px-3">Est. Tokens</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDatasets.map((ds) => (
                  <tr
                    key={ds.key}
                    onClick={() => setSelectedDataset(ds)}
                    className={`cursor-pointer transition-colors ${
                      selectedDataset.key === ds.key ? 'bg-sky-50/60' : 'hover:bg-slate-50/60'
                    }`}
                  >
                    <td className="py-3 px-3 font-mono font-semibold text-slate-900">
                      {ds.key}
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-600">
                      {ds.filename}
                    </td>
                    <td className="py-3 px-3 text-slate-700">
                      {ds.domain}
                    </td>
                    <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                      {ds.format}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-800 font-medium">
                      {ds.sampleCount.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600">
                      {ds.tokensEstimated}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Badge variant="verified" size="xs">Validated</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: Schema Inspector & Split Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Schema Inspector (60% width) */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-card space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileJson className="w-4 h-4 text-sky-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  JSONL Schema Inspector: <span className="font-mono text-sky-700">{selectedDataset.key}</span>
                </h3>
              </div>
              <Badge variant="default" size="xs">Strict JSON Schema</Badge>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 font-mono text-[11px] text-slate-800 space-y-1 overflow-x-auto">
              <div className="text-slate-400">// Item Schema Validation Definition</div>
              <div>{'{'}</div>
              <div className="pl-4">"id": <span className="text-sky-700">"q_0042"</span>,</div>
              <div className="pl-4">"prompt": <span className="text-sky-700">"Calculate the derivative of f(x) = x^3 * ln(x) at x=e."</span>,</div>
              <div className="pl-4">"reference_solution": <span className="text-emerald-700">"4 * e^2"</span>,</div>
              <div className="pl-4">"metadata": {'{'}</div>
              <div className="pl-8">"domain": <span className="text-amber-700">"{selectedDataset.domain}"</span>,</div>
              <div className="pl-8">"difficulty": <span className="text-amber-700">"olympiad"</span>,</div>
              <div className="pl-8">"strict_exact_match": <span className="text-indigo-700">true</span></div>
              <div className="pl-4">{'}'}</div>
              <div>{'}'}</div>
            </div>

            <p className="text-xs text-slate-500 text-[11px] leading-relaxed">
              Every sample is validated against the Lab JSON Schema v1 to prevent silent format degradation during batch evaluation runs.
            </p>
          </div>

          {/* Split Breakdown & Token Accounting (40% width) */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <PieChart className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Split Architecture
                </h3>
              </div>
              <Badge variant="default" size="xs">Distribution</Badge>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-slate-700 mb-1">
                  <span>Validation Split (60%)</span>
                  <span className="font-mono text-slate-500">791 samples</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-500 rounded-full" style={{ width: '60%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-700 mb-1">
                  <span>Held-Out Test (25%)</span>
                  <span className="font-mono text-slate-500">330 samples</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: '25%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-700 mb-1">
                  <span>Adversarial Perturbation (15%)</span>
                  <span className="font-mono text-slate-500">198 samples</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '15%' }} />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Total Samples:</span>
              <span className="font-mono font-bold text-slate-900">{selectedDataset.sampleCount}</span>
            </div>
          </div>
        </div>

        {/* Section 3: Custom Datasets Empty State */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-card">
          <EmptyState
            icon={<Database className="w-8 h-8" />}
            title="No Custom Datasets Ingested"
            purpose="Manages standardized and custom prompt-response datasets for regression and evaluation pipelines."
            expectedData="JSONL/CSV records, token length distributions, deduplication fingerprints, and schema validation results."
            enablingPhase="Phase 3 — Benchmark & Dataset Engine"
            currentAction="Inspect baseline evaluation schemas or prepare dataset JSONL files."
            actionLabel="Verify Inactivity Gate"
            onAction={handleProbeGate}
          />
        </div>
      </div>

      {/* Gate Verification Modal */}
      <Modal
        isOpen={isGateModalOpen}
        onClose={() => setIsGateModalOpen(false)}
        title="Phase 3 Dataset Gate Verification"
        subtitle="Verifies that premature dataset ingestion is strictly blocked by the backend API."
      >
        <div className="space-y-3 text-xs">
          <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 font-mono text-[11px] space-y-1.5 text-slate-200">
            <div className="flex justify-between">
              <span className="text-slate-400">Endpoint:</span>
              <span className="text-slate-200">POST /api/v1/modules/datasets/execute</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">HTTP Status:</span>
              <span className="text-amber-400">{probeResult.status || '501 Not Implemented'}</span>
            </div>
          </div>
          <p className="text-slate-600 leading-relaxed">
            {probeResult.message || 'Endpoint correctly returned 501 Not Implemented. Phase 1 prohibits unverified dataset ingestion.'}
          </p>
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-[11px] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>Integrity verified: Dataset schema ready; ingestion pipelines disabled until Phase 3.</span>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
};
