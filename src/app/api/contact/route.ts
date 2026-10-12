import { handleContact, type ContactEnv } from "@/lib/contact";
export const runtime = "nodejs";
export async function GET(request: Request) {
  return handleContact(request, process.env as ContactEnv);
}
export async function POST(request: Request) {
  return handleContact(request, process.env as ContactEnv);
}
