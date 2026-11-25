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
    <div className="flex flex-col h-full bg-[#111315] border-r border-[#35393D] text-[#D9DEE2] select-none font-mono">
      {/* Brand Header */}
      <div className="h-10 px-2.5 border-b border-[#35393D] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-5.5 h-5.5 rounded-sm bg-[#1C1F22] border border-[#35393D] flex items-center justify-center text-white shrink-0">
            <FlaskRound className="w-3 h-3 text-cyan-400" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-bold text-[#D9DEE2] tracking-wider truncate">
                EVALUATION LAB
              </span>
              <span className="text-[8px] text-[#687179] tracking-tight">
                RESEARCH_FACILITY v0.1
              </span>
            </div>
          )}
        </div>

        {/* Desktop Collapse Toggle */}
        <button
          onClick={onToggleCollapse}
          className="hidden md:flex p-1 rounded-sm hover:bg-[#1C1F22] text-[#929BA3] hover:text-[#D9DEE2] transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-3 h-3" />
          ) : (
            <ChevronLeft className="w-3 h-3" />
          )}
        </button>

        {/* Mobile Close Button */}
        <button
          onClick={onCloseMobile}
          className="md:hidden p-1 rounded-sm hover:bg-[#1C1F22] text-[#929BA3] hover:text-[#D9DEE2] transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-1.5 py-2 space-y-2.5">
        {NAVIGATION_SECTIONS.map((section) => (
          <div key={section.title} className="space-y-0.5">
            {!isCollapsed && (
              <h4 className="px-2 py-0.5 text-[8.5px] font-mono text-[#687179] uppercase tracking-widest font-semibold">
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
                      className={`group relative flex items-center gap-2 px-2 py-1.5 rounded-sm text-xs transition-colors ${
                        isActive
                          ? 'text-cyan-300 bg-[#1C1F22] font-semibold border border-[#35393D]'
                          : 'text-[#929BA3] hover:text-[#D9DEE2] hover:bg-[#17191B] border border-transparent'
                      }`}
                      title={isCollapsed ? item.name : undefined}
                    >
                      {/* Left accent indicator for active item */}
                      {isActive && (
                        <motion.span
                          layoutId={shouldReduceMotion ? undefined : 'sidebarActiveBar'}
                          className="absolute left-0 top-1 bottom-1 w-0.5 bg-cyan-400 rounded-r z-10"
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
                            ? 'text-cyan-400'
                            : 'text-[#687179] group-hover:text-[#929BA3]'
                        }`}
                      />

                      {!isCollapsed && (
                        <span className="truncate tracking-tight text-[11px]">{item.name}</span>
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
        <div className="p-2 border-t border-[#35393D] text-[9px] font-mono text-[#687179] flex items-center justify-between bg-[#101214]">
          <span className="text-[#929BA3]">PHASE_01</span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
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
        className={`hidden md:block transition-all duration-150 ease-apple shrink-0 ${
          isCollapsed ? 'w-12' : 'w-48'
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
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={onCloseMobile}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 35 }}
              className="relative w-56 max-w-[80vw] h-full z-10 shadow-modal"
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
