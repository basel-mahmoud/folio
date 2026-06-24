import { authed } from "@/lib/api";
import { setPublished } from "@/lib/services/portfolio";
import { z } from "zod";

/** POST /api/me/publish — toggle the portfolio public/private. */
export async function POST(req: Request) {
  return authed(req, async (user) => {
    const { published } = z.object({ published: z.boolean() }).parse(await req.json());
    return setPublished(user.id, published);
  });
}
