import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Busca os usuários do banco (limitando a 9 para o grid 3x3)
    const users = await prisma.user.findMany({
      take: 9,
      select: {
        id: true,
        name: true,
        image: true,
      },
      orderBy: {
        id: 'desc' // Mostra os últimos cadastrados primeiro
      }
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    return NextResponse.json({ error: "Erro ao buscar usuários" }, { status: 500 });
  }
}