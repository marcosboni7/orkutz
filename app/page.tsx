import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma"; 
import { Navbar } from "./components/Navbar"; 
import { Sidebar } from "./components/Sidebar";
import { ScrapWall } from "./components/ScrapWall";
import { MemberList } from "./components/MemberList";
import { StatusField } from "./components/StatusField"; 
import { FriendRequests } from "./components/FriendRequests";
import { DailyLuck } from "./components/DailyLuck";
import { UserRatings } from "./components/UserRatings";
import { RecentVisitors } from "./components/RecentVisitors";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  // 1. Busca e Atualiza o usuário logado (Ping de Online e Dados do Perfil)
  const dbUser = await prisma.user.update({
    where: { email: session.user?.email as string },
    data: { lastSeen: new Date() }, // Atualiza o "Online agora"
    select: { 
      id: true,
      name: true,
      image: true,
      status: true,
      trusty: true, 
      cool: true,   
      sexy: true    
    }
  });

  if (!dbUser) redirect("/login");

  // 2. Conta os recados recebidos
  const scrapCount = await prisma.scrap.count({
    where: { recipientId: dbUser.id }
  });

  // 3. Conta o total de visitas que o seu perfil já recebeu
  const totalVisits = await prisma.visit.count({
    where: { visitedId: dbUser.id }
  });

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-slate-900 pb-10">
      <Navbar userName={dbUser.name || ""} />

      <main className="max-w-6xl mx-auto mt-6 px-4 grid grid-cols-1 md:grid-cols-[208px_1fr_256px] gap-6">
        
        {/* COLUNA 1: SIDEBAR */}
        <Sidebar user={dbUser} scrapCount={scrapCount} />

        {/* COLUNA 2: CENTRAL */}
        <div className="flex flex-col gap-4">
          
          <FriendRequests />
          
          <div className="bg-white p-6 rounded-lg border border-[#D4E4FA] shadow-sm">
            <div className="flex justify-between items-start">
              <h2 className="text-2xl text-[#004B91] mb-2 font-light">
                Bem-vindo(a), <span className="font-bold">{dbUser.name}</span>
              </h2>
              {/* Contador de Visualizações */}
              <span className="text-[10px] text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                {totalVisits} visualizações de perfil
              </span>
            </div>
            
            <StatusField initialStatus={dbUser?.status || "Codar o Orkut é como viajar no tempo..."} />

            <UserRatings 
              trusty={dbUser?.trusty || 0} 
              cool={dbUser?.cool || 0} 
              sexy={dbUser?.sexy || 0} 
            />

            <div className="mt-6">
              <DailyLuck />
            </div>
          </div>
          
          {/* Mural de recados (Scraps) */}
          <ScrapWall targetUserId={dbUser.id} />

        </div>

        {/* COLUNA 3: DIREITA */}
        <aside className="flex flex-col gap-4">
          
          {/* Passamos o ID para o MemberList buscar os amigos deste usuário */}
          <MemberList userId={dbUser.id} />

          <RecentVisitors userId={dbUser.id} />

          {/* Card de Comunidades (Estatico por enquanto) */}
          <div className="bg-white rounded-lg border border-[#D4E4FA] shadow-sm">
            <div className="flex justify-between items-center bg-[#D4E4FA] px-3 py-1 text-[#004B91] text-xs font-bold rounded-t-lg">
              <span>Minhas Comunidades (0)</span>
              <span className="text-[10px] font-normal underline cursor-pointer">ver todas</span>
            </div>
            <div className="p-4 grid grid-cols-3 gap-2 min-h-[150px] place-content-start">
               <p className="col-span-3 text-[10px] text-slate-400 text-center mt-8 italic px-2">
                 Você não participa de nenhuma comunidade.
               </p>
            </div>
          </div>

        </aside>
      </main>
    </div>
  );
}