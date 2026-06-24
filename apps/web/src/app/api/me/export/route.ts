import { authed } from "@/lib/api";
import { exportUserData } from "@/lib/services/portfolio";

/** GET /api/me/export — machine-readable export of all the user's data (GDPR). */
export async function GET(req: Request) {
  return authed(req, async (user) => exportUserData(user.id));
}
