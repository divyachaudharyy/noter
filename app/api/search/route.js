import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Page from "@/models/Page";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) return Response.json([]);

  await connectDB();
  const pages = await Page.find({
    userId: session.user.id,
    isArchived: false,
    title: { $regex: query, $options: "i" },
  }).limit(20);

  return Response.json(pages);
}