import React from 'react';
import { Terminal, Gauge, CheckSquare, AlertOctagon, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ModuleItem {
  id: string;
  title: string;
  description: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

const MODULES: ModuleItem[] = [
  {
    id: 'playground',
    title: 'Model Playground',
    description: 'Interactive multi-provider prompt iteration and decoding parameter sweeps.',
    path: '/playground',
    icon: Terminal,
  },
  {
    id: 'benchmarks',
    title: 'Benchmark Suite',
    description: 'Systematic evaluation against academic suites (MMLU, GSM8K, HumanEval).',
    path: '/benchmarks',
    icon: Gauge,
  },
  {
    id: 'evaluators',
    title: 'Evaluator Lab',
    description: 'Deterministic checks, LLM-as-a-judge rubrics, and continuous scoring.',
    path: '/evaluators',
    icon: CheckSquare,
  },
  {
    id: 'failure-analysis',
    title: 'Failure Analysis',
    description: 'Error taxonomy clustering, token-level discrepancy diffs, and root causes.',
    path: '/failure-analysis',
    icon: AlertOctagon,
  },
];

export const QuickActions: React.FC = () => {
  return (
    <div className="space-y-2 font-mono">
      <div className="flex items-center justify-between">
        <h3 className="text-[11px] font-bold text-[#D9DEE2] uppercase tracking-wider">
          Scientific Module Launchers
        </h3>
        <span className="text-[10px] text-[#687179]">PHASE_01_WORKSTATIONS</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {MODULES.map((m) => {
          const Icon = m.icon;
          return (
            <Link
              key={m.id}
              to={m.path}
              className="group p-3 rounded-sm border border-[#35393D] bg-[#1C1F22] hover:border-cyan-500 hover:bg-[#232629] transition-all flex flex-col justify-between space-y-2 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="w-6 h-6 rounded-sm bg-[#111315] border border-[#35393D] flex items-center justify-center text-cyan-400 group-hover:border-cyan-500/50 transition-colors">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#687179] group-hover:text-cyan-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>

              <div>
                <h4 className="text-xs font-semibold text-[#D9DEE2] group-hover:text-cyan-300 transition-colors">
                  {m.title}
                </h4>
                <p className="text-[10.5px] text-[#929BA3] font-sans mt-0.5 leading-snug line-clamp-2">
                  {m.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
