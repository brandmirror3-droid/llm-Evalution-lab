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
    <div className={`flex items-center gap-1 border-b border-[#35393D] ${className}`}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`relative flex items-center gap-2 px-3 py-1.5 text-xs font-mono font-medium transition-colors select-none ${
              isActive
                ? 'text-[#D9DEE2] font-semibold'
                : 'text-[#929BA3] hover:text-[#D9DEE2]'
            }`}
          >
            <span className="relative z-10 uppercase tracking-wider text-[11px]">{tab.label}</span>
            {tab.count !== undefined && tab.count !== null && (
              <span
                className={`relative z-10 text-[9px] font-mono px-1 py-0.2 rounded-sm ${
                  isActive
                    ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-700/60 font-semibold'
                    : 'bg-[#232629] text-[#929BA3] border border-[#35393D]'
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
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400"
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
