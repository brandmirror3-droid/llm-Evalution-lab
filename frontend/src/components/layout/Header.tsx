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
      <header className="h-12 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shrink-0 sticky top-0 z-30">
        {/* Left: Mobile trigger & Breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileSidebar}
            className="md:hidden p-1 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100"
            aria-label="Toggle mobile menu"
          >
            <Menu className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-medium">Lab</span>
            <span className="text-slate-300">/</span>
            <span className="font-semibold text-slate-900">{routeInfo.title}</span>
          </div>
        </div>

        {/* Right: Search, API Status, Workspace */}
        <div className="flex items-center gap-3">
          {/* Quick Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-slate-500 transition-colors"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px]">Search modules...</span>
            <kbd className="font-mono text-[9px] bg-white px-1 py-0.2 rounded border border-slate-200 text-slate-400">
              ⌘K
            </kbd>
          </button>

          {/* Backend Status Dot */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium border border-slate-200 bg-slate-50">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                backendHealth === 'healthy'
                  ? 'bg-emerald-500'
                  : backendHealth === 'offline'
                  ? 'bg-rose-500'
                  : 'bg-slate-400'
              }`}
            />
            <span className="text-slate-600">
              {backendHealth === 'healthy'
                ? 'API Online'
                : backendHealth === 'offline'
                ? 'API Offline'
                : 'Connecting...'}
            </span>
          </div>

          {/* Workspace Pill */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px] font-medium text-slate-700">Default Lab</span>
          </div>

          <Link
            to="/settings"
            className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
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
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 font-sans"
            />
          </div>

          <div className="space-y-1 pt-1 text-xs">
            <Link
              to="/playground"
              onClick={() => setIsSearchOpen(false)}
              className="flex items-center justify-between p-2 rounded-md hover:bg-slate-50 transition-colors"
            >
              <span className="font-medium text-slate-800">Model Playground</span>
              <span className="text-[10px] text-slate-400">Prompt Testing</span>
            </Link>
            <Link
              to="/experiments"
              onClick={() => setIsSearchOpen(false)}
              className="flex items-center justify-between p-2 rounded-md hover:bg-slate-50 transition-colors"
            >
              <span className="font-medium text-slate-800">Experiments</span>
              <span className="text-[10px] text-slate-400">Run Workbench</span>
            </Link>
            <Link
              to="/benchmarks"
              onClick={() => setIsSearchOpen(false)}
              className="flex items-center justify-between p-2 rounded-md hover:bg-slate-50 transition-colors"
            >
              <span className="font-medium text-slate-800">Benchmarks</span>
              <span className="text-[10px] text-slate-400">Standardized Suites</span>
            </Link>
            <Link
              to="/evaluators"
              onClick={() => setIsSearchOpen(false)}
              className="flex items-center justify-between p-2 rounded-md hover:bg-slate-50 transition-colors"
            >
              <span className="font-medium text-slate-800">Evaluators</span>
              <span className="text-[10px] text-slate-400">Rubric Configuration</span>
            </Link>
          </div>
        </div>
      </Modal>
    </>
  );
};
