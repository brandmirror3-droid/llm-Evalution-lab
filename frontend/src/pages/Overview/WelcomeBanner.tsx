import React from 'react';
import { Badge } from '../../components/ui/Badge';
import { Shield, Terminal } from 'lucide-react';

export const WelcomeBanner: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-lab-surface to-lab-card border border-lab-border p-6 shadow-subtle">
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-3 max-w-3xl">
          <div className="flex items-center gap-2.5">
            <Badge variant="lime" size="xs">
              Phase 1 — Foundation Active
            </Badge>
            <span className="text-[11px] font-mono text-lab-text-muted">
              Architecture & Telemetry
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-lab-text-primary">
            LLM Evaluation Lab
          </h2>

          <p className="text-xs sm:text-sm text-lab-text-secondary leading-relaxed">
            LLM Evaluation Lab is an environment for systematically testing and understanding the performance, reliability, and failure patterns of language models.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-lab-text-muted pt-1">
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-lab-accent-lime" />
              Scientific rigor over synthetic metrics
            </span>
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-lab-text-secondary" />
              FastAPI + React Monorepo Foundation
            </span>
          </div>
        </div>

        <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-2 text-xs">
          <div className="p-3 rounded-lg bg-lab-bg/60 border border-lab-borderSubtle font-mono text-[11px] text-lab-text-muted space-y-1">
            <div className="flex justify-between gap-4">
              <span>Roadmap:</span>
              <span className="text-lab-text-primary font-medium">12 Phases</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Active Phase:</span>
              <span className="text-lab-accent-lime font-medium">Phase 1</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Synthetic Metrics:</span>
              <span className="text-rose-400 font-medium">Disabled</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
