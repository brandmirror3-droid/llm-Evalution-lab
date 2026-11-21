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
  isAvailableInPhase1: boolean;
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
        isAvailableInPhase1: true,
      },
      {
        name: 'Playground',
        path: '/playground',
        icon: Terminal,
        phase: 2,
        isAvailableInPhase1: false,
      },
      {
        name: 'Experiments',
        path: '/experiments',
        icon: FlaskConical,
        phase: 2,
        isAvailableInPhase1: false,
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
        isAvailableInPhase1: false,
      },
      {
        name: 'Datasets',
        path: '/datasets',
        icon: Database,
        phase: 3,
        isAvailableInPhase1: false,
      },
      {
        name: 'Evaluators',
        path: '/evaluators',
        icon: CheckSquare,
        phase: 4,
        isAvailableInPhase1: false,
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
        isAvailableInPhase1: false,
      },
      {
        name: 'Model Comparison',
        path: '/model-comparison',
        icon: Scale,
        phase: 8,
        isAvailableInPhase1: false,
      },
      {
        name: 'Reliability',
        path: '/reliability',
        icon: ShieldCheck,
        phase: 9,
        isAvailableInPhase1: false,
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
        isAvailableInPhase1: true,
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
    <div className="flex flex-col h-full bg-white border-r border-slate-200 text-slate-600 select-none">
      {/* Brand Header */}
      <div className="h-14 px-4 border-b border-slate-100 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-white shrink-0 shadow-subtle">
            <FlaskRound className="w-4 h-4 text-sky-400" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-slate-900 tracking-tight truncate">
                EVALUATION LAB
              </span>
              <span className="text-[10px] font-mono text-sky-600 font-semibold tracking-wider">
                Research Workstation
              </span>
            </div>
          )}
        </div>

        {/* Desktop Collapse Toggle */}
        <button
          onClick={onToggleCollapse}
          className="hidden md:flex p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>

        {/* Mobile Close Button */}
        <button
          onClick={onCloseMobile}
          className="md:hidden p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-5">
        {NAVIGATION_SECTIONS.map((section) => (
          <div key={section.title} className="space-y-1">
            {!isCollapsed && (
              <h4 className="px-2.5 py-1 text-[10px] font-semibold text-slate-400 tracking-wider uppercase">
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
                      className={`group relative flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors duration-150 ${
                        isActive
                          ? 'text-slate-900 font-semibold bg-slate-100'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                      title={isCollapsed ? `${item.name} (Phase ${item.phase})` : undefined}
                    >
                      {/* Left accent bar for active item */}
                      {isActive && (
                        <motion.span
                          layoutId={shouldReduceMotion ? undefined : 'sidebarActiveBar'}
                          className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-slate-900 rounded-r z-10"
                          transition={{
                            type: 'spring',
                            stiffness: 420,
                            damping: 38,
                          }}
                        />
                      )}

                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive
                            ? 'text-sky-600'
                            : 'text-slate-400 group-hover:text-slate-600'
                        }`}
                      />

                      {!isCollapsed && (
                        <div className="flex items-center justify-between w-full min-w-0">
                          <span className="truncate">{item.name}</span>
                          {!item.isAvailableInPhase1 && (
                            <span className="text-[9px] font-mono font-medium px-1.5 py-0.2 rounded bg-slate-100 border border-slate-200/60 text-slate-500 group-hover:text-slate-700">
                              P{item.phase}
                            </span>
                          )}
                        </div>
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
        <div className="p-3 border-t border-slate-100 bg-slate-50/60 text-[11px] text-slate-500 flex items-center justify-between">
          <span className="font-mono text-slate-400">v0.1.0-alpha</span>
          <span className="text-emerald-700 font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Core Ready
          </span>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar (expanded by default) */}
      <aside
        className={`hidden md:block transition-all duration-200 ease-apple shrink-0 ${
          isCollapsed ? 'w-16' : 'w-56'
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
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={onCloseMobile}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 35 }}
              className="relative w-64 max-w-[80vw] h-full z-10 shadow-modal"
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
