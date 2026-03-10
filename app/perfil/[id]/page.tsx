import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Navbar } from "../../components/Navbar";
import { Sidebar } from "../../components/Sidebar";
import { UserRatings } from "../../components/UserRatings";
import { VisitTracker } from "../../components/VisitTracker";
import { ScrapWall } from "../../components/ScrapWall";
import { AddFriendButton } from "../../components/AddFriendButton";
import { FriendsList } from "../../components/FriendsList";

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const { id: profileId } = await params;

  if (!profileId) notFound();

  // 1. AJUSTE NA CONSULTA: Mudamos de 'scraps' para 'receivedScraps'
  const user = await prisma.user.findUnique({
    where: { id: profileId },
    include: {
      _count: {
        select: {
          receivedScraps: true, // Nome atualizado no Schema
          albums: true,
          // Contamos apenas depoimentos que o dono do perfil aceitou
          testimonialsReceived: {
            where: { accepted: true }
          }
        }
      }
    }
  });

  if (!user) notFound();

  const isMyOwnProfile = session?.user?.id === user.id;

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-slate-900 pb-10">
      <Navbar userName={session?.user?.name || ""} />
      
      {!isMyOwnProfile && <VisitTracker profileId={user.id} />}

      <main className="max-w-6xl mx-auto mt-6 px-4 grid grid-cols-1 md:grid-cols-[208px_1fr_256px] gap-6">
        
        {/* 2. AJUSTE NA SIDEBAR: Passamos o receivedScraps */}
        <Sidebar 
          user={user as any} 
          scrapCount={user._count.receivedScraps}
          albumCount={user._count.albums}
          testimonialCount={user._count.testimonialsReceived} 
          isReadOnly={true} 
        />

        <div className="flex flex-col gap-4">
          <div className="bg-white p-6 rounded-lg border border-[#D4E4FA] shadow-sm">
            <div className="flex items-center gap-4 mb-4">
               <img 
                 src={user.image || "https://i.imgur.com/8Q5uO5X.png"} 
                 className="w-20 h-20 border-2 border-[#D4E4FA] rounded-sm object-cover"
                 alt={user.name || "Perfil"}
               />
               <div>
                  <h2 className="text-2xl text-[#004B91] font-light">
                    Perfil de <span className="font-bold">{user.name}</span>
                  </h2>
                  <p className="text-sm text-slate-500 italic">"{user.status}"</p>
               </div>
            </div>

            <UserRatings 
              trusty={user.trusty} 
              cool={user.cool} 
              sexy={user.sexy} 
              targetUserId={user.id}
              isReadOnly={isMyOwnProfile}
            />
          </div>

          <ScrapWall targetUserId={user.id} />
        </div>

        <aside className="flex flex-col gap-4">
          <div className="bg-white p-4 rounded-lg border border-[#D4E4FA] shadow-sm">
            <h3 className="text-[#004B91] text-[11px] font-bold mb-3 uppercase tracking-wider">Ações</h3>
            <div className="flex flex-col gap-2">
              {!isMyOwnProfile && (
                <>
                  <AddFriendButton targetUserId={user.id} />
                  
                  <button className="text-left text-xs text-blue-600 hover:underline flex items-center gap-2">
                    <span>💌</span> Enviar Scrap
                  </button>
                  
                  <Link 
                    href={`/perfil/${user.id}/depoimentos`}
                    className="text-left text-xs text-blue-600 hover:underline flex items-center gap-2"
                  >
                    <span>📜</span> Escrever Depoimento
                  </Link>
                </>
              )}
              
              <button className="text-left text-xs text-blue-600 hover:underline flex items-center gap-2">
                <span>⭐</span> Adicionar aos Favoritos
              </button>

              <Link 
                href={`/perfil/${user.id}/fotos`}
                className="text-left text-xs text-blue-600 hover:underline flex items-center gap-2"
              >
                <span>📸</span> Ver Fotos
              </Link>

              <button className="text-left text-xs text-blue-600 hover:underline flex items-center gap-2">
                <span>🚫</span> Denunciar Usuário
              </button>
            </div>
          </div>

          <FriendsList userId={user.id} />
          
          <div className="bg-blue-50 p-4 rounded border border-blue-100">
              <p className="text-[10px] text-blue-400 text-center uppercase font-bold">Publicidade</p>
              <div className="h-32 flex items-center justify-center text-blue-200">
                [Google Ads]
              </div>
          </div>
        </aside>
      </main>
    </div>
  );
}