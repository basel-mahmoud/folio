import { authed } from "@/lib/api";
import { addSkillGroup } from "@/lib/services/portfolio";
import { skillGroupSchema } from "@/lib/validation";

export async function POST(req: Request) {
  return authed(req, async (user) =>
    addSkillGroup(user.id, skillGroupSchema.parse(await req.json())),
  );
}
