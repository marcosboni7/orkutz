import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: Promise<{ photoId: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { photoId } = await params;
  const { content } = await req.json();

  const comment = await prisma.photoComment.create({
    data: {
      content,
      photoId,
      userId: session.user.id,
    },
  });

  return NextResponse.json(comment);
}