import React, { useState } from 'react';
import { PageContainer } from '../../components/layout/PageContainer';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { Modal } from '../../components/ui/Modal';
import {
  Terminal,
  Play,
  Copy,
  Sliders,
  Sparkles,
  Info,
  Cpu,
  Clock,
  Coins,
} from 'lucide-react';

export const PlaygroundPage: React.FC = () => {
  const [model, setModel] = useState('gpt-4o');
  const [temperature, setTemperature] = useState(0.2);
  const [topP, setTopP] = useState(0.95);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [systemPrompt, setSystemPrompt] = useState(
    'You are a rigorous scientific evaluator. Analyze the user premise and return structured evaluation findings.'
  );
  const [userPrompt, setUserPrompt] = useState(
    'Evaluate the logical consistency and potential hallucination risk of this mathematical proof: ...'
  );
  const [isGateModalOpen, setIsGateModalOpen] = useState(false);

  const handleTestExecution = () => {
    setIsGateModalOpen(true);
  };

  return (
    <PageContainer
      title="Model Playground Instrument"
      subtitle="Configurable multi-pane workstation for controlled prompt engineering and parameter tuning."
      badge={<Badge variant="not_implemented">Phase 2 Target</Badge>}
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            icon={<Play className="w-3.5 h-3.5" />}
            onClick={handleTestExecution}
          >
            Run Prompt Inference
          </Button>
        </div>
      }
      maxWidth="wide"
    >
      <div className="space-y-4">
        {/* Transparent Notice Banner */}
        <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-100 flex items-start gap-3 text-xs text-slate-700">
          <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-semibold text-slate-900">
              Scientific Testing Instrument — Phase 2 Architecture Preview
            </span>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              This interface is an ergonomic preview of the upcoming multi-provider streaming playground. Model inference, token streaming, and provider API calls are scheduled for implementation in Phase 2. No dummy outputs are simulated.
            </p>
          </div>
        </div>

        {/* 3-Pane Scientific Instrument Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Pane 1: Left / Input & Prompt Panel (35% width) */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-4 sm:p-5 space-y-4 shadow-card">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-slate-500" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Prompt Configuration
                </h3>
              </div>
              <Badge variant="default" size="xs">Input Stage</Badge>
            </div>

            {/* Model Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                <span>Target Model</span>
                <span className="font-mono text-[10px] text-slate-400">PROVIDER HARNESS</span>
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-sky-500 font-mono"
              >
                <option value="gpt-4o">OpenAI — gpt-4o (Omni 2024)</option>
                <option value="claude-3-5-sonnet">Anthropic — claude-3-5-sonnet-20241022</option>
                <option value="gemini-1-5-pro">Google — gemini-1.5-pro-latest</option>
                <option value="llama-3-1-70b">Meta — llama-3.1-70b-instruct (Local)</option>
              </select>
            </div>

            {/* System Instruction */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                <span>System Directive</span>
                <span className="text-[10px] text-slate-400">Context Framing</span>
              </label>
              <textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                rows={4}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-sky-500 font-sans leading-relaxed resize-none"
              />
            </div>

            {/* User Prompt */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                <span>Evaluation Input Prompt</span>
                <span className="font-mono text-[10px] text-slate-400">
                  {userPrompt.length} chars
                </span>
              </label>
              <textarea
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                rows={6}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-sky-500 font-sans leading-relaxed resize-none"
              />
            </div>
          </div>

          {/* Pane 2: Center / Response & Streaming Inspection Area (45% width) */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-4 sm:p-5 space-y-4 shadow-card min-h-[460px] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-sky-600" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Model Response & Token Stream
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    disabled
                    className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-40"
                    title="Copy response"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <Badge variant="not_configured" size="xs">Stream Idle</Badge>
                </div>
              </div>

              {/* Response Canvas */}
              <div className="mt-4">
                <EmptyState
                  icon={<Terminal className="w-5 h-5 text-slate-400" />}
                  title="Inference Engine Awaiting Phase 2"
                  description="When triggered in Phase 2, this center pane streams real-time token outputs, measures per-token latency (TTFT), logs logprob confidence, and formats structured outputs."
                  purpose="Side-by-side inspection of model candidate completions under controlled prompt variations."
                  expectedData="Raw markdown stream, token timestamps, logprob confidence distribution, and finish reasons."
                  enablingCapability="Phase 2: Model Playground & Integration"
                  currentActionText="Adjust hyperparameters in the right panel to preview configuration controls."
                />
              </div>
            </div>

            {/* Bottom telemetry indicators */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> TTFT: — ms
              </span>
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" /> TOKENS: 0 out
              </span>
              <span className="flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5" /> EST. COST: $0.00
              </span>
            </div>
          </div>

          {/* Pane 3: Right / Technical Parameter Panel (20% width) */}
          <div className="lg:col-span-3 bg-white border border-slate-200 rounded-xl p-4 sm:p-5 space-y-4 shadow-card">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-slate-500" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Parameters
                </h3>
              </div>
              <Badge variant="accent" size="xs">Tuning</Badge>
            </div>

            {/* Temperature Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-700">Temperature</span>
                <span className="font-mono text-sky-700 font-bold">{temperature}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1.5"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Deterministic (0.0)</span>
                <span>Creative (1.5)</span>
              </div>
            </div>

            {/* Top P Slider */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-700">Top P</span>
                <span className="font-mono text-sky-700 font-bold">{topP}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={topP}
                onChange={(e) => setTopP(parseFloat(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Nucleus Sampling</span>
                <span>1.0</span>
              </div>
            </div>

            {/* Max Output Tokens */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-700">Max Tokens</span>
                <span className="font-mono text-slate-700 font-medium">{maxTokens}</span>
              </div>
              <input
                type="number"
                min="64"
                max="8192"
                step="128"
                value={maxTokens}
                onChange={(e) => setMaxTokens(parseInt(e.target.value) || 2048)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-mono"
              />
            </div>

            {/* Stop Sequences */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <label className="text-xs font-semibold text-slate-700 block">
                Stop Sequences
              </label>
              <input
                type="text"
                placeholder="e.g. \n\n, <|endoftext|>"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-mono placeholder:text-slate-400"
              />
            </div>

            {/* Reproducibility Seed */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <label className="text-xs font-semibold text-slate-700 block">
                Seed (Reproducibility)
              </label>
              <input
                type="number"
                placeholder="e.g. 42"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-mono placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Execution Verification Modal */}
      <Modal
        isOpen={isGateModalOpen}
        onClose={() => setIsGateModalOpen(false)}
        title="Execution Gated — Phase 2 Scheduled"
        subtitle="Verifies that real model inference will be enabled in Phase 2 without synthetic mockups."
        footer={
          <Button variant="secondary" size="xs" onClick={() => setIsGateModalOpen(false)}>
            Dismiss
          </Button>
        }
      >
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-sky-50 border border-sky-100 text-[11px] text-sky-900 leading-relaxed">
            <strong>Configured Parameters Captured:</strong>
            <div className="font-mono mt-1 text-slate-700 space-y-0.5">
              <div>Model: {model}</div>
              <div>Temperature: {temperature}</div>
              <div>Top P: {topP}</div>
              <div>Max Tokens: {maxTokens}</div>
            </div>
          </div>
          <p className="text-slate-600 leading-relaxed text-xs">
            Per strict Phase 1 compliance, the platform does not fabricate fake model responses. Live multi-provider streaming will connect to OpenAI, Anthropic, and Gemini in Phase 2.
          </p>
        </div>
      </Modal>
    </PageContainer>
  );
};
