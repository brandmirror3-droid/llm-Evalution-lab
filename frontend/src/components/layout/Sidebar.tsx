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
    title: 'LAB',
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
    title: 'INTELLIGENCE',
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
    <div className="flex flex-col h-full bg-lab-surface border-r border-lab-border text-lab-text-secondary select-none">
      {/* Brand Header */}
      <div className="h-14 px-4 border-b border-lab-borderSubtle flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-7 h-7 rounded-lg bg-lab-card border border-lab-border flex items-center justify-center text-lab-accent-lime shrink-0 shadow-subtle group">
            <FlaskRound className="w-4 h-4 transition-transform duration-200 group-hover:rotate-12" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-lab-text-primary tracking-tight truncate">
                EVALUATION LAB
              </span>
              <span className="text-[10px] font-mono text-lab-accent-lime uppercase tracking-wider">
                Phase 1 Active
              </span>
            </div>
          )}
        </div>

        {/* Desktop Collapse Toggle */}
        <button
          onClick={onToggleCollapse}
          className="hidden md:flex p-1.5 rounded-md hover:bg-lab-card text-lab-text-muted hover:text-lab-text-primary transition-all duration-150 ease-apple"
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
          className="md:hidden p-1.5 rounded-md hover:bg-lab-card text-lab-text-muted hover:text-lab-text-primary transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-5">
        {NAVIGATION_SECTIONS.map((section) => (
          <div key={section.title} className="space-y-1">
            {!isCollapsed && (
              <h4 className="px-2.5 py-1 text-[10px] font-mono font-semibold text-lab-text-faint tracking-wider uppercase transition-opacity duration-200">
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
                      className={`group relative flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors duration-150 ease-apple ${
                        isActive
                          ? 'text-lab-text-primary'
                          : 'text-lab-text-secondary hover:text-lab-text-primary hover:bg-lab-card/60'
                      }`}
                      title={isCollapsed ? `${item.name} (Phase ${item.phase})` : undefined}
                    >
                      {/* Smooth Gliding Active Indicator Pill */}
                      {isActive && (
                        <motion.span
                          layoutId={shouldReduceMotion ? undefined : 'sidebarActivePill'}
                          className="absolute inset-0 bg-lab-card border border-lab-border rounded-lg shadow-subtle z-0"
                          transition={{
                            type: 'spring',
                            stiffness: 420,
                            damping: 38,
                          }}
                        />
                      )}

                      {/* Active green accent left bar */}
                      {isActive && (
                        <motion.span
                          layoutId={shouldReduceMotion ? undefined : 'sidebarActiveBar'}
                          className="absolute left-0 top-2 bottom-2 w-0.5 bg-lab-accent-lime rounded-r z-10"
                          transition={{
                            type: 'spring',
                            stiffness: 420,
                            damping: 38,
                          }}
                        />
                      )}

                      <Icon
                        className={`w-4 h-4 shrink-0 relative z-10 transition-transform duration-150 ease-apple group-hover:scale-105 ${
                          isActive
                            ? 'text-lab-accent-lime'
                            : 'text-lab-text-muted group-hover:text-lab-text-secondary'
                        }`}
                      />

                      {!isCollapsed && (
                        <div className="flex items-center justify-between w-full min-w-0 relative z-10">
                          <span className="truncate">{item.name}</span>
                          {!item.isAvailableInPhase1 && (
                            <span className="text-[9px] font-mono font-medium px-1.5 py-0.2 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 group-hover:text-neutral-300 transition-colors">
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
        <div className="p-3 border-t border-lab-borderSubtle bg-lab-bg/40 text-[11px] font-mono text-lab-text-muted flex items-center justify-between transition-opacity duration-200">
          <span>v0.1.0-alpha</span>
          <span className="text-emerald-400/90 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Lab Core
          </span>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar with smooth width transition */}
      <aside
        className={`hidden md:block transition-all duration-300 ease-apple shrink-0 ${
          isCollapsed ? 'w-16' : 'w-56'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer with smooth fade and slide */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/75 backdrop-blur-sm"
              onClick={onCloseMobile}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 35 }}
              className="relative w-64 max-w-[80vw] h-full z-10 shadow-cardHover"
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
