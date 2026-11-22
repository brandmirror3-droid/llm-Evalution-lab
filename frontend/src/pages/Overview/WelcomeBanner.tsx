import React from 'react';
import { Button } from '../../components/ui/Button';
import { Plus, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';

interface WelcomeBannerProps {
  onNewExperiment?: () => void;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ onNewExperiment }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
      <div className="space-y-1">
        <h1 className="text-lg font-semibold text-slate-900 tracking-tight">
          Research Command Center
        </h1>
        <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
          Systematically measure accuracy, detect hallucinations, and evaluate foundation models across empirical testing suites.
        </p>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        <Link to="/playground">
          <Button
            variant="secondary"
            size="sm"
            icon={<Terminal className="w-3.5 h-3.5" />}
          >
            Open Playground
          </Button>
        </Link>
        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="w-3.5 h-3.5" />}
          onClick={onNewExperiment}
        >
          New Experiment
        </Button>
      </div>
    </div>
  );
};
