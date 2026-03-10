"use client";
import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/app/components/Navbar";
import Link from "next/link";

export default function NewTopicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: communityId } = use(params);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/communities/${communityId}/topics`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      if (res.ok) {
        router.push(`/comunidades/${communityId}`);
        router.refresh();
      } else {
        alert("Erro ao criar tópico. Verifique se você é membro!");
      }
    } catch (error) {
      alert("Erro de conexão.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-10 text-slate-900">
      <Navbar userName="" />
      <main className="max-w-3xl mx-auto mt-10 px-4">
        <div className="bg-white p-6 rounded-lg border border-[#D4E4FA] shadow-sm">
          <h2 className="text-xl text-[#004B91] font-bold mb-6 border-b pb-3">Criar novo tópico</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-sm">
            <input required className="border border-[#D4E4FA] p-2 rounded outline-none focus:ring-1 focus:ring-blue-300" placeholder="Assunto" value={title} onChange={e => setTitle(e.target.value)} />
            <textarea required rows={8} className="border border-[#D4E4FA] p-2 rounded outline-none focus:ring-1 focus:ring-blue-300 resize-none" placeholder="Mensagem" value={content} onChange={e => setContent(e.target.value)} />
            <div className="flex items-center gap-4">
              <button type="submit" disabled={loading} className="bg-[#E6DB55] px-6 py-1.5 rounded text-xs font-bold uppercase disabled:opacity-50">
                {loading ? "Postando..." : "Postar Tópico"}
              </button>
              <Link href={`/comunidades/${communityId}`} className="text-blue-600 text-xs hover:underline">voltar</Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}