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
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
          Scientific Module Launchers
        </h3>
        <span className="text-[11px] text-slate-400">Core Workstations</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {MODULES.map((m) => {
          const Icon = m.icon;
          return (
            <Link
              key={m.id}
              to={m.path}
              className="group p-3 rounded-lg border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50 transition-all flex flex-col justify-between space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="w-7 h-7 rounded-md bg-slate-100 flex items-center justify-center text-slate-600 group-hover:text-sky-600 transition-colors">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-900 group-hover:text-sky-700 transition-colors">
                  {m.title}
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug line-clamp-2">
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
