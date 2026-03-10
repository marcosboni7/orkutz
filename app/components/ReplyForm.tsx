"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function ReplyForm({ topicId, communityId }: { topicId: string, communityId: string }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    setLoading(true);
    const res = await fetch(`/api/communities/${communityId}/topics/${topicId}/replies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    if (res.ok) {
      setContent("");
      router.refresh(); // Atualiza a lista de respostas na tela
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <textarea
        required
        rows={4}
        className="w-full border border-[#D4E4FA] p-2 rounded text-sm focus:ring-1 focus:ring-blue-400 outline-none"
        placeholder="Escreva sua resposta..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-[#E6DB55] self-start px-6 py-1 rounded text-[10px] font-bold uppercase hover:bg-[#d4c944] disabled:opacity-50"
      >
        {loading ? "Enviando..." : "Responder"}
      </button>
    </form>
  );
}