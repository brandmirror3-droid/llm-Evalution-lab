import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Shell } from './components/layout/Shell';
import { OverviewPage } from './pages/Overview/OverviewPage';
import { PlaygroundPage } from './pages/FutureModules/PlaygroundPage';
import { ExperimentsPage } from './pages/FutureModules/ExperimentsPage';
import { BenchmarksPage } from './pages/FutureModules/BenchmarksPage';
import { DatasetsPage } from './pages/FutureModules/DatasetsPage';
import { EvaluatorsPage } from './pages/FutureModules/EvaluatorsPage';
import { FailureAnalysisPage } from './pages/FutureModules/FailureAnalysisPage';
import { ModelComparisonPage } from './pages/FutureModules/ModelComparisonPage';
import { ReliabilityPage } from './pages/FutureModules/ReliabilityPage';
import { SettingsPage } from './pages/Settings/SettingsPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Shell />}>
          {/* LAB Section */}
          <Route index element={<OverviewPage />} />
          <Route path="overview" element={<Navigate to="/" replace />} />
          <Route path="playground" element={<PlaygroundPage />} />
          <Route path="experiments" element={<ExperimentsPage />} />

          {/* EVALUATION Section */}
          <Route path="benchmarks" element={<BenchmarksPage />} />
          <Route path="datasets" element={<DatasetsPage />} />
          <Route path="evaluators" element={<EvaluatorsPage />} />

          {/* INTELLIGENCE Section */}
          <Route path="failure-analysis" element={<FailureAnalysisPage />} />
          <Route path="model-comparison" element={<ModelComparisonPage />} />
          <Route path="reliability" element={<ReliabilityPage />} />

          {/* SYSTEM Section */}
          <Route path="settings" element={<SettingsPage />} />

          {/* 404 Handling */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
