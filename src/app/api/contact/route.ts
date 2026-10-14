import { handleContact, type ContactEnv } from "@/lib/contact";
import { gmailDelivery } from "@/lib/gmail.node";
export const runtime = "nodejs";
export const maxDuration = 60;
async function handle(request: Request) {
  const env = process.env as ContactEnv;
  return handleContact(request, env, {
    delivery: gmailDelivery(env),
    // Vercel overwrites x-forwarded-for; other Node hosts use a shared bucket.
    clientIp:
      process.env.VERCEL === "1"
        ? request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
          "shared"
        : "shared",
  });
}
export const GET = handle;
export const POST = handle;
