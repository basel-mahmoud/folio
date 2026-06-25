import { authed } from "@/lib/api";
import { updateSkillGroup, deleteSectionRow } from "@/lib/services/portfolio";
import { skillGroupSchema } from "@/lib/validation";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return authed(req, async (user) =>
    updateSkillGroup(user.id, id, skillGroupSchema.parse(await req.json())),
  );
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return authed(req, async (user) => deleteSectionRow(user.id, "skillGroups", id));
}
