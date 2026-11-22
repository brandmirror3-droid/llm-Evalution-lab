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
} from 'lucide-react';

export const PlaygroundPage: React.FC = () => {
  const [model, setModel] = useState('gpt-4o');
  const [temperature, setTemperature] = useState(0.2);
  const [topP, setTopP] = useState(0.95);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [stopSequences, setStopSequences] = useState('');
  const [seed, setSeed] = useState('42');
  const [systemPrompt, setSystemPrompt] = useState(
    'You are a rigorous scientific evaluation assistant. Provide structured, evidence-grounded answers.'
  );
  const [userPrompt, setUserPrompt] = useState(
    'Analyze the algorithmic complexity of Dijkstra with a Fibonacci heap vs binary heap.'
  );
  const [formatMode, setFormatMode] = useState<'text' | 'json' | 'diff'>('text');
  const [isGateModalOpen, setIsGateModalOpen] = useState(false);

  const handleRunInference = () => {
    setIsGateModalOpen(true);
  };

  const handleReset = () => {
    setSystemPrompt('You are a rigorous scientific evaluation assistant. Provide structured, evidence-grounded answers.');
    setUserPrompt('');
    setTemperature(0.2);
    setTopP(0.95);
  };

  return (
    <PageContainer
      title="Model Playground"
      subtitle="Interactive prompt engineering, parameter tuning, and comparative model evaluation."
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            icon={<RotateCcw className="w-3.5 h-3.5 text-slate-400" />}
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
        {/* Left Column: Prompt Editor (~35% width / col-span-4) */}
        <div className="lg:col-span-4 bg-[#0c111a] border border-slate-800 rounded-lg flex flex-col h-[680px] shadow-sm">
          {/* Header */}
          <div className="px-3.5 py-2.5 border-b border-slate-800/80 flex items-center justify-between bg-[#080c14]">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-100 font-mono">
              <FileText className="w-3.5 h-3.5 text-sky-400" />
              <span>PROMPT_SPECIFICATION</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500 bg-[#111724] px-1.5 py-0.5 rounded border border-slate-800">
              Tokens: ~{Math.round((systemPrompt.length + userPrompt.length) / 4)}
            </span>
          </div>

          <div className="p-3.5 flex-1 flex flex-col gap-3 overflow-y-auto">
            {/* Model Selector */}
            <div className="space-y-1">
              <label className="text-[10.5px] font-mono font-medium text-slate-400 uppercase tracking-wider block">
                Target Model
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full bg-[#101622] border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-sky-500"
              >
                <option value="gpt-4o">OpenAI — gpt-4o (128k)</option>
                <option value="claude-3-5-sonnet">Anthropic — claude-3-5-sonnet (200k)</option>
                <option value="gemini-1-5-pro">Google — gemini-1.5-pro (2M)</option>
                <option value="llama-3-1-70b">Meta — llama-3.1-70b-instruct (128k)</option>
              </select>
            </div>

            {/* System Instructions */}
            <div className="space-y-1">
              <label className="text-[10.5px] font-mono font-medium text-slate-400 uppercase tracking-wider block">
                System Instructions
              </label>
              <textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                rows={4}
                placeholder="Set behavior or evaluation guidelines..."
                className="w-full bg-[#101622] border border-slate-800 rounded p-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500 font-mono leading-relaxed resize-none"
              />
            </div>

            {/* User Prompt */}
            <div className="space-y-1 flex-1 flex flex-col">
              <div className="flex items-center justify-between">
                <label className="text-[10.5px] font-mono font-medium text-slate-400 uppercase tracking-wider">
                  User Evaluation Prompt
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setUserPrompt(
                      'Analyze the algorithmic complexity of Dijkstra with a Fibonacci heap vs binary heap. Detail proof steps.'
                    )
                  }
                  className="text-[10px] font-mono text-sky-400 hover:text-sky-300"
                >
                  Load Benchmark
                </button>
              </div>
              <textarea
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder="Enter prompt to evaluate..."
                className="w-full flex-1 bg-[#101622] border border-slate-800 rounded p-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500 font-mono leading-relaxed resize-none min-h-[140px]"
              />
            </div>
          </div>
        </div>

        {/* Center Column: Response Workspace (~45% width / col-span-5) */}
        <div className="lg:col-span-5 bg-[#0c111a] border border-slate-800 rounded-lg flex flex-col h-[680px] shadow-sm">
          {/* Output Toolbar */}
          <div className="px-3.5 py-2 border-b border-slate-800/80 flex items-center justify-between bg-[#080c14]">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-100 font-mono">
              <Terminal className="w-3.5 h-3.5 text-sky-400" />
              <span>MODEL_STREAM_VIEWER</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center border border-slate-800 rounded overflow-hidden text-[10px] font-mono bg-[#111724]">
                <button
                  onClick={() => setFormatMode('text')}
                  className={`px-2 py-0.5 ${
                    formatMode === 'text' ? 'bg-sky-500/20 font-bold text-sky-300 border border-sky-500/30' : 'text-slate-400'
                  }`}
                >
                  RAW_TEXT
                </button>
                <button
                  onClick={() => setFormatMode('json')}
                  className={`px-2 py-0.5 ${
                    formatMode === 'json' ? 'bg-sky-500/20 font-bold text-sky-300 border border-sky-500/30' : 'text-slate-400'
                  }`}
                >
                  JSON_TREE
                </button>
              </div>

              <button
                onClick={() => navigator.clipboard.writeText('No output generated yet')}
                className="p-1 rounded text-slate-500 hover:text-slate-300 transition-colors"
                title="Copy response"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Response Body Area */}
          <div className="flex-1 p-4 bg-[#080c14] flex flex-col justify-center items-center overflow-y-auto">
            <EmptyState
              icon={<Terminal className="w-5 h-5 text-sky-400" />}
              title="Awaiting Model Inference Dispatch"
              description="Configure prompt payload and decoding parameters, then dispatch 'Run Inference' to stream execution tokens."
              enablingPhase="Phase 2: Model Playground & Integration"
              actionLabel="Run Inference"
              onAction={handleRunInference}
            />
          </div>

          {/* Telemetry Footer */}
          <div className="px-3.5 py-2 border-t border-slate-800/80 bg-[#080c14] text-[10px] font-mono text-slate-500 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span>STREAM: IDLE</span>
              <span>BUFFER: 0 tok</span>
              <span>RATE: 0.0 tok/s</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3 text-slate-500" />
              <span>LATENCY: -- ms</span>
            </div>
          </div>
        </div>

        {/* Right Column: Parameters Tool Panel (~20% width / col-span-3) */}
        <div className="lg:col-span-3 bg-[#0c111a] border border-slate-800 rounded-lg flex flex-col h-[680px] shadow-sm">
          <div className="px-3.5 py-2.5 border-b border-slate-800/80 flex items-center gap-1.5 text-xs font-semibold text-slate-100 font-mono bg-[#080c14]">
            <Sliders className="w-3.5 h-3.5 text-sky-400" />
            <span>DECODING_SAMPLER</span>
          </div>

          <div className="p-3.5 space-y-4 flex-1 overflow-y-auto text-xs font-mono">
            {/* Temperature */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Temperature</span>
                <span className="text-sky-400 font-bold">{temperature.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="2.0"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-sky-400 h-1 bg-slate-800 rounded appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-slate-500">
                <span>0.0 (Deterministic)</span>
                <span>2.0 (Creative)</span>
              </div>
            </div>

            {/* Top P */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Top P (Nucleus)</span>
                <span className="text-sky-400 font-bold">{topP.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={topP}
                onChange={(e) => setTopP(parseFloat(e.target.value))}
                className="w-full accent-sky-400 h-1 bg-slate-800 rounded appearance-none cursor-pointer"
              />
            </div>

            {/* Max Output Tokens */}
            <div className="space-y-1">
              <label className="text-[10.5px] text-slate-400 block uppercase">
                Max Output Tokens
              </label>
              <input
                type="number"
                value={maxTokens}
                onChange={(e) => setMaxTokens(parseInt(e.target.value) || 2048)}
                className="w-full bg-[#101622] border border-slate-800 rounded px-2.5 py-1 text-xs font-mono text-slate-200 focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Stop Sequences */}
            <div className="space-y-1">
              <label className="text-[10.5px] text-slate-400 block uppercase">
                Stop Sequences
              </label>
              <input
                type="text"
                placeholder="e.g. \n\n, ###"
                value={stopSequences}
                onChange={(e) => setStopSequences(e.target.value)}
                className="w-full bg-[#101622] border border-slate-800 rounded px-2.5 py-1 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Random Seed */}
            <div className="space-y-1">
              <label className="text-[10.5px] text-slate-400 block uppercase">
                Random Seed
              </label>
              <input
                type="text"
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                className="w-full bg-[#101622] border border-slate-800 rounded px-2.5 py-1 text-xs font-mono text-slate-200 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="pt-2 border-t border-slate-800/80 text-[10.5px] text-slate-500 space-y-1">
              <div className="flex justify-between">
                <span>Context Window:</span>
                <span className="text-slate-300 font-bold">128,000</span>
              </div>
              <div className="flex justify-between">
                <span>Execution Provider:</span>
                <span className="text-slate-300 font-bold">OpenAI Native</span>
              </div>
            </div>
          </div>

          <div className="p-3 border-t border-slate-800/80 bg-[#080c14]">
            <Button
              variant="primary"
              size="sm"
              className="w-full justify-center"
              icon={<Play className="w-3.5 h-3.5 fill-current" />}
              onClick={handleRunInference}
            >
              Run Inference
            </Button>
          </div>
        </div>
      </div>

      {/* Phase 2 Gate Modal */}
      <Modal
        isOpen={isGateModalOpen}
        onClose={() => setIsGateModalOpen(false)}
        title="Model Execution Gate [501]"
        subtitle="Live multi-provider inference is scheduled for Phase 2."
      >
        <div className="space-y-3 text-xs font-mono text-slate-300">
          <p className="leading-relaxed font-sans text-slate-400">
            The Model Playground UI is configured and verified. Live streaming tokens and provider API integration (OpenAI, Anthropic, Gemini) will activate upon entering Phase 2.
          </p>
          <div className="p-3 rounded bg-[#080c14] border border-slate-800 text-[11px] text-slate-300 space-y-1">
            <div className="text-slate-500">// Execution Inactivity Guard</div>
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
