import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const { requestId, action } = await req.json(); // action: "ACCEPTED" ou "DECLINED"

    if (action === "ACCEPTED") {
      await prisma.friendship.update({
        where: { id: requestId },
        data: { status: "ACCEPTED" }
      });
    } else {
      await prisma.friendship.delete({
        where: { id: requestId }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao processar resposta" }, { status: 500 });
  }
}