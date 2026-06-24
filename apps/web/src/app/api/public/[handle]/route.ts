import { getPublicByHandle } from "@/lib/services/portfolio";
import { json } from "@/lib/http";

/** GET /api/public/[handle] — a published portfolio, or 404. Public, no auth. */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ handle: string }> },
) {
  const { handle } = await params;
  const bundle = await getPublicByHandle(handle.toLowerCase());
  if (!bundle) return json({ error: "Not found" }, 404);
  // Published portfolios change rarely → let the Vercel edge cache absorb load.
  return json(bundle, {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
  });
}
