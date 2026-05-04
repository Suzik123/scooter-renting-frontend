export class ApiError extends Error {
  kind: string;
  status: number;

  constructor(kind: string, message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.kind = kind;
    this.status = status;
  }
}

export function isApiError(e: unknown): e is ApiError {
  return e instanceof ApiError;
}
