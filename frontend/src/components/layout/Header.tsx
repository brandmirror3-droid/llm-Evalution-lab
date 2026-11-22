import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Menu,
  Search,
  Layers,
  Settings,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getHealth } from '../../api/system';
import { Modal } from '../ui/Modal';

interface HeaderProps {
  onOpenMobileSidebar: () => void;
}

const ROUTE_TITLES: Record<string, { title: string; section: string }> = {
  '/': { title: 'Overview', section: 'WORKSPACE' },
  '/playground': { title: 'Playground', section: 'WORKSPACE' },
  '/experiments': { title: 'Experiments', section: 'WORKSPACE' },
  '/benchmarks': { title: 'Benchmarks', section: 'EVALUATION' },
  '/datasets': { title: 'Datasets', section: 'EVALUATION' },
  '/evaluators': { title: 'Evaluators', section: 'EVALUATION' },
  '/failure-analysis': { title: 'Failure Analysis', section: 'ANALYSIS' },
  '/model-comparison': { title: 'Model Comparison', section: 'ANALYSIS' },
  '/reliability': { title: 'Reliability', section: 'ANALYSIS' },
  '/settings': { title: 'Settings', section: 'SYSTEM' },
};

export const Header: React.FC<HeaderProps> = ({ onOpenMobileSidebar }) => {
  const location = useLocation();
  const [backendHealth, setBackendHealth] = useState<'healthy' | 'offline' | 'checking'>('checking');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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
      <header className="h-11 bg-[#090d14] border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between shrink-0 sticky top-0 z-30 select-none">
        {/* Left: Mobile trigger & Breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileSidebar}
            className="md:hidden p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            aria-label="Toggle mobile menu"
          >
            <Menu className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="text-slate-500 font-medium">RESEARCH_FACILITY</span>
            <span className="text-slate-700">/</span>
            <span className="text-slate-400 uppercase text-[11px]">{routeInfo.section}</span>
            <span className="text-slate-700">/</span>
            <span className="font-semibold text-sky-400">{routeInfo.title}</span>
          </div>
        </div>

        {/* Right: Search, API Status, Workspace */}
        <div className="flex items-center gap-2.5">
          {/* Quick Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded bg-[#101622] hover:bg-[#162030] border border-slate-800 text-xs text-slate-400 transition-colors"
          >
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-[11px] font-sans">Command palette...</span>
            <kbd className="font-mono text-[9px] bg-[#090d14] px-1 py-0.2 rounded border border-slate-800 text-slate-400">
              ⌘K
            </kbd>
          </button>

          {/* Backend Status Dot */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono border border-slate-800 bg-[#101622]">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                backendHealth === 'healthy'
                  ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]'
                  : backendHealth === 'offline'
                  ? 'bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.5)]'
                  : 'bg-slate-500'
              }`}
            />
            <span className={backendHealth === 'healthy' ? 'text-slate-300' : 'text-rose-400'}>
              {backendHealth === 'healthy'
                ? 'CORE_API: ONLINE'
                : backendHealth === 'offline'
                ? 'CORE_API: OFFLINE'
                : 'CONNECTING...'}
            </span>
          </div>

          {/* Workspace Pill */}
          <div className="hidden md:flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono border border-slate-800 bg-[#101622] text-slate-300">
            <Layers className="w-3 h-3 text-sky-400" />
            <span className="truncate">WS: DEFAULT_LAB</span>
          </div>

          <Link
            to="/settings"
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title="Settings & Telemetry"
          >
            <Settings className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Global Quick Search Modal */}
      <Modal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        title="Quick Navigation"
        subtitle="Search and jump directly to any research module."
        maxWidth="md"
      >
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Jump to module (e.g. Playground, Benchmarks)..."
              autoFocus
              className="w-full bg-[#131b28] border border-slate-700/80 rounded-md pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 font-sans"
            />
          </div>

          <div className="space-y-1 pt-1 text-xs">
            <Link
              to="/playground"
              onClick={() => setIsSearchOpen(false)}
              className="flex items-center justify-between p-2 rounded-md hover:bg-[#131b28] text-slate-300 transition-colors"
            >
              <span className="font-medium text-slate-200">Model Playground</span>
              <span className="text-[10px] text-slate-500 font-mono">WORKSPACE_02</span>
            </Link>
            <Link
              to="/experiments"
              onClick={() => setIsSearchOpen(false)}
              className="flex items-center justify-between p-2 rounded-md hover:bg-[#131b28] text-slate-300 transition-colors"
            >
              <span className="font-medium text-slate-200">Experiments</span>
              <span className="text-[10px] text-slate-500 font-mono">WORKSPACE_03</span>
            </Link>
            <Link
              to="/benchmarks"
              onClick={() => setIsSearchOpen(false)}
              className="flex items-center justify-between p-2 rounded-md hover:bg-[#131b28] text-slate-300 transition-colors"
            >
              <span className="font-medium text-slate-200">Benchmarks</span>
              <span className="text-[10px] text-slate-500 font-mono">EVAL_01</span>
            </Link>
            <Link
              to="/evaluators"
              onClick={() => setIsSearchOpen(false)}
              className="flex items-center justify-between p-2 rounded-md hover:bg-[#131b28] text-slate-300 transition-colors"
            >
              <span className="font-medium text-slate-200">Evaluators</span>
              <span className="text-[10px] text-slate-500 font-mono">EVAL_03</span>
            </Link>
          </div>
        </div>
      </Modal>
    </>
  );
};
