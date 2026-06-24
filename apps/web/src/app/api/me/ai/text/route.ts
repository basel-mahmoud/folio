import { authed } from "@/lib/api";
import { generateText } from "@/lib/services/ai";
import { aiTextInputSchema } from "@/lib/validation";

/** POST /api/me/ai/text — generate/polish a bio, headline, or project blurb. */
export async function POST(req: Request) {
  return authed(
    req,
    async (user) => {
      const input = aiTextInputSchema.parse(await req.json());
      return generateText(user.id, input);
    },
    { limit: 30, windowSeconds: 3600 },
  );
}
