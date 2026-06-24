/**
 * Minimal Gemini REST client with production-grade resilience:
 *  - request timeout (AbortController)
 *  - retry with exponential backoff + jitter on 429/503/5xx
 *  - a process-local circuit breaker so we stop hammering a failing upstream
 *  - JSON response mode for structured outputs
 *
 * Callers should treat failures as recoverable and degrade gracefully.
 */
import { serverEnv } from "@/lib/env";

const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";

export class AiUnavailableError extends Error {
  constructor(message = "AI is temporarily unavailable") {
    super(message);
    this.name = "AiUnavailableError";
  }
}

// --- circuit breaker (per serverless instance) -----------------------------
const breaker = { failures: 0, openedAt: 0 };
const FAIL_THRESHOLD = 4;
const OPEN_MS = 30_000;

function breakerOpen(): boolean {
  if (breaker.failures < FAIL_THRESHOLD) return false;
  if (Date.now() - breaker.openedAt > OPEN_MS) {
    breaker.failures = 0; // half-open: allow a trial request
    return false;
  }
  return true;
}
function recordFailure() {
  breaker.failures += 1;
  breaker.openedAt = Date.now();
}
function recordSuccess() {
  breaker.failures = 0;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const backoff = (n: number) => Math.min(8000, 400 * 2 ** n) + Math.floor(Math.random() * 250);

export type GeminiResult = { text: string };

export async function generateJson<T>(prompt: string): Promise<T> {
  const text = await generate(prompt, true);
  try {
    return JSON.parse(text) as T;
  } catch {
    // Strip markdown fences if the model wrapped the JSON.
    const m = text.match(/\{[\s\S]*\}/);
    if (m) return JSON.parse(m[0]) as T;
    throw new AiUnavailableError("AI returned an unparseable response");
  }
}

export async function generate(prompt: string, json = false): Promise<string> {
  const env = serverEnv();
  if (!env.GEMINI_API_KEY) throw new AiUnavailableError("AI is not configured");
  if (breakerOpen()) throw new AiUnavailableError();

  const url = `${ENDPOINT}/${env.GEMINI_MODEL}:generateContent`;
  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.6,
      maxOutputTokens: 2048,
      ...(json ? { responseMimeType: "application/json" } : {}),
    },
  };

  const maxAttempts = 3;
  let lastErr: unknown;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 25_000);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": env.GEMINI_API_KEY,
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      clearTimeout(timer);

      if ((res.status === 429 || res.status >= 500) && attempt < maxAttempts - 1) {
        await sleep(backoff(attempt));
        continue;
      }
      if (!res.ok) {
        recordFailure();
        throw new AiUnavailableError(`AI error ${res.status}`);
      }

      const data = (await res.json()) as {
        candidates?: { content?: { parts?: { text?: string }[] } }[];
      };
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
      if (!text) {
        recordFailure();
        throw new AiUnavailableError("AI returned an empty response");
      }
      recordSuccess();
      return text;
    } catch (e) {
      clearTimeout(timer);
      lastErr = e;
      if (e instanceof AiUnavailableError) throw e;
      // network/abort: retry then count toward the breaker
      if (attempt < maxAttempts - 1) {
        await sleep(backoff(attempt));
        continue;
      }
      recordFailure();
    }
  }
  throw new AiUnavailableError(lastErr instanceof Error ? lastErr.message : undefined);
}
