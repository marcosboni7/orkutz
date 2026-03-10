import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  try {
    const { profileId } = await req.json();

    // 1. Busca os dados do visitante (quem está logado)
    const visitor = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!visitor) return NextResponse.json({ error: "Visitante não encontrado" }, { status: 404 });

    // 2. Não registra se o usuário visitar o próprio perfil
    if (visitor.id === profileId) {
      return NextResponse.json({ message: "Auto-visita não registrada" });
    }

    // 3. Registra a visita (estilo Orkut: sempre cria uma nova entrada para a timeline)
    const visit = await prisma.visit.create({
      data: {
        visitorId: visitor.id,
        visitorName: visitor.name || "Usuário Anônimo",
        visitorImg: visitor.image,
        profileId: profileId,
      },
    });

    return NextResponse.json(visit);
  } catch (error) {
    console.error("Erro ao registrar visita:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    // Busca as últimas 5 visitas únicas recebidas por esse usuário
    const visits = await prisma.visit.findMany({
      where: { profileId: user?.id },
      orderBy: { visitedAt: "desc" },
      take: 10, // Pegamos 10 para filtrar duplicados se necessário
    });

    return NextResponse.json(visits);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar visitas" }, { status: 500 });
  }
}