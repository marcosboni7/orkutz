import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// --- CONFIGURAÇÃO DE LIMITE DE TAMANHO ---
// Isso impede que o Next.js barre o envio de fotos maiores (Base64)
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Verifica se o usuário está logado
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { imageUrl } = await req.json();

    // Verifica se a imagem (string ou base64) foi enviada
    if (!imageUrl) {
      return NextResponse.json({ error: "Dados da imagem são obrigatórios" }, { status: 400 });
    }

    // Atualiza o campo image no PostgreSQL (agora com suporte a @db.Text)
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { image: imageUrl },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Erro na API de Update Image:", error);
    return NextResponse.json(
      { error: "Erro interno ao salvar a foto no banco de dados." }, 
      { status: 500 }
    );
  }
}