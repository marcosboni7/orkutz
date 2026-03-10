"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function TestimonialList({ initialTestimonials, isMyProfile, profileId, currentUserId }: any) {
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Dividir entre aceitos e pendentes (só o dono vê pendentes)
  const accepted = testimonials.filter((t: any) => t.accepted);
  const pending = testimonials.filter((t: any) => !t.accepted);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    const res = await fetch("/api/testimonials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, profileId }),
    });

    if (res.ok) {
      setContent("");
      alert("Depoimento enviado! Aguarde a aprovação do dono do perfil. 😉");
      router.refresh();
    }
    setLoading(false);
  };

  const handleAction = async (id: string, action: "accept" | "delete") => {
    const res = await fetch("/api/testimonials", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action }),
    });

    if (res.ok) {
      router.refresh();
      // Atualiza a lista localmente para dar feedback instantâneo
      if (action === "accept") {
        setTestimonials(testimonials.map((t: any) => t.id === id ? { ...t, accepted: true } : t));
      } else {
        setTestimonials(testimonials.filter((t: any) => t.id !== id));
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* SEÇÃO DE ENVIO (Só aparece se não for o meu perfil) */}
      {!isMyProfile && currentUserId && (
        <div className="bg-[#FFF9C4] p-4 rounded border border-yellow-200">
          <h4 className="text-[#827717] font-bold text-xs mb-2 uppercase">Escrever depoimento para este amigo</h4>
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <textarea
              className="w-full p-2 text-sm border border-yellow-300 rounded outline-none focus:border-yellow-500 min-h-[80px]"
              placeholder="Capricha no depoimento! (Lembre-se: o dono precisa aceitar)"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <button
              disabled={loading}
              className="self-end bg-[#E6DB55] px-6 py-1 rounded text-xs font-bold uppercase hover:bg-[#d4c944] disabled:opacity-50"
            >
              {loading ? "Enviando..." : "Enviar Depoimento"}
            </button>
          </form>
        </div>
      )}

      {/* DEPOIMENTOS PENDENTES (Só o dono do perfil vê) */}
      {isMyProfile && pending.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-pink-600 font-bold text-sm border-b border-pink-100 pb-1">
            Depoimentos Pendentes ({pending.length}) - <span className="text-[10px] font-normal italic">Apenas você vê isso</span>
          </h3>
          {pending.map((t: any) => (
            <div key={t.id} className="bg-pink-50 p-4 rounded border border-pink-100 flex gap-4">
               <img src={t.author.image} className="w-12 h-12 rounded border border-pink-200" />
               <div className="flex-1">
                  <p className="text-xs font-bold text-pink-700">{t.author.name} escreveu:</p>
                  <p className="text-sm text-slate-700 mt-1 italic">"{t.content}"</p>
                  <div className="mt-3 flex gap-2">
                    <button 
                      onClick={() => handleAction(t.id, "accept")}
                      className="bg-green-500 text-white px-3 py-1 rounded text-[10px] font-bold uppercase hover:bg-green-600"
                    >
                      Aceitar
                    </button>
                    <button 
                      onClick={() => handleAction(t.id, "delete")}
                      className="bg-slate-400 text-white px-3 py-1 rounded text-[10px] font-bold uppercase hover:bg-slate-500"
                    >
                      Excluir
                    </button>
                  </div>
               </div>
            </div>
          ))}
        </div>
      )}

      {/* LISTA DE DEPOIMENTOS PÚBLICOS */}
      <div className="space-y-6">
        <h3 className="text-[#004B91] font-bold text-sm border-b border-[#D4E4FA] pb-1">
          Depoimentos Aceitos
        </h3>
        {accepted.map((t: any) => (
          <div key={t.id} className="flex gap-4 pb-6 border-b border-slate-100 last:border-0">
            <div className="flex flex-col items-center gap-1 min-w-[80px]">
              <img src={t.author.image} className="w-14 h-14 rounded-full border border-[#D4E4FA] object-cover" />
              <p className="text-[10px] font-bold text-blue-600 text-center leading-tight">{t.author.name}</p>
            </div>
            <div className="flex-1 bg-[#F0F2F5] p-4 rounded-r-lg rounded-bl-lg relative">
              <div className="absolute left-[-8px] top-4 w-0 h-0 border-t-[8px] border-t-transparent border-r-[8px] border-r-[#F0F2F5] border-b-[8px] border-b-transparent"></div>
              <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">{t.content}</p>
              <p className="text-[9px] text-slate-400 mt-2 text-right">
                Enviado em {new Date(t.createdAt).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
        ))}
        {accepted.length === 0 && (
          <p className="text-sm text-slate-400 italic py-4">Nenhum depoimento público ainda.</p>
        )}
      </div>
    </div>
  );
}