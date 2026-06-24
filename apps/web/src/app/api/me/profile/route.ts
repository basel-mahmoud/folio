import { authed } from "@/lib/api";
import { updateProfile } from "@/lib/services/portfolio";
import { profileSchema } from "@/lib/validation";

/** PATCH /api/me/profile — update name, headline, location, bio, links, theme. */
export async function PATCH(req: Request) {
  return authed(req, async (user) => {
    const input = profileSchema.parse(await req.json());
    return updateProfile(user.id, input);
  });
}
