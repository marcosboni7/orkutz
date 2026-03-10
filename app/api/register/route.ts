import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return new NextResponse("Campos faltando", { status: 400 });
    }

    // 1. Verifica se o usuário já existe para evitar o Erro 500 genérico
    const exists = await prisma.user.findUnique({
      where: { email }
    });

    if (exists) {
      return new NextResponse("Este e-mail já está cadastrado", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 2. Cria o usuário com os campos padrão do OrkutZ
    const user = await prisma.user.create({
      data: { 
        name, 
        email, 
        password: hashedPassword,
        status: "Bem-vindo ao OrkutZ!", // Status inicial
        trusty: 0, // Confiável
        cool: 0,   // Legal
        sexy: 0    // Sexy
      }
    });

    // 3. Por segurança, não devolvemos a senha no JSON
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error("Erro no registro:", error);
    return new NextResponse("Erro interno no servidor", { status: 500 });
  }
}