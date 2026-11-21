import React, { useState, useEffect, useCallback } from 'react';
import { PageContainer } from '../../components/layout/PageContainer';
import { WelcomeBanner } from './WelcomeBanner';
import { LabStatusGrid } from './LabStatusGrid';
import { QuickActions } from './QuickActions';
import { ResearchWorkspace } from './ResearchWorkspace';
import { PlatformReadiness } from './PlatformReadiness';
import { getLabStatus } from '../../api/system';
import { LabStatusOverview } from '../../types';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const OverviewPage: React.FC = () => {
  const [statusOverview, setStatusOverview] = useState<LabStatusOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStatus = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getLabStatus();
      setStatusOverview(data);
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : 'Unable to connect to lab status service.';
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  return (
    <PageContainer maxWidth="standard">
      <div className="space-y-8">
        {/* Error notification if backend is offline or status fails */}
        {error && (
          <div className="p-4 rounded-lg bg-rose-950/40 border border-rose-800/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-rose-300">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
            <Button
              variant="outline"
              size="xs"
              onClick={loadStatus}
              icon={<RefreshCw className="w-3 h-3" />}
            >
              Retry Status Probe
            </Button>
          </div>
        )}

        {/* Section A: Welcome / Lab Identity */}
        <WelcomeBanner />

        {/* Section B: Lab Status Subsystems */}
        <LabStatusGrid
          subsystems={statusOverview?.subsystems || {}}
          providers={statusOverview?.providers || []}
          isLoading={isLoading}
          onRefresh={loadStatus}
        />

        {/* Section C: Quick Actions */}
        <QuickActions />

        {/* Section D: Research Workspace (Honest Empty State) */}
        <ResearchWorkspace />

        {/* Section E: Platform Readiness Checklist */}
        <PlatformReadiness items={statusOverview?.readiness_checklist || []} />
      </div>
    </PageContainer>
  );
};
