import { prisma } from "@/lib/prisma";
import { Navbar } from "@/app/components/Navbar";
import { Sidebar } from "@/app/components/Sidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PhotoComments } from "@/app/components/PhotoComments";

export default async function PhotoDetailPage({ params }: { params: Promise<{ id: string, albumId: string, photoId: string }> }) {
  const { id: profileId, albumId, photoId } = await params;
  const session = await getServerSession(authOptions);

  const photo = await prisma.photo.findUnique({
    where: { id: photoId },
    include: {
      album: true,
      comments: {
        include: { user: true },
        orderBy: { createdAt: 'asc' }
      }
    }
  });

  const user = await prisma.user.findUnique({
    where: { id: profileId },
    include: { _count: { select: { scraps: true, albums: true } } }
  });

  if (!photo || !user) notFound();

  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-10">
      <Navbar userName={session?.user?.name || ""} />
      <main className="max-w-6xl mx-auto mt-6 px-4 grid grid-cols-1 md:grid-cols-[208px_1fr] gap-6">
        <Sidebar user={user} scrapCount={user._count.scraps} albumCount={user._count.albums} />

        <div className="bg-white p-6 rounded-lg border border-[#D4E4FA] shadow-sm">
          <div className="text-[11px] text-blue-600 mb-4 flex gap-1">
            <Link href={`/perfil/${profileId}/fotos`} className="hover:underline">Álbuns</Link> 
            <span>&gt;</span>
            <Link href={`/perfil/${profileId}/fotos/${albumId}`} className="hover:underline">{photo.album.title}</Link>
            <span>&gt;</span>
            <span className="text-slate-400">Visualizar Foto</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="p-2 bg-white border border-[#D4E4FA] shadow-md inline-block">
              <img src={photo.url} className="max-w-full max-h-[600px] object-contain" />
            </div>
          </div>

          <PhotoComments 
            photoId={photoId} 
            comments={photo.comments} 
            currentUser={session?.user} 
          />
        </div>
      </main>
    </div>
  );
}