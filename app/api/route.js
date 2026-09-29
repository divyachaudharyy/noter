import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Page from "@/models/Page";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { parentPage = null } = await req.json();
  await connectDB();

  const page = await Page.create({
    title: "Untitled",
    userId: session.user.id,
    parentPage,
  });

  return Response.json(page);
}

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { searchParams } = new URL(req.url);
  const parentPage = searchParams.get("parentPage") || null;

  await connectDB();
  const pages = await Page.find({
    userId: session.user.id,
    parentPage,
    isArchived: false,
  }).sort({ createdAt: -1 });

  return Response.json(pages);
}