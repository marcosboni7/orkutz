import { prisma } from "@/lib/prisma";
import { Navbar } from "@/app/components/Navbar";
import { Sidebar } from "@/app/components/Sidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import { TestimonialList } from "@/app/components/TestimonialList";

export default async function TestimonialsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: profileId } = await params;
  const session = await getServerSession(authOptions);

  // Busca o dono do perfil e os depoimentos (aceitos ou todos se for o dono)
  const user = await prisma.user.findUnique({
    where: { id: profileId },
    include: {
      _count: {
        select: {
          receivedScraps: true, // CORREÇÃO: Nome atualizado conforme o schema.prisma
          albums: true,
          testimonialsReceived: true,
        }
      }
    }
  });

  if (!user) notFound();

  const isMyProfile = session?.user?.id === profileId;

  // Busca os depoimentos
  const testimonials = await prisma.testimonial.findMany({
    where: {
      profileId,
      // Se não for meu perfil, mostra só os aceitos. Se for meu, traz tudo para eu gerenciar.
      ...(isMyProfile ? {} : { accepted: true })
    },
    include: {
      author: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-10">
      <Navbar userName={session?.user?.name || ""} />
      
      <main className="max-w-6xl mx-auto mt-6 px-4 grid grid-cols-1 md:grid-cols-[208px_1fr] gap-6">
        <Sidebar 
          user={user as any} 
          scrapCount={user._count.receivedScraps} // CORREÇÃO: Passando o nome novo
          albumCount={user._count.albums} 
          testimonialCount={user._count.testimonialsReceived} // ADIÇÃO: Contador de depoimentos
        />

        <div className="bg-white p-6 rounded-lg border border-[#D4E4FA] shadow-sm">
          <div className="flex justify-between items-center border-b border-[#D4E4FA] pb-4 mb-6">
            <h2 className="text-2xl text-[#004B91] font-light">
              Depoimentos de <span className="font-bold">{user.name}</span>
            </h2>
          </div>

          <TestimonialList 
            initialTestimonials={testimonials} 
            isMyProfile={isMyProfile} 
            profileId={profileId}
            currentUserId={session?.user?.id}
          />
        </div>
      </main>
    </div>
  );
}