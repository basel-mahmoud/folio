import { authed } from "@/lib/api";
import { deleteSectionRow } from "@/lib/services/portfolio";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return authed(req, async (user) => deleteSectionRow(user.id, "skillGroups", id));
}
