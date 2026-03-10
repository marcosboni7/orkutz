import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * GET: Lista os recados do mural de um usuário
 * O [id] aqui é o ID do dono do perfil (quem recebe os recados)
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;

    const scraps = await prisma.scrap.findMany({
      where: {
        recipientId: userId,
      },
      // ESSENCIAL: Busca os dados do autor na tabela User
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(scraps);
  } catch (error: any) {
    console.error("Erro ao buscar scraps:", error.message);
    return NextResponse.json({ error: "Erro ao carregar mural" }, { status: 500 });
  }
}

/**
 * POST: Cria um novo recado
 * O [id] na URL é o destinatário
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id: recipientId } = await params;

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { content } = await req.json();

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: "O recado não pode estar vazio" }, { status: 400 });
    }

    const scrap = await prisma.scrap.create({
      data: {
        content,
        author: {
          connect: { id: session.user.id }
        },
        recipient: {
          connect: { id: recipientId }
        }
      },
      // Retornamos com o autor incluído para o frontend atualizar na hora
      include: {
        author: {
          select: {
            name: true,
            image: true,
          }
        }
      }
    });

    return NextResponse.json(scrap);
  } catch (error: any) {
    console.error("ERRO NO POST /api/scraps:", error.message);
    return NextResponse.json({ error: "Erro ao salvar recado." }, { status: 500 });
  }
}

/**
 * DELETE: Remove um recado
 * O [id] na URL é o ID do SCRAP
 */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id: scrapId } = await params;

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const scrap = await prisma.scrap.findUnique({
      where: { id: scrapId },
    });

    if (!scrap) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });

    const isAuthor = scrap.authorId === session.user.id;
    const isRecipient = scrap.recipientId === session.user.id;

    if (!isAuthor && !isRecipient) {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
    }

    await prisma.scrap.delete({ where: { id: scrapId } });

    return NextResponse.json({ message: "Removido" });
  } catch (error: any) {
    return NextResponse.json({ error: "Erro ao deletar" }, { status: 500 });
  }
}