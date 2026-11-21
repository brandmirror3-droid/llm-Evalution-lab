/**
 * Core domain types for LLM Evaluation Lab.
 */

export type SubsystemState =
  | 'operational'
  | 'degraded'
  | 'disconnected'
  | 'not_configured'
  | 'not_implemented'
  | 'awaiting_setup';

export interface SubsystemHealth {
  name: string;
  status: SubsystemState;
  message: string;
  target?: string | null;
  latency_ms?: number | null;
  details?: Record<string, unknown> | null;
}

export interface ProviderConfigStatus {
  provider: string;
  label: string;
  configured: boolean;
  phase_target: string;
}

export interface ReadinessItem {
  category: string;
  title: string;
  status: 'verified' | 'in_progress' | 'pending' | 'awaiting_setup';
  details: string;
  implemented_in_phase: number;
}

export interface LabStatusOverview {
  environment: string;
  debug: boolean;
  version: string;
  phase: string;
  subsystems: {
    environment: SubsystemHealth;
    api: SubsystemHealth;
    database: SubsystemHealth;
    experiment_infrastructure: SubsystemHealth;
    [key: string]: SubsystemHealth;
  };
  providers: ProviderConfigStatus[];
  readiness_checklist: ReadinessItem[];
}

export interface PlannedModuleInfo {
  module_name: string;
  phase_number: number;
  phase_title: string;
  status: string;
  description: string;
  target_capabilities: string[];
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface ResponseEnvelope<T> {
  success: boolean;
  data: T;
  meta?: {
    total_count: number;
    page: number;
    page_size: number;
    total_pages: number;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  path?: string;
}
