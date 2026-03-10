import { prisma } from "@/lib/prisma";
import { Navbar } from "@/app/components/Navbar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ReplyForm } from "@/app/components/ReplyForm";

export default async function TopicDetailPage({ params }: { params: Promise<{ id: string, topicId: string }> }) {
  const { id: communityId, topicId } = await params;
  const session = await getServerSession(authOptions);

  const topic = await prisma.topic.findUnique({
    where: { id: topicId },
    include: {
      community: { select: { name: true } },
      replies: {
        orderBy: { createdAt: 'asc' },
        include: { author: { select: { id: true, name: true, image: true } } }
      }
    }
  });

  if (!topic) notFound();

  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-10 text-slate-900">
      <Navbar userName={session?.user?.name || ""} />
      <main className="max-w-4xl mx-auto mt-6 px-4">
        <div className="bg-white rounded-lg border border-[#D4E4FA] shadow-sm overflow-hidden text-sm">
          <div className="bg-[#D4E4FA] px-4 py-2 text-[#004B91] font-bold">Tópico: {topic.title}</div>
          <div className="flex flex-col">
            {topic.replies.map((reply, index) => (
              <div key={reply.id} className={`flex gap-4 p-4 border-b border-slate-100 ${index % 2 !== 0 ? 'bg-slate-50/50' : ''}`}>
                <div className="w-20 flex flex-col items-center">
                  <img src={reply.author.image || "https://i.imgur.com/8Q5uO5X.png"} className="w-12 h-12 rounded border border-slate-200 object-cover" />
                  <span className="text-[10px] text-blue-600 font-bold mt-1 text-center">{reply.author.name?.split(' ')[0]}</span>
                </div>
                <div className="flex-1">
                  <p className="whitespace-pre-wrap text-slate-700">{reply.content}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-6 bg-blue-50/20">
             <ReplyForm topicId={topic.id} communityId={communityId} />
          </div>
        </div>
      </main>
    </div>
  );
}