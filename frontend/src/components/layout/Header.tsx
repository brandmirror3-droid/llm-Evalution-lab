import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Menu,
  Search,
  ExternalLink,
  Layers,
  HelpCircle,
  Settings,
} from 'lucide-react';
import { getHealth } from '../../api/system';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';

interface HeaderProps {
  onOpenMobileSidebar: () => void;
}

const ROUTE_TITLES: Record<string, { title: string; section: string }> = {
  '/': { title: 'Research Command Center', section: 'WORKSPACE' },
  '/playground': { title: 'Model Playground', section: 'WORKSPACE' },
  '/experiments': { title: 'Experiment Workbench', section: 'WORKSPACE' },
  '/benchmarks': { title: 'Benchmark Suite', section: 'EVALUATION' },
  '/datasets': { title: 'Dataset Catalog', section: 'EVALUATION' },
  '/evaluators': { title: 'Evaluation Engines', section: 'EVALUATION' },
  '/failure-analysis': { title: 'Failure Investigation', section: 'ANALYSIS' },
  '/model-comparison': { title: 'Comparative Intelligence', section: 'ANALYSIS' },
  '/reliability': { title: 'Calibration & Reliability', section: 'ANALYSIS' },
  '/settings': { title: 'System Environment', section: 'SYSTEM' },
};

export const Header: React.FC<HeaderProps> = ({ onOpenMobileSidebar }) => {
  const location = useLocation();
  const [backendHealth, setBackendHealth] = useState<'healthy' | 'offline' | 'checking'>('checking');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const probe = async () => {
      try {
        const res = await getHealth();
        if (isMounted) {
          setBackendHealth(res.status === 'healthy' ? 'healthy' : 'offline');
        }
      } catch {
        if (isMounted) {
          setBackendHealth('offline');
        }
      }
    };

    probe();
    const interval = setInterval(probe, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const routeInfo = ROUTE_TITLES[location.pathname] || {
    title: 'Not Found',
    section: '404',
  };

  return (
    <>
      <header className="h-14 bg-white/95 backdrop-blur-sm border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shrink-0 sticky top-0 z-30">
        {/* Left: Mobile trigger & Breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileSidebar}
            className="md:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
            aria-label="Toggle mobile menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-slate-400 uppercase text-[10px] tracking-wider">
              {routeInfo.section}
            </span>
            <span className="text-slate-300">/</span>
            <h1 className="font-semibold text-slate-900 tracking-tight">
              {routeInfo.title}
            </h1>
          </div>
        </div>

        {/* Right: Actions and System Status */}
        <div className="flex items-center gap-2.5">
          {/* Quick Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-500 hover:text-slate-800 hover:bg-white hover:border-slate-300 transition-all shadow-subtle"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span>Search evaluation assets...</span>
            <kbd className="hidden lg:inline-block font-mono text-[10px] bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-400">
              ⌘K
            </kbd>
          </button>

          {/* Backend Status Badge */}
          <div className="flex items-center">
            {backendHealth === 'healthy' ? (
              <Badge variant="operational" size="xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                API Connected
              </Badge>
            ) : backendHealth === 'offline' ? (
              <Badge variant="disconnected" size="xs">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                API Offline
              </Badge>
            ) : (
              <Badge variant="default" size="xs">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                Connecting...
              </Badge>
            )}
          </div>

          {/* Workspace Pill */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
            <Layers className="w-3.5 h-3.5 text-sky-600" />
            <span className="font-medium text-slate-800">Default Lab</span>
          </div>

          {/* Settings Link */}
          <Link
            to="/settings"
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="System Settings"
          >
            <Settings className="w-4 h-4" />
          </Link>

          {/* Help & Roadmap trigger */}
          <button
            onClick={() => setIsHelpOpen(true)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="Roadmap & Architecture"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Quick Search Modal */}
      <Modal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        title="Search LLM Evaluation Lab"
        subtitle="Search across experiments, benchmarks, datasets, and error reports."
        maxWidth="md"
      >
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search experiments, model checkpoints, runs..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white placeholder:text-slate-400 transition-colors"
              autoFocus
            />
          </div>

          <div className="border border-dashed border-slate-200 rounded-xl p-6 text-center text-xs text-slate-500 bg-slate-50/50">
            <p className="font-medium text-slate-700 mb-1">
              Search Index Empty in Phase 1
            </p>
            <p className="text-[11px] leading-relaxed text-slate-500">
              Evaluation datasets, run traces, and experiment records will populate the search index as model runs are executed in Phases 2–4.
            </p>
          </div>
        </div>
      </Modal>

      {/* Help & Roadmap Modal */}
      <Modal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        title="LLM Evaluation Lab — 12-Phase Roadmap"
        subtitle="Current status: Phase 1 — Lab Foundation & Architecture active."
        maxWidth="lg"
      >
        <div className="space-y-3 text-xs text-slate-600">
          <div className="p-3.5 bg-sky-50/60 rounded-xl border border-sky-100 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-900">Phase 1: Lab Foundation & Architecture</span>
              <Badge variant="verified" size="xs">Active / Verified</Badge>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Establishes clean monorepo architecture, FastAPI v1 endpoints, SQLAlchemy 2 async database foundations, light research workstation UI, and live telemetry.
            </p>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800">Phase 2: Model Playground & Integration</span>
              <Badge variant="pending" size="xs">Planned</Badge>
            </div>
            <p className="text-[11px] text-slate-500">
              Multi-model streaming, provider adapters (OpenAI, Anthropic, Gemini), and experiment tracking.
            </p>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800">Phases 3–12: Evaluation, Hallucination, & Intelligence</span>
              <Badge variant="pending" size="xs">Future Roadmap</Badge>
            </div>
            <p className="text-[11px] text-slate-500">
              Benchmarks, automated judges, hallucination detectors, adversarial tests, calibration curves, and continuous regression testing.
            </p>
          </div>

          <div className="pt-2 flex justify-end">
            <a
              href="/api/v1/docs"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-sky-600 hover:text-sky-700 font-medium"
            >
              Open API Documentation (Swagger)
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </Modal>
    </>
  );
};
