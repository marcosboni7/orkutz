import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const { id: communityId } = await params;

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    // Busca a comunidade e verifica se o usuário já é membro
    const community = await prisma.community.findUnique({
      where: { id: communityId },
      include: { members: { where: { id: session.user.id } } },
    });

    if (!community) {
      return NextResponse.json({ error: "Comunidade não encontrada" }, { status: 404 });
    }

    const isMember = community.members.length > 0;

    if (isMember) {
      // Se já é membro, ao clicar ele SAI (opcional, ou pode apenas retornar erro)
      await prisma.community.update({
        where: { id: communityId },
        data: {
          members: { disconnect: { id: session.user.id } },
        },
      });
      return NextResponse.json({ message: "Saiu da comunidade" });
    } else {
      // Se não é membro, ele ENTRA
      await prisma.community.update({
        where: { id: communityId },
        data: {
          members: { connect: { id: session.user.id } },
        },
      });
      return NextResponse.json({ message: "Entrou na comunidade" });
    }
  } catch (error) {
    console.error("Erro ao entrar na comunidade:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}