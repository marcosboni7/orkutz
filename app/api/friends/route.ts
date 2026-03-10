import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// 1. GET: Busca amigos aceitos OU solicitações pendentes
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status"); 

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    // CASO A: Buscar solicitações PENDENTES que enviaram para VOCÊ
    if (status === "pending") {
      const pending = await prisma.friendship.findMany({
        where: {
          receiver: { email: session.user.email },
          accepted: false,
        },
        include: {
          sender: { // Traz os dados de quem enviou (foto, nome)
            select: { id: true, name: true, image: true, email: true }
          }
        },
      });

      return NextResponse.json(pending);
    }

    // CASO B: Buscar amigos ACEITOS (para o grid de fotos)
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { senderEmail: session.user.email, accepted: true },
          { receiver: { email: session.user.email }, accepted: true }
        ]
      },
      include: { 
        sender: true,
        receiver: true 
      }
    });

    // Mapeia para retornar o objeto do "outro" (quem não é você)
    const friendsList = friendships.map(f => {
      return f.senderEmail === session.user.email ? f.receiver : f.sender;
    });

    return NextResponse.json(friendsList);
  } catch (error) {
    console.error("Erro no GET friends:", error);
    return NextResponse.json({ error: "Erro ao buscar dados" }, { status: 500 });
  }
}

// 2. POST: Envia uma nova solicitação
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  try {
    const { receiverId } = await req.json();
    
    // Busca o seu ID pelo seu e-mail da sessão
    const me = await prisma.user.findUnique({ where: { email: session.user.email } });

    if (me?.id === receiverId) {
      return NextResponse.json({ error: "Você não pode se auto-adicionar" }, { status: 400 });
    }

    const friendship = await prisma.friendship.create({
      data: {
        senderEmail: session.user.email,
        receiverId: receiverId,
        accepted: false,
      },
    });

    return NextResponse.json(friendship);
  } catch (error) {
    return NextResponse.json({ error: "Solicitação já existe ou erro no banco" }, { status: 400 });
  }
}

// 3. PATCH: Aceita uma solicitação
export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  try {
    const { friendshipId } = await req.json();

    const updated = await prisma.friendship.update({
      where: { id: friendshipId },
      data: { accepted: true }
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao aceitar amizade" }, { status: 400 });
  }
}

// 4. DELETE: Recusa ou remove amizade
export async function DELETE(req: Request) {
  try {
    const { friendshipId } = await req.json();
    await prisma.friendship.delete({ where: { id: friendshipId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao remover" }, { status: 400 });
  }
}