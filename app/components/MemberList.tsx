"use client";
import { useEffect, useState } from "react";
import Link from "next/link"; // Importação necessária para a navegação

interface Member {
  id: string;
  name: string;
  image?: string;
}

export function MemberList() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFriends = async () => {
    try {
      const res = await fetch("/api/friends");
      const data = await res.json();
      if (Array.isArray(data)) {
        setMembers(data);
      }
    } catch (err) {
      console.error("Erro no fetch de amigos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFriends();

    window.addEventListener("friendUpdated", loadFriends);
    
    return () => {
      window.removeEventListener("friendUpdated", loadFriends);
    };
  }, []);

  return (
    <div className="bg-white rounded-lg border border-[#D4E4FA] shadow-sm overflow-hidden">
      {/* Cabeçalho Azul Orkut */}
      <div className="bg-[#D4E4FA] px-4 py-1 flex justify-between items-center">
        <span className="text-[#004B91] text-xs font-bold">
          Meus Amigos ({members.length})
        </span>
        <a href="#" className="text-[10px] text-blue-600 underline">ver todos</a>
      </div>

      <div className="p-2 grid grid-cols-3 gap-y-4 gap-x-2">
        {loading ? (
          <p className="col-span-3 text-[10px] text-slate-400 text-center py-4 italic">
            Carregando amigos...
          </p>
        ) : members.length === 0 ? (
          <p className="col-span-3 text-[10px] text-slate-400 text-center py-8 italic px-2 leading-tight">
            Você ainda não tem amigos adicionados ou aceitos.
          </p>
        ) : (
          members.map((member) => (
            // Agora cada amigo é um Link para o perfil dinâmico
            <Link 
              key={member.id} 
              href={`/perfil/${member.id}`}
              className="flex flex-col items-center gap-1 group cursor-pointer"
            >
              {/* Moldura da Foto */}
              <div className="w-16 h-16 border border-[#A0C0F0] overflow-hidden rounded-sm bg-slate-50 p-[1px]">
                <img 
                  src={member.image || "https://i.imgur.com/8Q5uO5X.png"} 
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              {/* Nome do Amigo */}
              <span className="text-[10px] text-[#004B91] font-medium truncate w-full text-center px-1 group-hover:underline">
                {member.name?.split(" ")[0]}
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}