import { authed } from "@/lib/api";
import { updateEducation, deleteSectionRow } from "@/lib/services/portfolio";
import { educationSchema } from "@/lib/validation";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return authed(req, async (user) =>
    updateEducation(user.id, id, educationSchema.parse(await req.json())),
  );
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return authed(req, async (user) => deleteSectionRow(user.id, "education", id));
}
