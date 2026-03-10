import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Verifique se o caminho do seu authOptions está correto aqui

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // 1. Verificação de Sessão
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "Sessão inválida. Por favor, faça logout e login novamente." }, 
        { status: 401 }
      );
    }

    const body = await req.json();
    const { content, receiverId } = body;

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: "O conteúdo não pode estar vazio" }, { status: 400 });
    }

    // 2. Define o alvo: Se houver receiverId, vai para o mural do amigo. 
    // Se não houver, vai para o mural de quem está logado.
    const targetId = receiverId || session.user.id;

    // 3. Criando o registro no banco
    const scrap = await prisma.scrap.create({
      data: {
        content: content,
        authorId: targetId, // O mural onde o recado vai aparecer
        authorName: session.user.name || "Membro do OrkutZ",
        authorImage: session.user.image || "https://i.imgur.com/8Q5uO5X.png",
      }
    });

    return NextResponse.json(scrap);

  } catch (error: any) {
    console.error("ERRO DETALHADO NO POST /api/scraps:", error.message);
    
    return NextResponse.json(
      { error: "Erro ao salvar recado no banco de dados." },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    // Se um userId for passado na URL (ex: /api/scraps?userId=123), 
    // buscamos apenas os recados desse usuário. 
    // Caso contrário, buscamos todos (ou você pode ajustar para buscar os do logado).
    const scraps = await prisma.scrap.findMany({
      where: userId ? { authorId: userId } : {},
      orderBy: { 
        createdAt: 'desc' 
      },
      take: 50 
    });
    
    return NextResponse.json(scraps);
  } catch (error: any) {
    console.error("Erro ao buscar scraps:", error.message);
    return NextResponse.json({ error: "Erro ao carregar o mural" }, { status: 500 });
  }
}