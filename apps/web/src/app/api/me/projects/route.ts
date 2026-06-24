import { authed } from "@/lib/api";
import { addProject } from "@/lib/services/portfolio";
import { projectSchema } from "@/lib/validation";

export async function POST(req: Request) {
  return authed(req, async (user) =>
    addProject(user.id, projectSchema.parse(await req.json())),
  );
}
