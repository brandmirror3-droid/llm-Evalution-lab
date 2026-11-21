import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { IntelligencePulseCanvas } from '../../components/visualization/IntelligencePulseCanvas';
import { Shield, Terminal } from 'lucide-react';
import { heroContainerVariants, heroChildVariants } from '../../utils/motion';

export const WelcomeBanner: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-lab-card/90 via-lab-surface to-lab-bg border border-lab-border shadow-card">
      {/* Living signature canvas background */}
      <div className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none">
        <IntelligencePulseCanvas
          variant="background"
          showLabels={false}
          interactive={true}
        />
      </div>

      {/* Subtle radial vignette to ensure high-contrast readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-lab-bg/95 via-lab-bg/80 to-transparent pointer-events-none" />

      {/* Staggered entrance content */}
      <motion.div
        variants={shouldReduceMotion ? undefined : heroContainerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 p-6 sm:p-8 lg:p-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8"
      >
        <div className="space-y-4 max-w-2xl">
          {/* Eyebrow appears first */}
          <motion.div variants={shouldReduceMotion ? undefined : heroChildVariants}>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-lab-surface/90 border border-lab-border text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-lab-accent-lime animate-pulse" />
              <span className="font-mono text-[11px] text-lab-accent-lime uppercase tracking-wider font-semibold">
                Phase 1 Active
              </span>
              <span className="text-lab-text-faint">|</span>
              <span className="text-[11px] text-lab-text-secondary">
                Foundation & Architecture
              </span>
            </div>
          </motion.div>

          {/* Main heading reveals smoothly */}
          <motion.h2
            variants={shouldReduceMotion ? undefined : heroChildVariants}
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-lab-text-primary"
          >
            The Scientific Lab for <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-lab-text-primary to-lab-text-secondary">
              LLM Evaluation & Reliability
            </span>
          </motion.h2>

          {/* Description fades in afterward */}
          <motion.p
            variants={shouldReduceMotion ? undefined : heroChildVariants}
            className="text-xs sm:text-sm text-lab-text-secondary leading-relaxed max-w-xl"
          >
            LLM Evaluation Lab is an environment for systematically testing and understanding the performance, reliability, and failure patterns of language models. Built with mathematical precision and zero fabricated metrics.
          </motion.p>

          {/* Badges enter with slight stagger */}
          <motion.div
            variants={shouldReduceMotion ? undefined : heroChildVariants}
            className="flex flex-wrap items-center gap-4 text-xs text-lab-text-muted pt-2"
          >
            <span className="flex items-center gap-1.5 text-lab-text-secondary">
              <Shield className="w-3.5 h-3.5 text-lab-accent-lime" />
              Empirical evaluation over vanity benchmarks
            </span>
            <span className="flex items-center gap-1.5 text-lab-text-secondary">
              <Terminal className="w-3.5 h-3.5 text-lab-text-muted" />
              FastAPI v1 + React Monorepo Foundation
            </span>
          </motion.div>
        </div>

        {/* Right side: Architecture Identity Card */}
        <motion.div
          variants={shouldReduceMotion ? undefined : heroChildVariants}
          className="shrink-0 flex flex-col items-start lg:items-end"
        >
          <div className="w-full sm:w-72 p-4 rounded-xl bg-lab-surface/80 backdrop-blur-md border border-lab-border space-y-3 shadow-subtle">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-lab-borderSubtle">
              <span className="font-mono text-lab-text-muted uppercase text-[10px] tracking-wider">
                Pipeline Lifecycle
              </span>
              <span className="font-mono text-[10px] text-lab-accent-lime flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-lab-accent-lime" />
                Live Architecture
              </span>
            </div>

            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex items-center justify-between py-0.5 text-lab-text-secondary">
                <span className="text-lab-text-muted">01 INPUT</span>
                <span className="text-[11px] text-lab-text-primary">Tokens & Datasets</span>
              </div>
              <div className="flex items-center justify-between py-0.5 text-lab-text-secondary">
                <span className="text-lab-text-muted">02 MODEL</span>
                <span className="text-[11px] text-lab-text-primary">Parameters & Attention</span>
              </div>
              <div className="flex items-center justify-between py-0.5 text-lab-text-secondary">
                <span className="text-lab-text-muted">03 EVAL</span>
                <span className="text-[11px] text-lab-text-primary">Rubrics & Judges</span>
              </div>
              <div className="flex items-center justify-between py-0.5 text-lab-text-secondary">
                <span className="text-lab-text-muted">04 INSIGHT</span>
                <span className="text-[11px] text-lab-accent-lime">Failure Taxonomies</span>
              </div>
            </div>

            <div className="pt-2 border-t border-lab-borderSubtle flex items-center justify-between text-[11px] text-lab-text-muted">
              <span>Simulation mode:</span>
              <span className="font-mono text-rose-400">Strictly Disabled</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
