"use client";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function NewAlbumPage() {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/albums", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, userId: params.id }),
    });

    if (res.ok) {
      router.push(`/perfil/${params.id}/fotos`);
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg border border-[#D4E4FA] shadow-lg w-full max-w-md">
        <h2 className="text-[#004B91] font-bold mb-4">Criar Novo Álbum</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Título do álbum (ex: Férias 2026)"
            className="border p-2 rounded text-sm outline-blue-400"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#E6DB55] py-2 rounded font-bold text-sm disabled:opacity-50"
          >
            {loading ? "Criando..." : "Criar Álbum"}
          </button>
          <button 
            type="button"
            onClick={() => router.back()}
            className="text-xs text-slate-500 hover:underline"
          >
            cancelar
          </button>
        </form>
      </div>
    </div>
  );
}