import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Menu,
  Search,
  ExternalLink,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { getHealth } from '../../api/system';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';

interface HeaderProps {
  onOpenMobileSidebar: () => void;
}

const ROUTE_TITLES: Record<string, { title: string; section: string }> = {
  '/': { title: 'Lab Overview', section: 'LAB' },
  '/playground': { title: 'Model Playground', section: 'LAB' },
  '/experiments': { title: 'Experiments', section: 'LAB' },
  '/benchmarks': { title: 'Benchmarks', section: 'EVALUATION' },
  '/datasets': { title: 'Datasets', section: 'EVALUATION' },
  '/evaluators': { title: 'Evaluators', section: 'EVALUATION' },
  '/failure-analysis': { title: 'Failure Analysis', section: 'INTELLIGENCE' },
  '/model-comparison': { title: 'Model Comparison', section: 'INTELLIGENCE' },
  '/reliability': { title: 'Reliability & Calibration', section: 'INTELLIGENCE' },
  '/settings': { title: 'System Settings', section: 'SYSTEM' },
};

export const Header: React.FC<HeaderProps> = ({ onOpenMobileSidebar }) => {
  const location = useLocation();
  const [backendHealth, setBackendHealth] = useState<'healthy' | 'offline' | 'checking'>('checking');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Check health periodically
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

  // Keyboard shortcut ⌘K for search
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
      <header className="h-14 bg-lab-surface/80 backdrop-blur-md border-b border-lab-border px-4 flex items-center justify-between shrink-0 sticky top-0 z-30">
        {/* Left: Mobile trigger & Breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileSidebar}
            className="md:hidden p-1.5 rounded-md text-lab-text-secondary hover:text-lab-text-primary hover:bg-lab-card"
            aria-label="Toggle mobile menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-xs">
            <span className="font-mono text-lab-text-muted uppercase text-[10px] tracking-wider">
              {routeInfo.section}
            </span>
            <span className="text-lab-text-faint">/</span>
            <h1 className="font-semibold text-lab-text-primary tracking-tight">
              {routeInfo.title}
            </h1>
          </div>
        </div>

        {/* Center/Right: Actions and System Status */}
        <div className="flex items-center gap-2.5">
          {/* Quick Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-lab-card border border-lab-border text-xs text-lab-text-muted hover:text-lab-text-secondary hover:border-neutral-700 transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="text-lab-text-muted">Search lab assets...</span>
            <kbd className="hidden lg:inline-block font-mono text-[10px] bg-lab-surface px-1.5 py-0.5 rounded border border-lab-border text-lab-text-faint">
              ⌘K
            </kbd>
          </button>

          {/* Backend Status Badge */}
          <div className="flex items-center">
            {backendHealth === 'healthy' ? (
              <Badge variant="operational" size="xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                API v1 Active
              </Badge>
            ) : backendHealth === 'offline' ? (
              <Badge variant="disconnected" size="xs">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                API Offline
              </Badge>
            ) : (
              <Badge variant="default" size="xs">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                Probing...
              </Badge>
            )}
          </div>

          {/* Workspace Pill */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-lab-card border border-lab-border text-xs text-lab-text-secondary">
            <Layers className="w-3.5 h-3.5 text-lab-accent-lime" />
            <span className="font-medium text-lab-text-primary">Default Workspace</span>
          </div>

          {/* Help & Roadmap trigger */}
          <button
            onClick={() => setIsHelpOpen(true)}
            className="p-1.5 text-lab-text-muted hover:text-lab-text-primary hover:bg-lab-card rounded-md transition-colors"
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
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-lab-text-muted" />
            <input
              type="text"
              placeholder="Search experiments, model checkpoints, runs..."
              className="w-full bg-lab-surface border border-lab-border rounded-lg pl-9 pr-3 py-2 text-xs text-lab-text-primary focus:outline-none focus:border-lab-accent-lime placeholder:text-lab-text-faint"
              autoFocus
            />
          </div>

          <div className="border border-dashed border-lab-border rounded-lg p-6 text-center text-xs text-lab-text-muted">
            <p className="font-medium text-lab-text-secondary mb-1">
              Search Index Empty in Phase 1
            </p>
            <p className="text-[11px] leading-relaxed text-lab-text-muted">
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
        <div className="space-y-3 text-xs text-lab-text-secondary">
          <div className="p-3 bg-lab-surface rounded-lg border border-lab-border space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-lab-text-primary">Phase 1: Lab Foundation & Architecture</span>
              <Badge variant="verified" size="xs">Active / Verified</Badge>
            </div>
            <p className="text-[11px] text-lab-text-muted">
              Establishes clean monorepo architecture, FastAPI v1 endpoints, SQLAlchemy 2 async database foundations, dark-mode research design system, and honest system status telemetry.
            </p>
          </div>

          <div className="p-3 bg-lab-card rounded-lg border border-lab-borderSubtle space-y-1 opacity-70">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-lab-text-primary">Phase 2: Model Playground & Integration</span>
              <Badge variant="pending" size="xs">Planned</Badge>
            </div>
            <p className="text-[11px] text-lab-text-muted">
              Multi-model streaming, provider adapters (OpenAI, Anthropic, Gemini), and experiment tracking.
            </p>
          </div>

          <div className="p-3 bg-lab-card rounded-lg border border-lab-borderSubtle space-y-1 opacity-70">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-lab-text-primary">Phases 3–12: Evaluation, Hallucination, & Intelligence</span>
              <Badge variant="pending" size="xs">Future Roadmap</Badge>
            </div>
            <p className="text-[11px] text-lab-text-muted">
              Benchmarks, automated judges, hallucination detectors, adversarial tests, calibration curves, and continuous regression testing.
            </p>
          </div>

          <div className="pt-2 flex justify-end">
            <a
              href="/api/v1/docs"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-lab-accent-lime hover:underline"
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
