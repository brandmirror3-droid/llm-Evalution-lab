import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export interface TabItem {
  id: string;
  label: string;
  count?: number | null;
  badge?: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
  idPrefix?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = '',
  idPrefix = 'tab',
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className={`flex items-center gap-1 border-b border-slate-800 ${className}`}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`relative flex items-center gap-2 px-3 py-2 text-xs font-medium transition-colors select-none ${
              isActive
                ? 'text-sky-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="relative z-10">{tab.label}</span>
            {tab.count !== undefined && tab.count !== null && (
              <span
                className={`relative z-10 text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isActive
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30 font-medium'
                    : 'bg-slate-800/80 text-slate-400 border border-slate-700/50'
                }`}
              >
                {tab.count}
              </span>
            )}
            {tab.badge && <span className="relative z-10">{tab.badge}</span>}

            {/* Sliding active border indicator */}
            {isActive && (
              <motion.span
                layoutId={shouldReduceMotion ? undefined : `${idPrefix}-active-indicator`}
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-400 rounded-t"
                transition={{
                  type: 'spring',
                  stiffness: 420,
                  damping: 38,
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};
