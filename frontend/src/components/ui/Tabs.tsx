import React from 'react';

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
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-1 border-b border-lab-borderSubtle ${className}`}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-medium border-b-2 -mb-px transition-colors ${
              isActive
                ? 'border-lab-accent-lime text-lab-text-primary'
                : 'border-transparent text-lab-text-muted hover:text-lab-text-secondary hover:border-neutral-700'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && tab.count !== null && (
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isActive
                    ? 'bg-lab-accent-lime/15 text-lab-accent-lime'
                    : 'bg-lab-surface text-lab-text-muted'
                }`}
              >
                {tab.count}
              </span>
            )}
            {tab.badge}
          </button>
        );
      })}
    </div>
  );
};
