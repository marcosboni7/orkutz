import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query || query.length < 2) {
    return NextResponse.json([]);
  }

  try {
    const users = await prisma.user.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive', // Ignora maiúsculas/minúsculas
        },
      },
      select: {
        id: true,
        name: true,
        image: true,
      },
      take: 5, // Limita para não sobrecarregar
    });

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "Erro na busca" }, { status: 500 });
  }
}