import React from 'react';
import { PlannedModulePlaceholder } from '../../components/modules/PlannedModulePlaceholder';

export const ModelComparisonPage: React.FC = () => {
  return (
    <PlannedModulePlaceholder
      moduleSlug="model-comparison"
      defaultTitle="Model Comparison"
      defaultPhase={8}
      defaultPhaseTitle="Model Intelligence & Comparative Analytics"
      defaultDescription="Comprehensive head-to-head model intelligence, Pareto frontiers (cost vs quality vs speed), and win-rate matrices."
      defaultCapabilities={[
        'Bradley-Terry win-rate calculations and dynamic Elo rating ladders',
        'Multi-dimensional radar charts across reasoning, safety, and domain knowledge',
        'Cost/token vs accuracy Pareto efficiency curves',
        'Differential output highlighting and side-by-side inspection',
      ]}
    />
  );
};
