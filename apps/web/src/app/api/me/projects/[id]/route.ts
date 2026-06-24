import { authed } from "@/lib/api";
import { updateProject, deleteSectionRow } from "@/lib/services/portfolio";
import { projectSchema } from "@/lib/validation";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return authed(req, async (user) =>
    updateProject(user.id, id, projectSchema.parse(await req.json())),
  );
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return authed(req, async (user) => deleteSectionRow(user.id, "projects", id));
}
