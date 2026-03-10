import { prisma } from "@/lib/prisma";
import { Navbar } from "@/app/components/Navbar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import { JoinCommunityButton } from "@/app/components/JoinCommunityButton";

// Força o Next.js a buscar dados novos sempre, evitando cache de "Nenhum tópico"
export const revalidate = 0;

export default async function CommunityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  const community = await prisma.community.findUnique({
    where: { id },
    include: {
      _count: { select: { members: true, topics: true } },
      members: { take: 9, select: { id: true, name: true, image: true } },
      topics: {
        orderBy: { createdAt: 'desc' },
        include: { 
          author: { select: { name: true } }, 
          _count: { select: { replies: true } } 
        }
      }
    }
  });

  if (!community) notFound();

  const isMember = community.members.some(m => m.id === session?.user?.id);

  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-10 text-slate-900">
      <Navbar userName={session?.user?.name || ""} />
      <main className="max-w-6xl mx-auto mt-6 px-4 grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
        {/* Sidebar Esquerda */}
        <aside className="flex flex-col gap-4">
          <div className="bg-white p-3 rounded-lg border border-[#D4E4FA] shadow-sm flex flex-col items-center">
            <img 
              src={community.image || "https://i.imgur.com/8Q5uO5X.png"} 
              className="w-full aspect-square object-cover rounded border border-[#D4E4FA]" 
            />
            <h1 className="mt-3 font-bold text-[#004B91] text-center">{community.name}</h1>
            <div className="mt-4 w-full">
              <JoinCommunityButton communityId={community.id} isMember={isMember} />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-[#D4E4FA] shadow-sm">
            <h3 className="text-[#004B91] font-bold text-xs uppercase mb-3">Membros ({community._count.members})</h3>
            <div className="grid grid-cols-3 gap-2">
              {community.members.map(member => (
                <div key={member.id} title={member.name || ""} className="w-full aspect-square bg-slate-100 rounded overflow-hidden border border-slate-200">
                  <img src={member.image || "https://i.imgur.com/8Q5uO5X.png"} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Conteúdo Principal */}
        <div className="flex flex-col gap-6">
          <div className="bg-white p-6 rounded-lg border border-[#D4E4FA] shadow-sm">
            <h2 className="text-[#004B91] font-bold border-b pb-2 mb-4">Início</h2>
            <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-wrap">{community.description}</p>
          </div>

          {/* Listagem do Fórum */}
          <div className="bg-white rounded-lg border border-[#D4E4FA] shadow-sm overflow-hidden">
             <div className="bg-[#D4E4FA] px-4 py-2 flex justify-between items-center">
                <h3 className="text-[#004B91] font-bold text-xs uppercase">Fórum</h3>
                <Link 
                  href={`/comunidades/${id}/topico/novo`} 
                  className="text-[10px] bg-[#E6DB55] px-3 py-1 rounded text-black font-bold hover:bg-[#d4c944] transition-colors"
                >
                  CRIAR TÓPICO
                </Link>
             </div>
             
             <div className="flex flex-col">
                {community.topics.length === 0 ? (
                  <div className="p-10 text-center text-xs text-slate-400 italic">
                    Nenhum tópico criado ainda. Seja o primeiro!
                  </div>
                ) : (
                  community.topics.map((topic) => (
                    <Link 
                      key={topic.id}
                      href={`/comunidades/${id}/topico/${topic.id}`}
                      className="flex items-center justify-between px-4 py-3 border-b border-slate-100 hover:bg-blue-50/50 transition-colors"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-blue-600 hover:underline">
                          {topic.title}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          por: {topic.author.name}
                        </span>
                      </div>
                      
                      <div className="text-[10px] text-slate-500 font-medium bg-slate-50 px-2 py-1 rounded border border-slate-100">
                        {topic._count.replies} {topic._count.replies === 1 ? 'resposta' : 'respostas'}
                      </div>
                    </Link>
                  ))
                )}
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}