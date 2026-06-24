/**
 * Low-level API client. Dependency-free (takes a token string), so it can be
 * unit-tested and reused. Retries idempotent failures with exponential backoff
 * + jitter, honours Retry-After on 429, and attaches an Idempotency-Key to
 * every mutation so retries are safe.
 */
import { config } from "./config";

export type ApiError = { status: number; message: string };

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const backoff = (attempt: number) =>
  Math.min(8000, 300 * 2 ** attempt) + Math.floor(Math.random() * 200);

function randomKey() {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 12)
  );
}

export type ApiOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string | null;
  idempotencyKey?: string;
  signal?: AbortSignal;
};

export async function apiFetch<T = unknown>(
  path: string,
  opts: ApiOptions = {},
): Promise<T> {
  const method = opts.method ?? "GET";
  const url = config.apiUrl + path;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (opts.token) headers.Authorization = `Bearer ${opts.token}`;
  if (method !== "GET")
    headers["Idempotency-Key"] = opts.idempotencyKey ?? randomKey();

  const maxAttempts = 4;
  let lastErr: unknown;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const res = await fetch(url, {
        method,
        headers,
        body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
        signal: opts.signal,
      });

      if ((res.status === 429 || res.status >= 500) && attempt < maxAttempts - 1) {
        const ra = Number(res.headers.get("retry-after")) || 0;
        await sleep(Math.max(ra * 1000, backoff(attempt)));
        continue;
      }

      const text = await res.text();
      const data = text ? JSON.parse(text) : null;
      if (!res.ok) {
        throw { status: res.status, message: data?.error ?? res.statusText } as ApiError;
      }
      return data as T;
    } catch (e) {
      lastErr = e;
      // Retry only transient network errors (not thrown ApiErrors).
      const isApiError = typeof e === "object" && e !== null && "status" in e;
      if (!isApiError && attempt < maxAttempts - 1) {
        await sleep(backoff(attempt));
        continue;
      }
      throw e;
    }
  }
  throw lastErr;
}
