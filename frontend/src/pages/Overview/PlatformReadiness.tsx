import React from 'react';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Badge, BadgeVariant } from '../../components/ui/Badge';
import { ReadinessItem } from '../../types';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from 'lucide-react';

interface PlatformReadinessProps {
  items: ReadinessItem[];
}

export const PlatformReadiness: React.FC<PlatformReadinessProps> = ({ items }) => {
  const mapItemBadge = (status: ReadinessItem['status']): BadgeVariant => {
    switch (status) {
      case 'verified':
        return 'verified';
      case 'in_progress':
        return 'in_progress';
      case 'awaiting_setup':
        return 'awaiting_setup';
      case 'pending':
        return 'pending';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: ReadinessItem['status']) => {
    switch (status) {
      case 'verified':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
      case 'awaiting_setup':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
      case 'pending':
      default:
        return <Clock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />;
    }
  };

  const formatStatus = (status: ReadinessItem['status']): string => {
    switch (status) {
      case 'verified':
        return 'Verified';
      case 'awaiting_setup':
        return 'Awaiting Setup';
      case 'in_progress':
        return 'In Progress';
      case 'pending':
        return 'Planned';
      default:
        return status;
    }
  };

  const verifiedCount = items.filter((i) => i.status === 'verified').length;

  return (
    <Card>
      <CardHeader
        title="Platform Readiness & Foundational Audit"
        subtitle={`${verifiedCount} of ${items.length} milestone capabilities verified in current environment.`}
        icon={<ShieldCheck className="w-4 h-4 text-emerald-400" />}
      />

      <CardContent className="p-0">
        <div className="divide-y divide-lab-borderSubtle text-xs">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-lab-cardHover/40 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {getStatusIcon(item.status)}
                  <span className="font-semibold text-lab-text-primary">
                    {item.title}
                  </span>
                  <span className="text-[10px] font-mono text-lab-text-faint px-1.5 py-0.2 rounded bg-lab-surface border border-lab-borderSubtle">
                    {item.category}
                  </span>
                </div>
                <p className="text-xs text-lab-text-muted pl-5 leading-relaxed">
                  {item.details}
                </p>
              </div>

              <div className="flex items-center gap-2 pl-5 sm:pl-0 shrink-0">
                <span className="text-[10px] font-mono text-lab-text-faint">
                  Phase {item.implemented_in_phase}
                </span>
                <Badge variant={mapItemBadge(item.status)} size="xs">
                  {formatStatus(item.status)}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
