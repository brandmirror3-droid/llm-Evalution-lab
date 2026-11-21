import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { SignalWaveformCanvas } from '../../components/visualization/SignalWaveformCanvas';
import { ShieldCheck, Terminal, ArrowRight, Layers, FileCode } from 'lucide-react';
import { Link } from 'react-router-dom';
import { heroContainerVariants, heroChildVariants } from '../../utils/motion';

interface WelcomeBannerProps {
  onOpenRoadmap?: () => void;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ onOpenRoadmap }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/90 shadow-card">
      {/* Background scientific signal canvas */}
      <div className="absolute inset-0 opacity-45 pointer-events-none">
        <SignalWaveformCanvas variant="banner" interactive={true} />
      </div>

      {/* Subtle linear white fade over canvas */}
      <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-white/40 pointer-events-none" />

      {/* Main hero editorial content */}
      <motion.div
        variants={shouldReduceMotion ? undefined : heroContainerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 p-6 sm:p-8 lg:p-9 flex flex-col justify-between gap-6"
      >
        <div className="space-y-3.5 max-w-2xl">
          {/* Eyebrow */}
          <motion.div variants={shouldReduceMotion ? undefined : heroChildVariants}>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              <span className="font-mono text-[10px] text-slate-700 font-semibold tracking-wider uppercase">
                Phase 1 Active
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-[11px] text-slate-500 font-medium">
                Lab Foundation & Architecture
              </span>
            </div>
          </motion.div>

          {/* Strong specific headline */}
          <motion.h2
            variants={shouldReduceMotion ? undefined : heroChildVariants}
            className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight"
          >
            Scientific Workstation for Empirical LLM Evaluation & Reliability
          </motion.h2>

          {/* Clear purpose statement */}
          <motion.p
            variants={shouldReduceMotion ? undefined : heroChildVariants}
            className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl"
          >
            Systematically measure accuracy, detect hallucinations, analyze failure modes, and benchmark model intelligence across controlled experimental environments — with verifiable empirical rigor.
          </motion.p>

          {/* Primary & Secondary actions */}
          <motion.div
            variants={shouldReduceMotion ? undefined : heroChildVariants}
            className="pt-2 flex flex-wrap items-center gap-3"
          >
            <Link to="/playground">
              <Button
                variant="primary"
                size="sm"
                icon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Explore Playground Instrument
              </Button>
            </Link>

            {onOpenRoadmap && (
              <Button
                variant="secondary"
                size="sm"
                onClick={onOpenRoadmap}
                icon={<Layers className="w-3.5 h-3.5 text-slate-400" />}
              >
                Inspect 12-Phase Roadmap
              </Button>
            )}
          </motion.div>
        </div>

        {/* Bottom subtle metadata indicators */}
        <motion.div
          variants={shouldReduceMotion ? undefined : heroChildVariants}
          className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500"
        >
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Verified Telemetry Active
            </span>
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-slate-400" />
              FastAPI v1 Backend Connected
            </span>
            <span className="flex items-center gap-1.5">
              <FileCode className="w-3.5 h-3.5 text-slate-400" />
              SQLAlchemy 2.0 Async
            </span>
          </div>

          <div className="font-mono text-[11px] text-slate-400">
            SIMULATION MODE: <span className="text-slate-700 font-semibold">STRICTLY DISABLED</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
