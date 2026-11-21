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
    <div className={`flex items-center gap-1 border-b border-lab-borderSubtle ${className}`}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`relative flex items-center gap-2 px-3.5 py-2.5 text-xs font-medium transition-colors select-none ${
              isActive
                ? 'text-lab-text-primary'
                : 'text-lab-text-muted hover:text-lab-text-secondary'
            }`}
          >
            <span className="relative z-10">{tab.label}</span>
            {tab.count !== undefined && tab.count !== null && (
              <span
                className={`relative z-10 text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isActive
                    ? 'bg-lab-accent-lime/15 text-lab-accent-lime'
                    : 'bg-lab-surface text-lab-text-muted'
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
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-lab-accent-lime rounded-t"
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 35,
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};
