import React, { useState } from 'react';
import { PageContainer } from '../../components/layout/PageContainer';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { Modal } from '../../components/ui/Modal';
import {
  Terminal,
  Play,
  Copy,
  Sliders,
  RotateCcw,
  FileText,
  Clock,
  ShieldAlert,
} from 'lucide-react';

export const PlaygroundPage: React.FC = () => {
  const [model, setModel] = useState('gpt-4o');
  const [temperature, setTemperature] = useState(0.2);
  const [topP, setTopP] = useState(0.95);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [freqPenalty, setFreqPenalty] = useState(0.0);
  const [presPenalty, setPresPenalty] = useState(0.0);
  const [stopSequences, setStopSequences] = useState('');
  const [seed, setSeed] = useState('42');
  const [selectedDataset, setSelectedDataset] = useState('gsm8k_math_eval');
  const [promptVersion, setPromptVersion] = useState('v1.2.0-eval-strict');
  const [promptVarContext, setPromptVarContext] = useState('Proof domain: discrete mathematics and graph theory.');

  const [systemPrompt, setSystemPrompt] = useState(
    'You are a rigorous scientific evaluation assistant. Provide structured, evidence-grounded answers adhering strictly to user constraints.'
  );
  const [userPrompt, setUserPrompt] = useState(
    'Analyze the algorithmic complexity of Dijkstra with a Fibonacci heap vs binary heap under dense graph conditions. Provide formal asymptotic bounds.'
  );
  const [viewTab, setViewTab] = useState<'response' | 'structured_json' | 'trace'>('response');
  const [isGateModalOpen, setIsGateModalOpen] = useState(false);

  const handleRunInference = () => {
    setIsGateModalOpen(true);
  };

  const handleReset = () => {
    setSystemPrompt('You are a rigorous scientific evaluation assistant. Provide structured, evidence-grounded answers.');
    setUserPrompt('');
    setTemperature(0.2);
    setTopP(0.95);
    setFreqPenalty(0.0);
    setPresPenalty(0.0);
  };

  return (
    <PageContainer
      title="Model Playground"
      subtitle="Multi-panel experiment workstation: prompt engineering, decoding sampler instruments, and response inspection."
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            icon={<RotateCcw className="w-3.5 h-3.5 text-[#929BA3]" />}
          >
            Reset
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<Play className="w-3.5 h-3.5" />}
            onClick={handleRunInference}
          >
            Run Inference
          </Button>
        </div>
      }
      maxWidth="wide"
    >
      {/* 3-Column Ergonomic Workstation Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 items-stretch min-h-[660px] font-mono text-[#D9DEE2]">
        {/* ======================================================== */}
        {/* LEFT COLUMN: Prompt & Experiment Config (~30% / col-span-4) */}
        {/* ======================================================== */}
        <div className="lg:col-span-4 bg-[#1C1F22] border border-[#35393D] rounded-sm flex flex-col justify-between overflow-hidden shadow-sm">
          {/* Header */}
          <div className="px-3 py-2 border-b border-[#35393D] flex items-center justify-between bg-[#17191B]">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#D9DEE2]">
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>PROMPT_SPECIFICATION</span>
            </div>
            <span className="text-[10px] text-[#929BA3] bg-[#111315] px-1.5 py-0.2 rounded-sm border border-[#35393D]">
              Tokens: ~{Math.round((systemPrompt.length + userPrompt.length) / 4)}
            </span>
          </div>

          <div className="p-3 flex-1 flex flex-col gap-2.5 overflow-y-auto text-xs">
            {/* Version & Dataset Selectors */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[9.5px] text-[#929BA3] uppercase tracking-wider block">
                  Prompt Version
                </label>
                <input
                  type="text"
                  value={promptVersion}
                  onChange={(e) => setPromptVersion(e.target.value)}
                  className="w-full bg-[#111315] border border-[#35393D] rounded-sm px-2 py-1 text-[10.5px] text-[#D9DEE2] focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9.5px] text-[#929BA3] uppercase tracking-wider block">
                  Input Dataset
                </label>
                <select
                  value={selectedDataset}
                  onChange={(e) => setSelectedDataset(e.target.value)}
                  className="w-full bg-[#111315] border border-[#35393D] rounded-sm px-2 py-1 text-[10.5px] text-[#D9DEE2] focus:outline-none focus:border-cyan-500"
                >
                  <option value="gsm8k_math_eval">gsm8k_math_eval</option>
                  <option value="mmlu_stem_subset">mmlu_stem_subset</option>
                  <option value="truthful_factuality">truthful_factuality</option>
                  <option value="adversarial_jailbreaks">adversarial_jailbreaks</option>
                </select>
              </div>
            </div>

            {/* Prompt Variables */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[9.5px] text-[#929BA3] uppercase tracking-wider">
                <span>Prompt Variables</span>
                <span className="text-cyan-400 font-mono">{"{{context}}"}</span>
              </div>
              <input
                type="text"
                value={promptVarContext}
                onChange={(e) => setPromptVarContext(e.target.value)}
                placeholder="Variable injection string..."
                className="w-full bg-[#111315] border border-[#35393D] rounded-sm p-1.5 text-[10.5px] text-[#D9DEE2] placeholder-[#687179] focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* System Prompt */}
            <div className="space-y-1">
              <label className="text-[9.5px] text-[#929BA3] uppercase tracking-wider block">
                System Prompt Instructions
              </label>
              <textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                rows={3}
                placeholder="Set system boundaries or evaluation rubrics..."
                className="w-full bg-[#111315] border border-[#35393D] rounded-sm p-2 text-[10.5px] text-[#D9DEE2] placeholder-[#687179] focus:outline-none focus:border-cyan-500 leading-relaxed resize-none"
              />
            </div>

            {/* User Prompt */}
            <div className="space-y-1 flex-1 flex flex-col">
              <div className="flex items-center justify-between">
                <label className="text-[9.5px] text-[#929BA3] uppercase tracking-wider">
                  User Evaluation Prompt
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setUserPrompt(
                      'Analyze the algorithmic complexity of Dijkstra with a Fibonacci heap vs binary heap under dense graph conditions. Detail proof steps.'
                    )
                  }
                  className="text-[9px] text-cyan-400 hover:text-cyan-300"
                >
                  Load Benchmark Sample
                </button>
              </div>
              <textarea
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder="Enter prompt payload to test..."
                className="w-full flex-1 bg-[#111315] border border-[#35393D] rounded-sm p-2 text-[10.5px] text-[#D9DEE2] placeholder-[#687179] focus:outline-none focus:border-cyan-500 leading-relaxed resize-none min-h-[140px]"
              />
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* CENTER COLUMN: Response Viewer & Output Inspector (~45% / col-span-5) */}
        {/* ======================================================== */}
        <div className="lg:col-span-5 bg-[#1C1F22] border border-[#35393D] rounded-sm flex flex-col justify-between overflow-hidden shadow-sm">
          {/* Output Toolbar */}
          <div className="px-3 py-2 border-b border-[#35393D] flex items-center justify-between bg-[#17191B]">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#D9DEE2]">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>MODEL_STREAM_VIEWER</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center border border-[#35393D] rounded-sm overflow-hidden text-[9px] bg-[#111315]">
                <button
                  onClick={() => setViewTab('response')}
                  className={`px-2 py-0.5 ${
                    viewTab === 'response' ? 'bg-cyan-500/20 font-bold text-cyan-300 border border-cyan-500/40' : 'text-[#929BA3]'
                  }`}
                >
                  RESPONSE
                </button>
                <button
                  onClick={() => setViewTab('structured_json')}
                  className={`px-2 py-0.5 ${
                    viewTab === 'structured_json' ? 'bg-cyan-500/20 font-bold text-cyan-300 border border-cyan-500/40' : 'text-[#929BA3]'
                  }`}
                >
                  STRUCTURED_JSON
                </button>
                <button
                  onClick={() => setViewTab('trace')}
                  className={`px-2 py-0.5 ${
                    viewTab === 'trace' ? 'bg-cyan-500/20 font-bold text-cyan-300 border border-cyan-500/40' : 'text-[#929BA3]'
                  }`}
                >
                  TRACE
                </button>
              </div>

              <button
                onClick={() => navigator.clipboard.writeText('No output generated')}
                className="p-1 rounded-sm text-[#687179] hover:text-[#D9DEE2] transition-colors"
                title="Copy response payload"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Response Body Area */}
          <div className="flex-1 p-4 bg-[#101214] flex flex-col justify-center items-center overflow-y-auto">
            {viewTab === 'response' && (
              <EmptyState
                icon={<Terminal className="w-5 h-5 text-cyan-400" />}
                title="Awaiting Model Inference Dispatch"
                description="Configure prompt payload and decoding parameters, then dispatch 'Run Inference' to stream execution tokens."
                enablingPhase="Phase 2: Model Playground & Integration"
                actionLabel="Run Inference"
                onAction={handleRunInference}
              />
            )}

            {viewTab === 'structured_json' && (
              <div className="w-full h-full p-2 text-left font-mono text-[11px] text-[#929BA3] overflow-x-auto space-y-1">
                <div className="text-[#687179]">// JSON Schema Conformance Specification v1</div>
                <div className="text-cyan-400">{`{\n  "status": "awaiting_generation",\n  "model": "${model}",\n  "schema_validation": "STRICT",\n  "expected_keys": ["answer", "proof_steps", "complexity_bound"]\n}`}</div>
              </div>
            )}

            {viewTab === 'trace' && (
              <div className="w-full h-full p-2 text-left font-mono text-[10.5px] text-[#929BA3] overflow-x-auto space-y-1">
                <div className="text-[#687179]">// Model Execution Trace Placeholder</div>
                <div>DISPATCH_STATE: GATED [HTTP_501_ENFORCED]</div>
                <div>PROVIDER_CHANNEL: {model}</div>
                <div>SAMPLING_CONFIG: temp={temperature}, top_p={topP}, max_tok={maxTokens}</div>
              </div>
            )}
          </div>

          {/* Telemetry Footer */}
          <div className="px-3 py-1.5 border-t border-[#35393D] bg-[#17191B] text-[9.5px] text-[#929BA3] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span>STREAM: IDLE</span>
              <span>BUFFER: 0 tok</span>
              <span>RATE: 0.0 tok/s</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3 text-[#687179]" />
              <span>LATENCY: -- ms</span>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: Model Configuration Instrument Panel (~25% / col-span-3) */}
        {/* ======================================================== */}
        <div className="lg:col-span-3 bg-[#1C1F22] border border-[#35393D] rounded-sm flex flex-col justify-between overflow-hidden shadow-sm">
          {/* Header */}
          <div className="px-3 py-2 border-b border-[#35393D] flex items-center gap-1.5 text-xs font-semibold text-[#D9DEE2] bg-[#17191B]">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>DECODING_SAMPLER</span>
          </div>

          <div className="p-3 space-y-3 flex-1 overflow-y-auto text-xs font-mono">
            {/* Model Selector */}
            <div className="space-y-1">
              <label className="text-[9.5px] text-[#929BA3] block uppercase tracking-wider">
                Model Architecture
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full bg-[#111315] border border-[#35393D] rounded-sm px-2 py-1 text-xs text-[#D9DEE2] focus:outline-none focus:border-cyan-500"
              >
                <option value="gpt-4o">OpenAI — gpt-4o (128k)</option>
                <option value="claude-3-5-sonnet">Anthropic — claude-3-5-sonnet (200k)</option>
                <option value="gemini-1-5-pro">Google — gemini-1.5-pro (2M)</option>
                <option value="llama-3-1-70b">Meta — llama-3.1-70b-instruct (128k)</option>
              </select>
            </div>

            {/* Temperature Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-[#929BA3]">Temperature</span>
                <span className="text-cyan-400 font-bold">{temperature.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="2.0"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 h-1 bg-[#111315] rounded-sm appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[8px] text-[#687179]">
                <span>0.0 (Deterministic)</span>
                <span>2.0 (Creative)</span>
              </div>
            </div>

            {/* Top P Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-[#929BA3]">Top P (Nucleus)</span>
                <span className="text-cyan-400 font-bold">{topP.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={topP}
                onChange={(e) => setTopP(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 h-1 bg-[#111315] rounded-sm appearance-none cursor-pointer"
              />
            </div>

            {/* Frequency & Presence Penalty */}
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="space-y-1">
                <span className="text-[#929BA3] block">Freq Penalty</span>
                <input
                  type="number"
                  min="-2.0"
                  max="2.0"
                  step="0.1"
                  value={freqPenalty}
                  onChange={(e) => setFreqPenalty(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#111315] border border-[#35393D] rounded-sm px-1.5 py-0.5 text-xs text-[#D9DEE2] focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[#929BA3] block">Pres Penalty</span>
                <input
                  type="number"
                  min="-2.0"
                  max="2.0"
                  step="0.1"
                  value={presPenalty}
                  onChange={(e) => setPresPenalty(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#111315] border border-[#35393D] rounded-sm px-1.5 py-0.5 text-xs text-[#D9DEE2] focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Max Output Tokens */}
            <div className="space-y-1">
              <label className="text-[9.5px] text-[#929BA3] block uppercase tracking-wider">
                Max Output Tokens
              </label>
              <input
                type="number"
                value={maxTokens}
                onChange={(e) => setMaxTokens(parseInt(e.target.value) || 2048)}
                className="w-full bg-[#111315] border border-[#35393D] rounded-sm px-2 py-0.5 text-xs text-[#D9DEE2] focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Stop Sequences */}
            <div className="space-y-1">
              <label className="text-[9.5px] text-[#929BA3] block uppercase tracking-wider">
                Stop Sequences
              </label>
              <input
                type="text"
                placeholder="e.g. \n\n, ###"
                value={stopSequences}
                onChange={(e) => setStopSequences(e.target.value)}
                className="w-full bg-[#111315] border border-[#35393D] rounded-sm px-2 py-0.5 text-xs text-[#D9DEE2] placeholder-[#687179] focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Random Seed */}
            <div className="space-y-1">
              <label className="text-[9.5px] text-[#929BA3] block uppercase tracking-wider">
                Random Seed
              </label>
              <input
                type="text"
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                className="w-full bg-[#111315] border border-[#35393D] rounded-sm px-2 py-0.5 text-xs text-[#D9DEE2] focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Action Trigger */}
          <div className="p-2.5 border-t border-[#35393D] bg-[#17191B]">
            <Button
              variant="primary"
              size="sm"
              className="w-full justify-center"
              icon={<Play className="w-3 h-3 fill-current" />}
              onClick={handleRunInference}
            >
              Run Inference
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Area: Request Logs & Token Status Strip */}
      <div className="bg-[#1C1F22] border border-[#35393D] rounded-sm p-2 text-xs font-mono">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] text-[#929BA3]">
          <div className="flex items-center gap-3">
            <span className="text-[#D9DEE2] font-semibold">REQUEST_STATUS: IDLE [AWAITING_TRIGGER]</span>
            <span>PROMPT_TOKENS: ~{Math.round((systemPrompt.length + userPrompt.length) / 4)}</span>
            <span>COMPLETION_TOKENS: 0</span>
            <span>EST_COST: $0.000</span>
          </div>
          <div className="flex items-center gap-2 text-cyan-400">
            <ShieldAlert className="w-3 h-3 text-amber-400" />
            <span>PHASE 2 INFERENCE GATE ENFORCED</span>
          </div>
        </div>
      </div>

      {/* Phase 2 Gate Modal */}
      <Modal
        isOpen={isGateModalOpen}
        onClose={() => setIsGateModalOpen(false)}
        title="Model Execution Gate [HTTP 501]"
        subtitle="Live multi-provider inference is scheduled for Phase 2."
      >
        <div className="space-y-3 text-xs font-mono text-[#D9DEE2]">
          <p className="leading-relaxed font-sans text-[#929BA3]">
            The Model Playground UI is configured and verified. Live streaming tokens and provider API integration (OpenAI, Anthropic, Gemini) will activate upon entering Phase 2.
          </p>
          <div className="p-2.5 rounded-sm bg-[#111315] border border-[#35393D] text-[10.5px] space-y-1">
            <div className="text-[#687179]">// Inactivity Execution Guard</div>
            <div>
              POST /api/v1/modules/playground/execute →{' '}
              <span className="text-amber-400 font-semibold">501 Not Implemented</span>
            </div>
            <div>Target Model: {model} (T={temperature})</div>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
};
