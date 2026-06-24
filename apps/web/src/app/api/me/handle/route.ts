import { authed } from "@/lib/api";
import { setHandle } from "@/lib/services/portfolio";
import { handleSchema } from "@/lib/validation";
import { z } from "zod";

/** POST /api/me/handle — claim/change the public handle. */
export async function POST(req: Request) {
  return authed(req, async (user) => {
    const { handle } = z.object({ handle: handleSchema }).parse(await req.json());
    return setHandle(user.id, handle);
  });
}
