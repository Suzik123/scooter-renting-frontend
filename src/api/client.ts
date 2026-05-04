import { ApiError } from './errors';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

// Avoid circular import with authStore by reading the persisted token directly.
// zustand-persist stores the snapshot under the configured `name` ("uniscoot-auth")
// as JSON: {state: {token, user, ...}, version}.
function readToken(): string | null {
  try {
    const raw = localStorage.getItem('uniscoot-auth');
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { state?: { token?: string } };
    return parsed?.state?.token ?? null;
  } catch {
    return null;
  }
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined | null>;
  auth?: boolean;
  signal?: AbortSignal;
}

function buildUrl(path: string, query?: RequestOptions['query']): string {
  const url = new URL(path.startsWith('http') ? path : `${BASE_URL}${path}`);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v === undefined || v === null) continue;
      url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

export async function request<T = unknown>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, query, auth = true, signal } = opts;
  const headers: Record<string, string> = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (auth) {
    const token = readToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(buildUrl(path, query), {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (e) {
    throw new ApiError('network', e instanceof Error ? e.message : 'Network error', 0);
  }

  if (response.status === 204) return undefined as T;

  let payload: unknown = undefined;
  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    try {
      payload = await response.json();
    } catch {
      payload = undefined;
    }
  }

  if (!response.ok) {
    const errBody = (payload as { error?: { kind?: string; code?: string; message?: string } } | undefined)?.error;
    const kind = errBody?.kind ?? errBody?.code?.toLowerCase() ?? `http_${response.status}`;
    const message = errBody?.message ?? response.statusText ?? 'Request failed';
    throw new ApiError(kind, message, response.status);
  }

  const envelope = payload as { data?: unknown } | undefined;
  return (envelope?.data ?? payload) as T;
}
