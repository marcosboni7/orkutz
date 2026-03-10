import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { url, albumId, profileId } = await req.json();

  // Verifica se o usuário é o dono do perfil onde o álbum está
  if (session.user.id !== profileId) {
     return NextResponse.json({ error: "Você não pode postar fotos aqui" }, { status: 403 });
  }

  const photo = await prisma.photo.create({
    data: {
      url, // Aqui salvaremos a string da imagem
      albumId
    }
  });

  return NextResponse.json(photo);
}