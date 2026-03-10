import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json([], { status: 401 });

  const pending = await prisma.friendship.findMany({
    where: {
      receiverId: session.user.id,
      status: "PENDING"
    },
    include: {
      sender: {
        select: { id: true, name: true, image: true }
      }
    }
  });

  return NextResponse.json(pending);
}