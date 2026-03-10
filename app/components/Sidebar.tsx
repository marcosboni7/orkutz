"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { useSession } from "next-auth/react"; // 1. Importação necessária
import { Star, ThumbsUp, ShieldCheck } from "lucide-react";

interface SidebarProps {
  user: any;
  scrapCount: number;
  albumCount?: number;
  testimonialCount?: number;
}

export function Sidebar({ 
  user, 
  scrapCount, 
  albumCount = 0, 
  testimonialCount = 0 
}: SidebarProps) {
  const { update } = useSession(); // 2. Hook para atualizar a sessão
  const [isUpdating, setIsUpdating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("A imagem deve ter no máximo 5MB");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result as string;
      await uploadPhoto(base64Image);
    };
  };

  const uploadPhoto = async (imageUrl: string) => {
    setIsUpdating(true);
    try {
      const res = await fetch("/api/users/update-image", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl }),
      });

      if (res.ok) {
        // 3. Força o NextAuth a atualizar os dados do usuário localmente
        await update(); 
        // 4. Recarrega a página para garantir que o objeto 'user' venha novo do servidor
        window.location.reload();
      } else {
        const errorData = await res.json();
        alert(`Erro: ${errorData.error || "Erro ao atualizar a foto."}`);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Erro de conexão ao tentar subir a foto.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <aside className="w-52 flex flex-col gap-3">
      {/* Box da Foto */}
      <div className="bg-[#D4E4FA] p-2 rounded-lg border border-[#A0C0F0]">
        <div className="relative aspect-square w-full rounded border border-[#6D92D0] overflow-hidden bg-white">
          {/* 5. Usamos <img> padrão para evitar bugs de cache/config do Next/Image com Base64 */}
          <img 
            src={user?.image || "https://i.imgur.com/8Q5uO5X.png"} 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="mt-1 text-center">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*"
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUpdating}
            className="text-[10px] text-blue-600 underline hover:text-blue-800 disabled:opacity-50"
          >
            {isUpdating ? "Enviando..." : "[editar foto]"}
          </button>
        </div>

        <div className="mt-2 text-center">
          <p className="text-[#004B91] font-bold text-sm truncate">{user?.name}</p>
          <p className="text-slate-500 text-[10px]">Brasil</p>
        </div>
      </div>

      {/* Selos de Atributos */}
      <div className="bg-[#D4E4FA] p-2 rounded-lg border border-[#A0C0F0] flex justify-around items-center">
        <div className="flex flex-col items-center" title="Confiável">
          <ShieldCheck size={16} className="text-blue-600" />
        </div>
        <div className="flex flex-col items-center" title="Legal">
          <ThumbsUp size={16} className="text-pink-600" />
        </div>
        <div className="flex flex-col items-center" title="Sexy/Sorte">
          <Star size={16} className="text-yellow-600" />
        </div>
      </div>

      {/* Menu do Perfil */}
      <nav className="bg-[#D4E4FA] rounded-lg border border-[#A0C0F0] overflow-hidden text-xs">
        <ul className="text-[#004B91]">
          <li>
            <Link href={`/perfil/${user?.id}`} className="p-2 border-b border-white hover:bg-white/50 flex w-full">
              Perfil
            </Link>
          </li>
          <li>
            <Link 
              href={`/perfil/${user?.id}`} 
              className="p-2 border-b border-white hover:bg-white/50 flex justify-between font-bold text-[#ed008c] w-full"
            >
              Recados <span>({scrapCount})</span>
            </Link>
          </li>
          <li>
            <Link 
              href={`/perfil/${user?.id}/fotos`} 
              className="p-2 border-b border-white hover:bg-white/50 flex justify-between w-full"
            >
              Fotos <span>({albumCount})</span>
            </Link>
          </li>
          <li>
            <Link 
              href={`/perfil/${user?.id}/depoimentos`} 
              className="p-2 border-b border-white hover:bg-white/50 flex justify-between w-full"
            >
              <span>Depoimentos</span> 
              <span className={testimonialCount > 0 ? "font-bold text-[#ed008c]" : ""}>
                ({testimonialCount})
              </span>
            </Link>
          </li>
          <li className="p-2 hover:bg-white/50 cursor-pointer text-slate-500">
            Configurações
          </li>
        </ul>
      </nav>
    </aside>
  );
}