import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { App } from '../App';

// Mock the API calls so unit test does not depend on live backend running
vi.mock('../api/system', () => ({
  getLabStatus: vi.fn().mockResolvedValue({
    environment: 'testing',
    debug: true,
    version: '0.1.0',
    phase: 'Phase 1: Lab Foundation & Architecture',
    subsystems: {
      environment: { name: 'Runtime', status: 'operational', message: 'Test mode' },
      api: { name: 'API', status: 'operational', message: 'Active' },
      database: { name: 'PostgreSQL', status: 'operational', message: 'Connected' },
      experiment_infrastructure: { name: 'Harness', status: 'not_implemented', message: 'Phase 2' },
    },
    providers: [
      { provider: 'openai', label: 'OpenAI', configured: true, phase_target: 'Phase 2' },
      { provider: 'anthropic', label: 'Anthropic', configured: false, phase_target: 'Phase 2' },
      { provider: 'gemini', label: 'Google Gemini', configured: false, phase_target: 'Phase 2' },
    ],
    readiness_checklist: [
      { category: 'Core', title: 'Foundation', status: 'verified', details: 'OK', implemented_in_phase: 1 },
    ],
  }),
  getHealth: vi.fn().mockResolvedValue({ status: 'healthy', version: '0.1.0', phase: 'Phase 1' }),
  getRoadmapModules: vi.fn().mockResolvedValue([]),
  getRoadmapModule: vi.fn().mockResolvedValue({
    module_name: 'Model Playground',
    phase_number: 2,
    phase_title: 'Model Playground & Integration',
    status: 'planned',
    description: 'Interactive sandbox',
    target_capabilities: ['Streaming completions'],
  }),
  getWorkspaces: vi.fn().mockResolvedValue([]),
  createWorkspace: vi.fn().mockResolvedValue({ id: '1', name: 'Lab 1', slug: 'lab-1', is_default: false }),
}));

describe('LLM Evaluation Lab Shell & Navigation', () => {
  it('renders application brand and navigation sections', async () => {
    render(<App />);
    expect(await screen.findByText('EVALUATION LAB')).toBeInTheDocument();
    expect(screen.getAllByText('WORKSPACE').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('EVALUATION').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('ANALYSIS & INTELLIGENCE')).toBeInTheDocument();
    expect(screen.getByText('SYSTEM')).toBeInTheDocument();
  });

  it('renders overview page with lab mission banner and status cards', async () => {
    render(<App />);
    expect(await screen.findByText(/Systematically measure accuracy, detect hallucinations/i)).toBeInTheDocument();
    expect(screen.getByText(/Scientific Module Launchers/i)).toBeInTheDocument();
    expect(screen.getByText(/Research Activity & Workbench/i)).toBeInTheDocument();
  });
});
