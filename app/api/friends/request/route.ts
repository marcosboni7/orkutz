import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const { targetUserId } = await req.json();

    if (session.user.id === targetUserId) {
      return NextResponse.json({ error: "Você não pode ser seu próprio amigo... ainda" }, { status: 400 });
    }

    // Verifica se já existe um pedido (pendente ou aceito)
    const existing = await prisma.friendship.findFirst({
      where: {
        OR: [
          { senderId: session.user.id, receiverId: targetUserId },
          { senderId: targetUserId, receiverId: session.user.id }
        ]
      }
    });

    if (existing) {
      return NextResponse.json({ error: "Já existe uma solicitação entre vocês" }, { status: 400 });
    }

    const request = await prisma.friendship.create({
      data: {
        senderId: session.user.id,
        receiverId: targetUserId,
        status: "PENDING"
      }
    });

    return NextResponse.json({ success: true, request });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao enviar convite" }, { status: 500 });
  }
}