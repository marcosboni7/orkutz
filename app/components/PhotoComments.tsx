"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function PhotoComments({ photoId, comments, currentUser }: any) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    const res = await fetch(`/api/photos/${photoId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    if (res.ok) {
      setContent("");
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="mt-6 bg-[#F0F2F5] p-4 rounded-lg border border-[#D4E4FA]">
      <h4 className="text-[#004B91] font-bold text-xs mb-4 uppercase">Comentários</h4>
      
      <div className="space-y-3 mb-6">
        {comments.map((comment: any) => (
          <div key={comment.id} className="bg-white p-3 rounded border border-white shadow-sm flex gap-3">
            <img 
              src={comment.user.image || "https://i.imgur.com/8Q5uO5X.png"} 
              className="w-8 h-8 rounded object-cover border border-[#D4E4FA]"
            />
            <div>
              <p className="text-[11px] font-bold text-blue-700">{comment.user.name}</p>
              <p className="text-xs text-slate-700 mt-1">{comment.content}</p>
              <p className="text-[9px] text-slate-400 mt-1">
                {new Date(comment.createdAt).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-xs text-slate-400 italic">Nenhum comentário ainda. Seja o primeiro!</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <textarea
          placeholder="Escreva um comentário..."
          className="w-full text-xs p-2 border border-[#D4E4FA] rounded outline-none focus:border-blue-300 min-h-[60px]"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          disabled={loading}
          className="self-end bg-[#E6DB55] px-6 py-1 rounded text-[11px] font-bold uppercase hover:bg-[#d4c944] disabled:opacity-50"
        >
          {loading ? "Enviando..." : "Comentar"}
        </button>
      </form>
    </div>
  );
}