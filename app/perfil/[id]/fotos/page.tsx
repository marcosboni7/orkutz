import { prisma } from "@/lib/prisma";
import { Navbar } from "@/app/components/Navbar";
import { Sidebar } from "@/app/components/Sidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function AlbumsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: profileId } = await params;
  const session = await getServerSession(authOptions);

  // Busca o usuário com contagem de scraps e álbuns, incluindo a foto de capa de cada álbum
  const user = await prisma.user.findUnique({
    where: { id: profileId },
    include: {
      albums: {
        include: {
          photos: {
            take: 1,
            orderBy: { createdAt: 'desc' }
          },
          _count: { select: { photos: true } }
        },
        orderBy: { createdAt: 'desc' }
      },
      _count: {
        select: {
          scraps: true,
          albums: true
        }
      }
    }
  });

  if (!user) notFound();

  const isMyProfile = session?.user?.id === user.id;

  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-10">
      <Navbar userName={session?.user?.name || ""} />

      <main className="max-w-6xl mx-auto mt-6 px-4 grid grid-cols-1 md:grid-cols-[208px_1fr] gap-6">
        {/* Sidebar com contadores reais */}
        <Sidebar 
          user={user} 
          scrapCount={user._count.scraps} 
          albumCount={user._count.albums} 
        />

        <div className="bg-white p-6 rounded-lg border border-[#D4E4FA] shadow-sm">
          <div className="flex justify-between items-center border-b border-[#D4E4FA] pb-4 mb-6">
            <h2 className="text-2xl text-[#004B91] font-light">
              Álbuns de <span className="font-bold">{user.name}</span>
            </h2>
            
            {isMyProfile && (
              <Link 
                href={`/perfil/${profileId}/fotos/novo`}
                className="bg-[#E6DB55] text-[#444] px-4 py-1 rounded-sm text-xs font-bold hover:bg-[#d4c944] transition-colors"
              >
                criar novo álbum
              </Link>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {user.albums.map((album) => {
              const coverPhoto = album.photos[0]?.url;

              return (
                <Link 
                  key={album.id} 
                  href={`/perfil/${profileId}/fotos/${album.id}`} 
                  className="group flex flex-col items-center"
                >
                  {/* Moldura da Capa do Álbum Dinâmica */}
                  <div className="w-full aspect-square bg-[#F0F2F5] border border-[#D4E4FA] p-1 shadow-sm group-hover:border-blue-400 transition-all flex items-center justify-center relative overflow-hidden bg-white">
                    {coverPhoto ? (
                      <img 
                        src={coverPhoto} 
                        alt={album.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center opacity-20">
                        <span className="text-4xl">🖼️</span>
                        <span className="text-[10px] uppercase font-bold">Vazio</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-2 text-center">
                    <p className="text-xs font-bold text-blue-700 group-hover:underline truncate w-32">
                      {album.title}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {album._count.photos} {album._count.photos === 1 ? 'foto' : 'fotos'}
                    </p>
                  </div>
                </Link>
              );
            })}

            {user.albums.length === 0 && (
              <div className="col-span-full py-10 text-center bg-slate-50 border border-dashed border-slate-200 rounded">
                <p className="text-sm text-slate-400 italic">Este usuário ainda não criou nenhum álbum.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}