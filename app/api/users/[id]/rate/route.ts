import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // No Next 15/16 params é uma Promise
) {
  try {
    const session = await getServerSession(authOptions);
    const { id: targetUserId } = await params;

    // 1. Verificação de autenticação
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Você precisa estar logado" }, { status: 401 });
    }

    // 2. Impedir voto em si mesmo
    if (session.user.id === targetUserId) {
      return NextResponse.json({ error: "Você não pode votar em si mesmo" }, { status: 400 });
    }

    const { type } = await req.json(); // type deve ser "trusty", "cool" ou "sexy"

    if (!["trusty", "cool", "sexy"].includes(type)) {
      return NextResponse.json({ error: "Tipo de avaliação inválida" }, { status: 400 });
    }

    // 3. Atualizar o contador no banco
    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: {
        [type]: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({ 
      success: true, 
      newValue: updatedUser[type as keyof typeof updatedUser] 
    });

  } catch (error: any) {
    console.error("ERRO NO RATING:", error.message);
    return NextResponse.json({ error: "Erro ao processar voto" }, { status: 500 });
  }
}