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
    const { title, content } = await req.json();

    if (!title || !content) {
      return NextResponse.json({ error: "Título e conteúdo obrigatórios" }, { status: 400 });
    }

    // Criamos o Tópico + a primeira Resposta (manifesto)
    const topic = await prisma.topic.create({
      data: {
        title,
        communityId,
        authorId: session.user.id,
        replies: {
          create: {
            content,
            authorId: session.user.id,
          }
        }
      }
    });

    return NextResponse.json(topic);
  } catch (error) {
    console.error("Erro na API de tópicos:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}