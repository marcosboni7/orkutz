import { prisma } from "@/lib/prisma";
import { Navbar } from "@/app/components/Navbar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

export default async function CommunitiesPage() {
  const session = await getServerSession(authOptions);

  const communities = await prisma.community.findMany({
    include: {
      _count: { select: { members: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-10 text-slate-900">
      <Navbar userName={session?.user?.name || ""} />
      <main className="max-w-6xl mx-auto mt-6 px-4">
        <div className="bg-white p-6 rounded-lg border border-[#D4E4FA] shadow-sm">
          <div className="flex justify-between items-center border-b border-[#D4E4FA] pb-4 mb-6">
            <h2 className="text-2xl text-[#004B91] font-light">Comunidades</h2>
            <Link 
              href="/comunidades/criar" 
              className="bg-[#E6DB55] px-4 py-1.5 rounded text-xs font-bold uppercase hover:bg-[#d4c944] shadow-sm"
            >
              criar comunidade
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-8">
            {communities.map((com) => (
              <Link key={com.id} href={`/comunidades/${com.id}`} className="flex flex-col items-center group cursor-pointer">
                <div className="w-24 h-24 rounded-lg border border-slate-200 overflow-hidden mb-2 group-hover:border-blue-400 transition-all bg-white shadow-sm">
                  <img src={com.image || "https://i.imgur.com/8Q5uO5X.png"} className="w-full h-full object-cover" />
                </div>
                <span className="text-[13px] font-bold text-blue-600 group-hover:underline text-center line-clamp-2 leading-tight">
                  {com.name}
                </span>
                <span className="text-[10px] text-slate-400 uppercase font-medium">
                  ({com._count.members} membros)
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}