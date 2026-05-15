import i18n from '../i18n';
import { ApiError } from './errors';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined | null>;
  auth?: boolean;
  signal?: AbortSignal;
  /** Bypass the retry-on-5xx logic for this request. */
  noRetry?: boolean;
}

export interface RequestContext {
  url: string;
  path: string;
  init: RequestInit;
  options: RequestOptions;
}

export interface ResponseContext extends RequestContext {
  response: Response;
}

export type RequestInterceptor = (ctx: RequestContext) => RequestContext | Promise<RequestContext>;
export type ResponseInterceptor = (ctx: ResponseContext) => ResponseContext | Promise<ResponseContext>;
export type ErrorInterceptor = (error: ApiError, ctx: RequestContext) => Promise<ApiError> | ApiError;

// ---------------------------------------------------------------------------
// Interceptor registry
// ---------------------------------------------------------------------------

const requestInterceptors: RequestInterceptor[] = [];
const responseInterceptors: ResponseInterceptor[] = [];
const errorInterceptors: ErrorInterceptor[] = [];

export function addRequestInterceptor(fn: RequestInterceptor): () => void {
  requestInterceptors.push(fn);
  return () => {
    const idx = requestInterceptors.indexOf(fn);
    if (idx >= 0) requestInterceptors.splice(idx, 1);
  };
}

export function addResponseInterceptor(fn: ResponseInterceptor): () => void {
  responseInterceptors.push(fn);
  return () => {
    const idx = responseInterceptors.indexOf(fn);
    if (idx >= 0) responseInterceptors.splice(idx, 1);
  };
}

export function addErrorInterceptor(fn: ErrorInterceptor): () => void {
  errorInterceptors.push(fn);
  return () => {
    const idx = errorInterceptors.indexOf(fn);
    if (idx >= 0) errorInterceptors.splice(idx, 1);
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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

// zustand-persist stores the snapshot under "uniscoot-auth"; read directly
// to avoid a circular import with authStore.
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

// Router-aware bus the 401 interceptor uses to navigate to /login without
// importing react-router directly (preserves SSR-safety).
type AuthHandler = () => void;
let authExpiredHandler: AuthHandler | null = null;
export function setAuthExpiredHandler(fn: AuthHandler | null): void {
  authExpiredHandler = fn;
}

type ToastHandler = (message: string, kind: 'info' | 'success' | 'error') => void;
let toastHandler: ToastHandler | null = null;
export function setToastHandler(fn: ToastHandler | null): void {
  toastHandler = fn;
}

// ---------------------------------------------------------------------------
// Built-in interceptors
// ---------------------------------------------------------------------------

// 1. Auth header
addRequestInterceptor((ctx) => {
  if (ctx.options.auth === false) return ctx;
  const token = readToken();
  if (token) {
    (ctx.init.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }
  return ctx;
});

// 2. Accept-Language header
addRequestInterceptor((ctx) => {
  const lang = (i18n.resolvedLanguage ?? i18n.language ?? 'en').slice(0, 2);
  (ctx.init.headers as Record<string, string>)['Accept-Language'] = lang;
  return ctx;
});

// 3. 401 -> logout + redirect (skip the login call itself)
addErrorInterceptor((err, ctx) => {
  if (err.status !== 401) return err;
  if (ctx.path.startsWith('/api/auth/login') || ctx.path.startsWith('/api/auth/register')) {
    return err;
  }
  try {
    const raw = localStorage.getItem('uniscoot-auth');
    if (raw) {
      const parsed = JSON.parse(raw) as { state?: Record<string, unknown>; version?: number };
      const next = {
        ...parsed,
        state: {
          ...(parsed.state ?? {}),
          user: null,
          token: null,
          isAuthenticated: false,
        },
      };
      localStorage.setItem('uniscoot-auth', JSON.stringify(next));
    }
  } catch {
    // ignore storage errors
  }
  authExpiredHandler?.();
  return err;
});

// 4. 403 -> toast
addErrorInterceptor((err) => {
  if (err.status === 403 && toastHandler) {
    toastHandler(i18n.t('common:errors.forbidden') ?? 'Forbidden', 'error');
  }
  return err;
});

// 5. Error normalizer (last in chain)
addErrorInterceptor((err) => err);

// ---------------------------------------------------------------------------
// Core request executor
// ---------------------------------------------------------------------------

async function runRequestInterceptors(ctx: RequestContext): Promise<RequestContext> {
  let current = ctx;
  for (const fn of requestInterceptors) {
    current = await fn(current);
  }
  return current;
}

async function runResponseInterceptors(ctx: ResponseContext): Promise<ResponseContext> {
  let current = ctx;
  for (const fn of responseInterceptors) {
    current = await fn(current);
  }
  return current;
}

async function runErrorInterceptors(err: ApiError, ctx: RequestContext): Promise<ApiError> {
  let current = err;
  for (const fn of errorInterceptors) {
    current = await fn(current, ctx);
  }
  return current;
}

async function executeOnce(ctx: RequestContext): Promise<Response> {
  return fetch(ctx.url, ctx.init);
}

export async function request<T = unknown>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, query, signal, noRetry } = opts;

  const headers: Record<string, string> = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  const init: RequestInit = {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal,
  };

  let ctx: RequestContext = {
    url: buildUrl(path, query),
    path,
    init,
    options: opts,
  };
  ctx = await runRequestInterceptors(ctx);

  const canRetry = !noRetry && method === 'GET';
  const maxAttempts = canRetry ? 2 : 1;

  let lastError: ApiError | null = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    let response: Response;
    try {
      response = await executeOnce(ctx);
    } catch (e) {
      lastError = new ApiError(
        'network',
        e instanceof Error ? e.message : 'Network error',
        0,
      );
      if (attempt < maxAttempts) {
        await sleep(250);
        continue;
      }
      throw await runErrorInterceptors(lastError, ctx);
    }

    if (response.status >= 500 && canRetry && attempt < maxAttempts) {
      await sleep(250);
      continue;
    }

    const respCtx: ResponseContext = { ...ctx, response };
    const finalCtx = await runResponseInterceptors(respCtx);
    const finalResponse = finalCtx.response;

    if (finalResponse.status === 204) return undefined as T;

    let payload: unknown = undefined;
    const contentType = finalResponse.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
      try {
        payload = await finalResponse.json();
      } catch {
        payload = undefined;
      }
    }

    if (!finalResponse.ok) {
      const errBody = (payload as { error?: { kind?: string; code?: string; message?: string } } | undefined)?.error;
      const kind = errBody?.kind ?? errBody?.code?.toLowerCase() ?? `http_${finalResponse.status}`;
      const message = errBody?.message ?? finalResponse.statusText ?? 'Request failed';
      const err = new ApiError(kind, message, finalResponse.status);
      throw await runErrorInterceptors(err, ctx);
    }

    const envelope = payload as { data?: unknown } | undefined;
    return (envelope?.data ?? payload) as T;
  }

  // Should be unreachable; satisfy the type checker.
  throw await runErrorInterceptors(
    lastError ?? new ApiError('unknown', 'Request failed', 0),
    ctx,
  );
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
