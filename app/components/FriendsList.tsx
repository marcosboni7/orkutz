"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export function FriendsList({ userId }: { userId: string }) {
  const [friends, setFriends] = useState([]);
  const [total, setTotal] = useState(0);

  const loadFriends = async () => {
    try {
      const res = await fetch(`/api/friends?userId=${userId}&status=accepted`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setFriends(data.slice(0, 9)); // Pega só os primeiros 9 para a grade
        setTotal(data.length);
      }
    } catch (err) {
      console.error("Erro ao carregar amigos:", err);
    }
  };

  useEffect(() => {
    loadFriends();
    // Ouve o evento global para atualizar a lista
    window.addEventListener("friendUpdated", loadFriends);
    return () => window.removeEventListener("friendUpdated", loadFriends);
  }, [userId]);

  return (
    <div className="bg-white p-3 rounded-lg border border-[#D4E4FA] shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-[#004B91] text-[11px] font-bold uppercase tracking-wider">
          Meus Amigos ({total})
        </h3>
        <Link href={`/perfil/${userId}/amigos`} className="text-[10px] text-blue-600 hover:underline">
          ver todos
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {friends.map((friend: any) => {
          // DEFESA: Verifica se o amigo é o que enviou ou o que recebeu o convite
          const friendData = friend.senderId === userId ? friend.receiver : friend.sender;
          
          // Se friendData não existir (erro de include na API), não renderiza esse item
          if (!friendData || !friendData.id) return null;
          
          return (
            <Link 
              key={friend.id} 
              href={`/perfil/${friendData.id}`}
              className="flex flex-col items-center group"
            >
              <img 
                src={friendData.image || "https://i.imgur.com/8Q5uO5X.png"} 
                className="w-[58px] h-[58px] border border-[#D4E4FA] object-cover group-hover:border-blue-400 transition-colors"
                alt={friendData.name || "Amigo"}
              />
              <span className="text-[10px] text-blue-600 truncate w-full text-center mt-1 group-hover:underline">
                {friendData.name ? friendData.name.split(" ")[0] : "Usuário"}
              </span>
            </Link>
          );
        })}
      </div>

      {total === 0 && (
        <p className="text-[10px] text-slate-400 text-center py-4 italic">
          Nenhum amigo ainda.
        </p>
      )}
    </div>
  );
}