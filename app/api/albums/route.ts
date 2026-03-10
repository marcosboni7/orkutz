import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { title, userId } = await req.json();

  if (session.user.id !== userId) {
     return NextResponse.json({ error: "Você só pode criar álbuns no seu perfil" }, { status: 403 });
  }

  const album = await prisma.album.create({
    data: {
      title,
      userId
    }
  });

  return NextResponse.json(album);
}