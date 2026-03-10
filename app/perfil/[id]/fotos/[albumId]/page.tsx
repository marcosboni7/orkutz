import { prisma } from "@/lib/prisma";
import { Navbar } from "@/app/components/Navbar";
import { Sidebar } from "@/app/components/Sidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PhotoUploadForm } from "@/app/components/PhotoUploadForm";

export default async function AlbumInternalPage({ params }: { params: Promise<{ id: string, albumId: string }> }) {
  const { id: profileId, albumId } = await params;
  const session = await getServerSession(authOptions);

  const album = await prisma.album.findUnique({
    where: { id: albumId },
    include: {
      photos: { orderBy: { createdAt: 'desc' } },
      user: {
        include: {
          _count: { select: { scraps: true, albums: true } }
        }
      }
    }
  });

  if (!album) notFound();

  const isMyProfile = session?.user?.id === album.userId;

  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-10">
      <Navbar userName={session?.user?.name || ""} />

      <main className="max-w-6xl mx-auto mt-6 px-4 grid grid-cols-1 md:grid-cols-[208px_1fr] gap-6">
        <Sidebar 
          user={album.user} 
          scrapCount={album.user._count.scraps} 
          albumCount={album.user._count.albums} 
        />

        <div className="bg-white p-6 rounded-lg border border-[#D4E4FA] shadow-sm">
          {/* Breadcrumbs estilo Orkut */}
          <div className="text-[11px] text-blue-600 mb-4 flex gap-1">
            <Link href={`/perfil/${profileId}/fotos`} className="hover:underline">Álbuns</Link> 
            <span>&gt;</span>
            <span className="text-slate-400">{album.title}</span>
          </div>

          <div className="flex justify-between items-end border-b border-[#D4E4FA] pb-2 mb-6">
            <div>
              <h2 className="text-xl text-[#004B91] font-bold">{album.title}</h2>
              <p className="text-xs text-slate-500">{album.photos.length} fotos</p>
            </div>
          </div>

          {/* ÁREA DE UPLOAD (Só para o dono) */}
          {isMyProfile && (
            <div className="mb-8 p-4 bg-yellow-50 border border-yellow-100 rounded">
              <h4 className="text-xs font-bold text-yellow-700 mb-2 uppercase text-[10px]">Adicionar nova foto</h4>
              <PhotoUploadForm albumId={albumId} profileId={profileId} />
            </div>
          )}

          {/* GRADE DE FOTOS COM LINKS */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {album.photos.map((photo) => (
              <div key={photo.id} className="group flex flex-col items-center">
                {/* O LINK ENVOLVE A FOTO PARA ABRIR O DETALHE/COMENTÁRIOS */}
                <Link 
                  href={`/perfil/${profileId}/fotos/${albumId}/${photo.id}`}
                  className="w-full aspect-square bg-white border border-[#D4E4FA] p-1 shadow-sm hover:border-blue-400 transition-all cursor-pointer"
                >
                  <img 
                    src={photo.url} 
                    alt={photo.description || "Foto"} 
                    className="w-full h-full object-cover"
                  />
                </Link>
                {photo.description && (
                   <p className="text-[10px] text-slate-500 mt-1 truncate w-full text-center">
                     {photo.description}
                   </p>
                )}
              </div>
            ))}

            {album.photos.length === 0 && (
              <p className="text-sm text-slate-400 italic col-span-full py-10 text-center">
                Este álbum ainda não tem fotos.
              </p>
            )}
          </div>

          <div className="mt-8 pt-4 border-t border-[#D4E4FA]">
             <Link href={`/perfil/${profileId}/fotos`} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
               « Voltar para álbuns
             </Link>
          </div>
        </div>
      </main>
    </div>
  );
}