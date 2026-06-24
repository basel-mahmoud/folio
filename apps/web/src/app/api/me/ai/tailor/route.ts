import { authed } from "@/lib/api";
import { tailorToJob } from "@/lib/services/ai";
import { tailorInputSchema } from "@/lib/validation";

/** POST /api/me/ai/tailor — score + tailor the CV against a pasted job description. */
export async function POST(req: Request) {
  return authed(
    req,
    async (user) => {
      const input = tailorInputSchema.parse(await req.json());
      return tailorToJob(user.id, input);
    },
    { limit: 20, windowSeconds: 3600 },
  );
}
