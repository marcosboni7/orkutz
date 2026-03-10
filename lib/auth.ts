import { NextAuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import bcrypt from "bcrypt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
  interface User {
    id: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email?: string | null;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        const user = await prisma.user.findUnique({ 
          where: { email: credentials.email } 
        });

        if (!user || !user.password) return null;
        
        const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordCorrect) return null;

        // RETORNO ULTRA LEVE: Apenas os IDs. 
        // Zero imagens aqui para o cookie não explodir.
        return { 
          id: user.id, 
          name: user.name, 
          email: user.email
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        // Forçamos o image como null para garantir que nada pesado viaje no header
        session.user.image = null;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
};