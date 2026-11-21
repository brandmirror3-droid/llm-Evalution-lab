import React from 'react';
import { PlannedModulePlaceholder } from '../../components/modules/PlannedModulePlaceholder';

export const ExperimentsPage: React.FC = () => {
  return (
    <PlannedModulePlaceholder
      moduleSlug="experiments"
      defaultTitle="Experiments"
      defaultPhase={2}
      defaultPhaseTitle="Model Playground & Integration"
      defaultDescription="Structured experiment tracking environment for prompt versions, parameter sweeps, and model checkpoints."
      defaultCapabilities={[
        'Lineage tracking for model prompts and prompt templates',
        'Parameter sweep runs with output diffing',
        'Artifact persistence and JSON schema validation',
        'Hypothesis tracking and tag-based experiment organization',
      ]}
    />
  );
};
