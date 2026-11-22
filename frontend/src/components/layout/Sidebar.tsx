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
    <div className="flex flex-col h-full bg-white border-r border-slate-200 text-slate-600 select-none">
      {/* Brand Header */}
      <div className="h-12 px-3.5 border-b border-slate-100 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-6 h-6 rounded-md bg-slate-900 flex items-center justify-center text-white shrink-0">
            <FlaskRound className="w-3.5 h-3.5 text-sky-400" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-slate-900 tracking-tight truncate">
                EVALUATION LAB
              </span>
              <span className="text-[10px] text-slate-400 font-normal">
                Research Workstation
              </span>
            </div>
          )}
        </div>

        {/* Desktop Collapse Toggle */}
        <button
          onClick={onToggleCollapse}
          className="hidden md:flex p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
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
          className="md:hidden p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
        {NAVIGATION_SECTIONS.map((section) => (
          <div key={section.title} className="space-y-0.5">
            {!isCollapsed && (
              <h4 className="px-2 py-1 text-[10px] font-medium text-slate-400 uppercase tracking-wider">
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
                      className={`group relative flex items-center gap-2.5 px-2 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        isActive
                          ? 'text-slate-900 bg-slate-100 font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                      title={isCollapsed ? item.name : undefined}
                    >
                      {/* Left accent indicator for active item */}
                      {isActive && (
                        <motion.span
                          layoutId={shouldReduceMotion ? undefined : 'sidebarActiveBar'}
                          className="absolute left-0 top-1 bottom-1 w-0.5 bg-slate-900 rounded-r z-10"
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
                        <span className="truncate">{item.name}</span>
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
        <div className="p-2.5 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between">
          <span className="font-mono">Phase 1</span>
          <span className="flex items-center gap-1.5 text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Foundation Active
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
