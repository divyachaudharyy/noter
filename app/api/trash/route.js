import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Page from "@/models/Page";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  await connectDB();
  const pages = await Page.find({
    userId: session.user.id,
    isArchived: true,
  }).sort({ updatedAt: -1 });

  return Response.json(pages);
}