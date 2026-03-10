import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { content, profileId } = await req.json();

    if (!content || !profileId) {
      return NextResponse.json({ error: "Dados insuficientes" }, { status: 400 });
    }

    // Usamos 'connect' para vincular o autor e o perfil
    const testimonial = await prisma.testimonial.create({
      data: {
        content,
        accepted: false, // Todo depoimento começa oculto até ser aceito
        author: {
          connect: { id: session.user.id }
        },
        profile: {
          connect: { id: profileId }
        }
      },
    });

    return NextResponse.json(testimonial);
  } catch (error: any) {
    console.error("ERRO NO POST TESTIMONIAL:", error.message);
    return NextResponse.json({ error: "Erro ao enviar depoimento" }, { status: 500 });
  }
}

// Para Aceitar ou Deletar (Dono do perfil)
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id, action } = await req.json();

    const testimonial = await prisma.testimonial.findUnique({ 
      where: { id } 
    });

    // Apenas o dono do perfil (profileId) pode aceitar ou deletar o depoimento
    if (!testimonial || testimonial.profileId !== session.user.id) {
      return NextResponse.json({ error: "Proibido ou não encontrado" }, { status: 403 });
    }

    if (action === "accept") {
      await prisma.testimonial.update({
        where: { id },
        data: { accepted: true }
      });
    } else if (action === "delete") {
      await prisma.testimonial.delete({ 
        where: { id } 
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: "Erro na operação" }, { status: 500 });
  }
}