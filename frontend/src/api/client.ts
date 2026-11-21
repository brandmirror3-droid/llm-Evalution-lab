/**
 * Resilient API client for LLM Evaluation Lab.
 */

import { ApiError, ResponseEnvelope } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export class LabApiError extends Error {
  code: string;
  details?: Record<string, unknown>;
  status: number;

  constructor(status: number, error: ApiError) {
    super(error.message || 'An unexpected API error occurred');
    this.name = 'LabApiError';
    this.code = error.code || `HTTP_${status}`;
    this.details = error.details;
    this.status = status;
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorPayload: ApiError = data?.error || {
        code: `HTTP_${response.status}`,
        message: data?.detail || `API request failed with status ${response.status}`,
      };
      throw new LabApiError(response.status, errorPayload);
    }

    return data as T;
  } catch (error) {
    if (error instanceof LabApiError) {
      throw error;
    }

    // Network disconnection or backend offline
    throw new LabApiError(0, {
      code: 'BACKEND_OFFLINE',
      message: 'Backend server is unreachable. Verify FastAPI is running at ' + API_BASE,
      details: { original: String(error) },
    });
  }
}

export async function fetchEnvelope<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ResponseEnvelope<T>> {
  return apiRequest<ResponseEnvelope<T>>(endpoint, options);
}
