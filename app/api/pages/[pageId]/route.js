import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Page from "@/models/Page";

export async function GET(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });
  const { pageId } = await params;
  await connectDB();
  const page = await Page.findOne({
    _id: pageId,              // ← was params.pageId
    userId: session.user.id,

  });

  if (!page) return new Response("Not found", { status: 404 });
  return Response.json(page);
}

export async function PATCH(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const updates = await req.json();
 const { pageId } = await params;
await connectDB();
const page = await Page.findOneAndUpdate(
  { _id: pageId, userId: session.user.id },   // ← was params.pageId
  { $set: updates },
  { new: true }

  );

  if (!page) return new Response("Not found", { status: 404 });
  return Response.json(page);
}

export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });
  const { pageId } = await params;
await connectDB();
const page = await Page.findOneAndUpdate(
  { _id: pageId, userId: session.user.id },   // ← was params.pageId
  { $set: { isArchived: true } },
  { new: true }
);

  if (!page) return new Response("Not found", { status: 404 });
  return Response.json(page);
}