import { authed } from "@/lib/api";
import { addExperience } from "@/lib/services/portfolio";
import { experienceSchema } from "@/lib/validation";

export async function POST(req: Request) {
  return authed(req, async (user) =>
    addExperience(user.id, experienceSchema.parse(await req.json())),
  );
}
