import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string, topicId: string }> }
) {
  const session = await getServerSession(authOptions);
  const { topicId } = await params;

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const { content } = await req.json();

    if (!content) {
      return NextResponse.json({ error: "Conteúdo vazio" }, { status: 400 });
    }

    // Salva a resposta vinculada ao tópico e ao autor logado
    const reply = await prisma.reply.create({
      data: {
        content,
        topicId,
        authorId: session.user.id,
      }
    });

    return NextResponse.json(reply);
  } catch (error) {
    console.error("Erro ao responder tópico:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}