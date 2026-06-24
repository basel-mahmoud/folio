import { authed } from "@/lib/api";
import { addEducation } from "@/lib/services/portfolio";
import { educationSchema } from "@/lib/validation";

export async function POST(req: Request) {
  return authed(req, async (user) =>
    addEducation(user.id, educationSchema.parse(await req.json())),
  );
}
