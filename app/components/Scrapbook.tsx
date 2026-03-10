"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function Scrapbook({ recipientId, scraps }: { recipientId: string, scraps: any[] }) {
  const [content, setContent] = useState("");
  const router = useRouter();

  const sendScrap = async () => {
    if (!content.trim()) return;
    const res = await fetch(`/api/scraps/${recipientId}`, {
      method: "POST",
      body: JSON.stringify({ content }),
    });
    if (res.ok) {
      setContent("");
      router.refresh();
    }
  };

  return (
    <div className="bg-white rounded-lg border border-[#D4E4FA] overflow-hidden">
      <div className="bg-[#D4E4FA] px-4 py-1 text-[#004B91] font-bold text-xs uppercase">
        Mural de Recados
      </div>
      
      {/* Área de envio */}
      <div className="p-4 bg-yellow-50 border-b border-[#D4E4FA]">
        <textarea 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Deixe um scrap para seu amigo..."
          className="w-full p-2 text-sm border border-yellow-200 rounded outline-none h-20"
        />
        <button 
          onClick={sendScrap}
          className="mt-2 bg-[#E6DB55] px-4 py-1 rounded text-[10px] font-bold uppercase hover:bg-[#d4c944]"
        >
          Enviar Scrap
        </button>
      </div>

      {/* Lista de Recados */}
      <div className="flex flex-col">
        {scraps.length === 0 ? (
          <p className="p-4 text-xs text-slate-400 italic">Nenhum recado ainda.</p>
        ) : (
          scraps.map((s) => (
            <div key={s.id} className="p-4 border-b border-slate-100 flex gap-4">
              <img src={s.author.image} className="w-12 h-12 rounded border border-slate-200" />
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-bold text-blue-600">{s.author.name}</span>
                <p className="text-sm text-slate-700">{s.content}</p>
                <span className="text-[9px] text-slate-400">
                  {new Date(s.createdAt).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}