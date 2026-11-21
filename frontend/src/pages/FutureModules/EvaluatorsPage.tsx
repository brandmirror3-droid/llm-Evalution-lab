import React from 'react';
import { PlannedModulePlaceholder } from '../../components/modules/PlannedModulePlaceholder';

export const EvaluatorsPage: React.FC = () => {
  return (
    <PlannedModulePlaceholder
      moduleSlug="evaluators"
      defaultTitle="Evaluators"
      defaultPhase={4}
      defaultPhaseTitle="Evaluation & Scoring Engine"
      defaultDescription="Automated scoring engines, rule-based validators, semantic similarity evaluators, and calibrated LLM-as-a-Judge pipelines."
      defaultCapabilities={[
        'Deterministic exact-match, regex, and JSON schema validators',
        'Embedding-based semantic similarity scoring (cosine distance)',
        'Calibrated LLM-as-a-Judge rubrics with bias mitigation',
        'Composite multi-metric scoring pipelines with custom weights',
      ]}
    />
  );
};
