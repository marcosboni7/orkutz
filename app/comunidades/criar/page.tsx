"use client";
import { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/app/components/Navbar";
import Link from "next/link";

export default function CreateCommunityPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/communities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, image }),
    });

    if (res.ok) {
      router.push("/comunidades");
      router.refresh();
    } else {
      alert("Erro ao criar");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-10 text-slate-900">
      <Navbar userName="" />
      <main className="max-w-2xl mx-auto mt-10 px-4">
        <div className="bg-white p-8 rounded-lg border border-[#D4E4FA] shadow-sm">
          <h2 className="text-2xl text-[#004B91] font-light mb-6 border-b pb-4">Criar Comunidade</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <input required className="border border-[#D4E4FA] p-2 rounded text-sm" placeholder="Nome" value={name} onChange={e => setName(e.target.value)} />
            <textarea required rows={5} className="border border-[#D4E4FA] p-2 rounded text-sm resize-none" placeholder="Descrição" value={description} onChange={e => setDescription(e.target.value)} />
            <input type="file" accept="image/*" onChange={handleFileChange} className="text-xs" />
            <button type="submit" disabled={loading} className="bg-[#E6DB55] px-8 py-2 rounded text-xs font-bold uppercase disabled:opacity-50">
              {loading ? "Criando..." : "Criar Comunidade"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}