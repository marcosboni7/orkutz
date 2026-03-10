import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Verifique se o caminho está correto para o seu projeto

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // LOG DE DEBUG: Veja se isso aparece no seu terminal do VS Code
    console.log("Sessão encontrada na API de Status:", session?.user?.email);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Sessão não encontrada ou expirada" }, { status: 401 });
    }

    const body = await req.json();
    const { status } = body;

    // Tenta atualizar o usuário
    const updatedUser = await prisma.user.update({
      where: { 
        email: session.user.email // O email precisa ser idêntico ao que está no banco
      },
      data: { 
        status: status 
      },
    });

    console.log("Status atualizado no banco com sucesso!");
    return NextResponse.json(updatedUser);

  } catch (error: any) {
    // Esse log vai te dizer se o erro é "Record not found" ou algo de conexão
    console.error("ERRO DETALHADO NO PRISMA:", error.message);
    
    return NextResponse.json(
      { error: "Erro interno ao salvar no banco", details: error.message }, 
      { status: 500 }
    );
  }
}