/**
 * System and infrastructure telemetry API calls.
 */

import { fetchEnvelope, apiRequest } from './client';
import {
  LabStatusOverview,
  PlannedModuleInfo,
  Workspace,
  SubsystemHealth,
} from '../types';

export async function getLabStatus(): Promise<LabStatusOverview> {
  const response = await fetchEnvelope<LabStatusOverview>('/status');
  return response.data;
}

export async function getHealth(): Promise<{ status: string; version: string; phase: string }> {
  return apiRequest<{ status: string; version: string; phase: string }>('/health');
}

export async function getReadiness(): Promise<{
  ready: boolean;
  status: string;
  subsystems: Record<string, SubsystemHealth>;
}> {
  return apiRequest('/readiness');
}

export async function getRoadmapModules(): Promise<PlannedModuleInfo[]> {
  const response = await fetchEnvelope<PlannedModuleInfo[]>('/modules');
  return response.data;
}

export async function getRoadmapModule(slug: string): Promise<PlannedModuleInfo> {
  const response = await fetchEnvelope<PlannedModuleInfo>(`/modules/${slug}`);
  return response.data;
}

export async function getWorkspaces(): Promise<Workspace[]> {
  const response = await fetchEnvelope<Workspace[]>('/workspaces');
  return response.data;
}

export async function createWorkspace(data: { name: string; description?: string; slug?: string }): Promise<Workspace> {
  const response = await fetchEnvelope<Workspace>('/workspaces', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.data;
}
