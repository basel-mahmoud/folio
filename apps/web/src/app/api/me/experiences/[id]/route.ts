import { authed } from "@/lib/api";
import { updateExperience, deleteSectionRow } from "@/lib/services/portfolio";
import { experienceSchema } from "@/lib/validation";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return authed(req, async (user) =>
    updateExperience(user.id, id, experienceSchema.parse(await req.json())),
  );
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return authed(req, async (user) => deleteSectionRow(user.id, "experiences", id));
}
