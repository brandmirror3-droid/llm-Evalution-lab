import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Menu,
  Search,
  Layers,
  Settings,
  Activity,
  Cpu,
} from 'lucide-react';
import { getHealth } from '../../api/system';
import { Modal } from '../ui/Modal';

interface HeaderProps {
  onOpenMobileSidebar: () => void;
}

const ROUTE_TITLES: Record<string, { title: string; section: string }> = {
  '/': { title: 'Overview', section: 'CONTROL_CENTER' },
  '/playground': { title: 'Playground', section: 'EXPERIMENTATION' },
  '/experiments': { title: 'Experiments', section: 'STUDIO' },
  '/benchmarks': { title: 'Benchmarks', section: 'EVALUATION' },
  '/datasets': { title: 'Datasets', section: 'DATA_WORKBENCH' },
  '/evaluators': { title: 'Evaluators', section: 'INSTRUMENTS' },
  '/failure-analysis': { title: 'Failure Analysis', section: 'FORENSICS' },
  '/model-comparison': { title: 'Model Comparison', section: 'ANALYTICS' },
  '/reliability': { title: 'Reliability & Diagnostics', section: 'STATISTICS' },
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
      <header className="h-10 bg-[#111315] border-b border-[#35393D] px-3 sm:px-4 flex items-center justify-between shrink-0 sticky top-0 z-30 select-none">
        {/* Left: Mobile trigger & Breadcrumbs */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenMobileSidebar}
            className="md:hidden p-1 rounded-sm text-[#929BA3] hover:text-[#D9DEE2] hover:bg-[#1C1F22]"
            aria-label="Toggle mobile menu"
          >
            <Menu className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="text-[#687179] font-medium hidden sm:inline">FACILITY</span>
            <span className="text-[#35393D] hidden sm:inline">/</span>
            <span className="text-[#929BA3] uppercase text-[10px]">{routeInfo.section}</span>
            <span className="text-[#35393D]">/</span>
            <span className="font-semibold text-cyan-400 text-xs">{routeInfo.title}</span>
          </div>
        </div>

        {/* Center / Right: Top Instrument Bar Controls */}
        <div className="flex items-center gap-2">
          {/* Research Session Badge */}
          <div className="hidden xl:flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-[10px] font-mono border border-[#35393D] bg-[#1C1F22] text-[#929BA3]">
            <Activity className="w-2.5 h-2.5 text-amber-400" />
            <span>SESSION:</span>
            <span className="text-[#D9DEE2] font-semibold">RS-8921-A</span>
          </div>

          {/* Environment Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-[10px] font-mono border border-[#35393D] bg-[#1C1F22] text-[#929BA3]">
            <Cpu className="w-2.5 h-2.5 text-purple-400" />
            <span>ENV:</span>
            <span className="text-[#D9DEE2]">DEV [Py3.14]</span>
          </div>

          {/* Quick Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-[#1C1F22] hover:bg-[#232629] border border-[#35393D] text-xs text-[#929BA3] transition-colors"
          >
            <Search className="w-3 h-3 text-[#687179]" />
            <span className="text-[11px] font-mono hidden sm:inline">Command...</span>
            <kbd className="font-mono text-[9px] bg-[#111315] px-1 py-0.2 rounded-sm border border-[#35393D] text-[#929BA3]">
              ⌘K
            </kbd>
          </button>

          {/* Backend Status Indicator */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-[10px] font-mono border border-[#35393D] bg-[#1C1F22]">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                backendHealth === 'healthy'
                  ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]'
                  : backendHealth === 'offline'
                  ? 'bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.8)]'
                  : 'bg-amber-500'
              }`}
            />
            <span className={backendHealth === 'healthy' ? 'text-[#D9DEE2]' : 'text-rose-400'}>
              {backendHealth === 'healthy'
                ? 'CORE_API: ONLINE'
                : backendHealth === 'offline'
                ? 'CORE_API: OFFLINE'
                : 'CONNECTING...'}
            </span>
          </div>

          {/* Workspace Pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-[10px] font-mono border border-[#35393D] bg-[#1C1F22] text-[#D9DEE2]">
            <Layers className="w-3 h-3 text-cyan-400" />
            <span className="truncate">WS: DEFAULT_LAB</span>
          </div>

          <Link
            to="/settings"
            className="p-1 rounded-sm hover:bg-[#1C1F22] text-[#929BA3] hover:text-[#D9DEE2] border border-transparent hover:border-[#35393D] transition-colors"
            title="Settings & Subsystems"
          >
            <Settings className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Global Quick Search Modal */}
      <Modal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        title="Command Launcher & Module Jump"
        subtitle="Direct navigation across scientific research modules."
        maxWidth="md"
      >
        <div className="space-y-3 font-mono">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#687179] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search research module..."
              autoFocus
              className="w-full bg-[#111315] border border-[#35393D] rounded-sm pl-8 pr-3 py-1.5 text-xs text-[#D9DEE2] placeholder-[#687179] focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1 pt-1 text-xs">
            <Link
              to="/playground"
              onClick={() => setIsSearchOpen(false)}
              className="flex items-center justify-between p-2 rounded-sm hover:bg-[#232629] text-[#D9DEE2] transition-colors"
            >
              <span className="font-medium text-[#D9DEE2]">Model Playground</span>
              <span className="text-[10px] text-cyan-400">WORKSPACE_02</span>
            </Link>
            <Link
              to="/experiments"
              onClick={() => setIsSearchOpen(false)}
              className="flex items-center justify-between p-2 rounded-sm hover:bg-[#232629] text-[#D9DEE2] transition-colors"
            >
              <span className="font-medium text-[#D9DEE2]">Experiment Studio</span>
              <span className="text-[10px] text-amber-400">STUDIO_03</span>
            </Link>
            <Link
              to="/benchmarks"
              onClick={() => setIsSearchOpen(false)}
              className="flex items-center justify-between p-2 rounded-sm hover:bg-[#232629] text-[#D9DEE2] transition-colors"
            >
              <span className="font-medium text-[#D9DEE2]">Benchmarks Matrix</span>
              <span className="text-[10px] text-[#929BA3]">EVAL_01</span>
            </Link>
            <Link
              to="/evaluators"
              onClick={() => setIsSearchOpen(false)}
              className="flex items-center justify-between p-2 rounded-sm hover:bg-[#232629] text-[#D9DEE2] transition-colors"
            >
              <span className="font-medium text-[#D9DEE2]">Evaluators & Rubrics</span>
              <span className="text-[10px] text-purple-400">EVAL_03</span>
            </Link>
            <Link
              to="/reliability"
              onClick={() => setIsSearchOpen(false)}
              className="flex items-center justify-between p-2 rounded-sm hover:bg-[#232629] text-[#D9DEE2] transition-colors"
            >
              <span className="font-medium text-[#D9DEE2]">Reliability & Calibration</span>
              <span className="text-[10px] text-cyan-400">DIAGNOSTICS_09</span>
            </Link>
          </div>
        </div>
      </Modal>
    </>
  );
};
