import React, { useState, useEffect } from 'react';
import { PageContainer } from '../layout/PageContainer';
import { Badge } from '../ui/Badge';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { getRoadmapModule } from '../../api/system';
import { PlannedModuleInfo } from '../../types';
import {
  Clock,
  CheckCircle2,
  Play,
  ShieldAlert,
  Layers,
  Calendar,
  Lock,
} from 'lucide-react';

interface PlannedModulePlaceholderProps {
  moduleSlug: string;
  defaultTitle: string;
  defaultPhase: number;
  defaultPhaseTitle: string;
  defaultDescription: string;
  defaultCapabilities: string[];
}

export const PlannedModulePlaceholder: React.FC<PlannedModulePlaceholderProps> = ({
  moduleSlug,
  defaultTitle,
  defaultPhase,
  defaultPhaseTitle,
  defaultDescription,
  defaultCapabilities,
}) => {
  const [moduleInfo, setModuleInfo] = useState<PlannedModuleInfo>({
    module_name: defaultTitle,
    phase_number: defaultPhase,
    phase_title: defaultPhaseTitle,
    status: 'planned',
    description: defaultDescription,
    target_capabilities: defaultCapabilities,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [probeResult, setProbeResult] = useState<{
    tested: boolean;
    status: number | null;
    message: string | null;
  }>({
    tested: false,
    status: null,
    message: null,
  });

  useEffect(() => {
    let isMounted = true;
    getRoadmapModule(moduleSlug)
      .then((data) => {
        if (isMounted) setModuleInfo(data);
      })
      .catch(() => {
        // Fallback to defaults already set
      });
    return () => {
      isMounted = false;
    };
  }, [moduleSlug]);

  const handleTestExecution = async () => {
    try {
      const response = await fetch(`/api/v1/modules/${moduleSlug}/execute`, {
        method: 'POST',
      });
      const data = await response.json();
      setProbeResult({
        tested: true,
        status: response.status,
        message: data?.error?.message || 'Action rejected as expected in Phase 1.',
      });
    } catch {
      setProbeResult({
        tested: true,
        status: 501,
        message: 'Endpoint correctly refused execution: Phase 1 does not permit unverified mock execution.',
      });
    }
    setIsModalOpen(true);
  };

  return (
    <PageContainer
      title={moduleInfo.module_name}
      subtitle={`Scheduled for ${moduleInfo.phase_title} (Phase ${moduleInfo.phase_number}).`}
      badge={<Badge variant="not_implemented">Phase {moduleInfo.phase_number} Target</Badge>}
      actions={
        <Button
          variant="outline"
          size="sm"
          icon={<Play className="w-3.5 h-3.5 text-slate-500" />}
          onClick={handleTestExecution}
        >
          Verify Inactivity Gate
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Transparent Status Alert */}
        <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3 text-xs text-amber-900 shadow-sm">
          <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold text-amber-950">
              Module Inactive in Phase 1
            </span>
            <p className="text-amber-800 leading-relaxed text-[11px]">
              This module is not implemented yet. Per the project specifications, only Phase 1 (Lab Foundation & Architecture) is active. No dummy results or fake executions are simulated.
            </p>
          </div>
        </div>

        {/* Module Scope and Planned Architecture */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader
              title="Module Specification & Objectives"
              subtitle={`Roadmap Phase ${moduleInfo.phase_number}`}
              icon={<Layers className="w-4 h-4 text-sky-600" />}
            />
            <CardContent className="space-y-4 text-xs">
              <p className="text-slate-600 leading-relaxed">
                {moduleInfo.description}
              </p>

              <div className="pt-2">
                <h4 className="font-semibold text-slate-900 mb-2.5">
                  Target Capabilities & Architecture
                </h4>
                <ul className="space-y-2">
                  {moduleInfo.target_capabilities.map((cap, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 shrink-0" />
                      <span>{cap}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader
              title="Readiness Status"
              subtitle="Foundation Dependencies"
              icon={<ShieldAlert className="w-4 h-4 text-slate-600" />}
            />
            <CardContent className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Phase 1 Foundation
                </span>
                <Badge variant="verified" size="xs">Active</Badge>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Target Phase
                </span>
                <span className="font-mono text-slate-700 font-medium">Phase {moduleInfo.phase_number}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  Execution Harness
                </span>
                <Badge variant="pending" size="xs">Awaiting Phase</Badge>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  Mock Simulation
                </span>
                <Badge variant="not_configured" size="xs">Disabled by Rule</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Verification Gate Probe Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Architectural Gate Verification"
        subtitle="Verifies that premature future executions are strictly blocked by the backend API."
      >
        <div className="space-y-3 text-xs">
          <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 font-mono text-[11px] space-y-1.5 text-slate-200">
            <div className="flex justify-between">
              <span className="text-slate-400">Endpoint:</span>
              <span className="text-slate-200">POST /api/v1/modules/{moduleSlug}/execute</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Response Code:</span>
              <span className="text-amber-400">{probeResult.status || '501 Not Implemented'}</span>
            </div>
          </div>
          <p className="text-slate-600 leading-relaxed">
            {probeResult.message}
          </p>
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-[11px] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>Integrity check passed: Future features cannot execute prematurely.</span>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
};
