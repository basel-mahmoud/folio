/**
 * Thin wrapper for authenticated JSON API routes:
 *  - resolves the Clerk user (401 if absent)
 *  - per-user fixed-window rate limiting (429)
 *  - optional idempotency for mutations (Idempotency-Key header)
 *  - consistent error → status mapping (Zod 400, known errors 404/409, else 500)
 */
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { requireApiUser, ApiAuthError, type SessionUser } from "@/lib/auth";
import { rateLimit } from "@/lib/services/rate-limit";
import { withIdempotency, hashRequest } from "@/lib/services/idempotency";
import { json, tooManyRequests } from "@/lib/http";

type Handler = (user: SessionUser, req: Request) => Promise<unknown>;
type Options = { limit?: number; windowSeconds?: number };

export async function authed(
  req: Request,
  handler: Handler,
  opts: Options = {},
): Promise<NextResponse> {
  try {
    const user = await requireApiUser();

    const { limit = 80, windowSeconds = 60 } = opts;
    const rl = await rateLimit(`api:${req.method}`, user.id, limit, windowSeconds);
    if (!rl.allowed) return tooManyRequests(rl.resetSeconds);

    const idemKey = req.headers.get("idempotency-key");
    if (req.method !== "GET" && idemKey) {
      const bodyText = await req.clone().text();
      const requestHash = hashRequest({
        m: req.method,
        p: new URL(req.url).pathname,
        b: bodyText,
      });
      const outcome = await withIdempotency(
        `${user.id}:${idemKey}`,
        requestHash,
        86_400,
        async () => ({ statusCode: 200, body: await handler(user, req) }),
        user.id,
      );
      if (outcome.kind === "conflict")
        return json({ error: "Idempotency key reused with a different body" }, 409);
      if (outcome.kind === "in_progress")
        return json({ error: "A request with this key is still processing" }, 409);
      return json(outcome.body, outcome.statusCode);
    }

    return json(await handler(user, req), 200);
  } catch (e) {
    return toError(e);
  }
}

function toError(e: unknown): NextResponse {
  if (e instanceof ApiAuthError) return json({ error: e.message }, 401);
  if (e instanceof ZodError)
    return json({ error: "Invalid input", issues: e.flatten() }, 400);
  const msg = e instanceof Error ? e.message : "";
  if (msg === "handle_taken") return json({ error: "That handle is taken" }, 409);
  if (msg === "not_found") return json({ error: "Not found" }, 404);
  console.error("API error:", e);
  return json({ error: "Something went wrong" }, 500);
}
