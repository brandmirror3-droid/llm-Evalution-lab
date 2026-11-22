import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  LayoutDashboard,
  Terminal,
  FlaskConical,
  Gauge,
  Database,
  CheckSquare,
  AlertOctagon,
  Scale,
  ShieldCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  FlaskRound,
  X,
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  phase: number;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const NAVIGATION_SECTIONS: NavSection[] = [
  {
    title: 'WORKSPACE',
    items: [
      {
        name: 'Overview',
        path: '/',
        icon: LayoutDashboard,
        phase: 1,
      },
      {
        name: 'Playground',
        path: '/playground',
        icon: Terminal,
        phase: 2,
      },
      {
        name: 'Experiments',
        path: '/experiments',
        icon: FlaskConical,
        phase: 2,
      },
    ],
  },
  {
    title: 'EVALUATION',
    items: [
      {
        name: 'Benchmarks',
        path: '/benchmarks',
        icon: Gauge,
        phase: 3,
      },
      {
        name: 'Datasets',
        path: '/datasets',
        icon: Database,
        phase: 3,
      },
      {
        name: 'Evaluators',
        path: '/evaluators',
        icon: CheckSquare,
        phase: 4,
      },
    ],
  },
  {
    title: 'ANALYSIS & INTELLIGENCE',
    items: [
      {
        name: 'Failure Analysis',
        path: '/failure-analysis',
        icon: AlertOctagon,
        phase: 6,
      },
      {
        name: 'Model Comparison',
        path: '/model-comparison',
        icon: Scale,
        phase: 8,
      },
      {
        name: 'Reliability',
        path: '/reliability',
        icon: ShieldCheck,
        phase: 9,
      },
    ],
  },
  {
    title: 'SYSTEM',
    items: [
      {
        name: 'Settings',
        path: '/settings',
        icon: Settings,
        phase: 1,
      },
    ],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}) => {
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0a0e17] border-r border-slate-800/80 text-slate-300 select-none">
      {/* Brand Header */}
      <div className="h-11 px-3 border-b border-slate-800/80 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-6 h-6 rounded bg-[#101622] border border-slate-700/60 flex items-center justify-center text-white shrink-0 shadow-sm">
            <FlaskRound className="w-3.5 h-3.5 text-sky-400" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-bold text-slate-100 tracking-wider font-mono truncate">
                EVALUATION LAB
              </span>
              <span className="text-[9px] text-slate-500 font-mono tracking-tight">
                RESEARCH_FACILITY v0.1
              </span>
            </div>
          )}
        </div>

        {/* Desktop Collapse Toggle */}
        <button
          onClick={onToggleCollapse}
          className="hidden md:flex p-1 rounded hover:bg-slate-800 text-slate-500 hover:text-slate-300 transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-3.5 h-3.5" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5" />
          )}
        </button>

        {/* Mobile Close Button */}
        <button
          onClick={onCloseMobile}
          className="md:hidden p-1 rounded hover:bg-slate-800 text-slate-500 hover:text-slate-300 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-3.5">
        {NAVIGATION_SECTIONS.map((section) => (
          <div key={section.title} className="space-y-0.5">
            {!isCollapsed && (
              <h4 className="px-2 py-1 text-[9px] font-mono font-medium text-slate-500 uppercase tracking-widest">
                {section.title}
              </h4>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.path === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(item.path);

                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      onClick={onCloseMobile}
                      className={`group relative flex items-center gap-2.5 px-2 py-1.5 rounded text-xs font-medium transition-colors ${
                        isActive
                          ? 'text-sky-300 bg-[#131b28] font-semibold'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-[#0f1522]'
                      }`}
                      title={isCollapsed ? item.name : undefined}
                    >
                      {/* Left accent indicator for active item */}
                      {isActive && (
                        <motion.span
                          layoutId={shouldReduceMotion ? undefined : 'sidebarActiveBar'}
                          className="absolute left-0 top-1 bottom-1 w-0.5 bg-sky-400 rounded-r z-10 shadow-[0_0_8px_rgba(56,189,248,0.8)]"
                          transition={{
                            type: 'spring',
                            stiffness: 420,
                            damping: 38,
                          }}
                        />
                      )}

                      <Icon
                        className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                          isActive
                            ? 'text-sky-400'
                            : 'text-slate-500 group-hover:text-slate-300'
                        }`}
                      />

                      {!isCollapsed && (
                        <span className="truncate tracking-tight">{item.name}</span>
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      {!isCollapsed && (
        <div className="p-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-500 flex items-center justify-between bg-[#080c14]">
          <span className="text-slate-400">PHASE_01</span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
            CORE ACTIVE
          </span>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={`hidden md:block transition-all duration-200 ease-apple shrink-0 ${
          isCollapsed ? 'w-14' : 'w-52'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm"
              onClick={onCloseMobile}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 35 }}
              className="relative w-60 max-w-[80vw] h-full z-10 shadow-modal"
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
