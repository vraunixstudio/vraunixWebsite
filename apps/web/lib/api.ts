import type { ApiResponse, PaginationMeta } from "@vraunix/shared";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "/api/v1";

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : undefined;
}

let csrfToken: string | null = null;

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  mutation?: boolean;
};

async function requestCsrfToken(): Promise<string> {
  const response = await fetch(`${API_BASE}/auth/csrf`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });
  const payload = (await response.json().catch(() => null)) as
    | ApiResponse<{ csrfToken: string }>
    | null;
  if (!response.ok || !payload || !payload.success) {
    throw new ApiError(
      response.status,
      "CSRF_UNAVAILABLE",
      "Unable to initialize a secure session. Please refresh and try again."
    );
  }
  csrfToken = payload.data.csrfToken;
  return csrfToken;
}

async function ensureCsrf(force = false): Promise<string> {
  if (!force) {
    const cookieToken = readCookie("vx_csrf");
    if (cookieToken) {
      csrfToken = cookieToken;
      return cookieToken;
    }
    if (csrfToken) return csrfToken;
  }
  return requestCsrfToken();
}

export type ApiResult<T> = {
  data: T;
  meta?: PaginationMeta;
};

async function readPayload<T>(response: Response): Promise<ApiResponse<T>> {
  const text = await response.text();
  if (!text) {
    return {
      success: response.ok,
      data: undefined as T,
    } as ApiResponse<T>;
  }
  try {
    return JSON.parse(text) as ApiResponse<T>;
  } catch {
    throw new ApiError(
      response.status,
      "INVALID_RESPONSE",
      "The server returned an invalid response."
    );
  }
}

export async function api<T>(
  path: string,
  options: RequestOptions = {}
): Promise<ApiResult<T>> {
  const method = options.method ?? "GET";
  const isMutation = options.mutation ?? !["GET", "HEAD"].includes(method.toUpperCase());

  const execute = async (retry: boolean): Promise<ApiResult<T>> => {
    const headers = new Headers(options.headers);
    headers.set("Accept", "application/json");
    if (options.body !== undefined) {
      headers.set("Content-Type", "application/json");
    }
    if (isMutation) {
      headers.set("x-csrf-token", await ensureCsrf(retry));
    }

    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      method,
      headers,
      credentials: "include",
      cache: "no-store",
      body:
        options.body === undefined ? undefined : JSON.stringify(options.body),
    });

    const payload = await readPayload<T>(response);

    if (!response.ok || !payload.success) {
      if (
        isMutation &&
        !retry &&
        response.status === 403 &&
        payload.success === false &&
        payload.error.code === "CSRF_INVALID"
      ) {
        csrfToken = null;
        return execute(true);
      }
      if (payload.success) {
        throw new ApiError(response.status, "REQUEST_FAILED", "Request failed.");
      }
      throw new ApiError(
        response.status,
        payload.error.code,
        payload.error.message,
        payload.error.details
      );
    }

    curlTokenAfter(response);
    return { data: payload.data, meta: payload.meta };
  };

  return execute(false);
}

function curlTokenAfter(_response: Response): void {
  const token = readCookie("vx_csrf");
  if (token) csrfToken = token;
}

export function resetCsrf(): void {
  csrfToken = null;
}

export async function downloadDocument(
  documentId: string,
  fileName: string
): Promise<void> {
  const response = await fetch(`${API_BASE}/documents/${documentId}/download`, {
    credentials: "include",
    cache: "no-store",
  });
  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as
      | ApiResponse<unknown>
      | null;
    throw new ApiError(
      response.status,
      payload && !payload.success ? payload.error.code : "DOWNLOAD_FAILED",
      payload && !payload.success
        ? payload.error.message
        : "The document could not be downloaded."
    );
  }
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
