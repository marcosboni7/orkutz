"use client";
import { useEffect, useState } from "react";

export function FriendRequests() {
  const [requests, setRequests] = useState([]);

  const loadRequests = async () => {
    try {
      // Chamada para a API buscando apenas os pendentes
      const res = await fetch("/api/friends?status=pending");
      const data = await res.json();
      if (Array.isArray(data)) {
        setRequests(data);
      }
    } catch (err) {
      console.error("Erro ao carregar solicitações:", err);
    }
  };

  useEffect(() => {
    loadRequests();
    
    // Polling de 30 segundos para checar novos amigos sem precisar de F5
    const interval = setInterval(loadRequests, 30000);

    // Ouvir eventos globais caso você queira atualizar a lista manualmente de outro lugar
    window.addEventListener("refreshFriendRequests", loadRequests);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener("refreshFriendRequests", loadRequests);
    };
  }, []);

  const handleAction = async (friendshipId: string, action: 'accept' | 'decline') => {
    // Definimos o método: PATCH para aceitar, DELETE para recusar
    const method = action === 'accept' ? 'PATCH' : 'DELETE';
    
    try {
      const res = await fetch("/api/friends", {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ friendshipId })
      });

      if (res.ok) {
        // Remove da lista local imediatamente para dar feedback rápido
        setRequests((prev) => prev.filter((req: any) => req.id !== friendshipId));
        
        // Dispara o evento para o MemberList (sidebar) atualizar a lista de amigos aceitos
        window.dispatchEvent(new Event("friendUpdated"));
        
        if (action === 'accept') {
          console.log("Amizade aceita com sucesso!");
        }
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Erro ao processar ação");
      }
    } catch (err) {
      console.error("Erro na requisição de amizade:", err);
    }
  };

  // Se não houver pedidos, o componente fica invisível (não ocupa espaço na Home)
  if (requests.length === 0) return null;

  return (
    <div className="bg-[#FFF8D7] border border-[#E6DB55] p-3 mb-4 rounded-sm shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
      <h3 className="text-[#666] text-[11px] font-bold mb-2 flex items-center gap-2">
        <span className="bg-[#E6DB55] text-white px-1.5 rounded-full text-[10px]">!</span>
        Solicitações de amizade pendentes:
      </h3>
      
      <div className="space-y-2">
        {requests.map((req: any) => (
          <div 
            key={req.id} 
            className="flex items-center justify-between bg-white/50 p-2 border border-[#F3E8AC] rounded-sm hover:bg-white/80 transition-colors"
          >
            <div className="flex items-center gap-2">
              <img 
                src={req.sender?.image || "https://i.imgur.com/8Q5uO5X.png"} 
                className="w-8 h-8 rounded-sm border border-[#E6DB55] object-cover"
                alt={req.sender?.name}
              />
              <div className="flex flex-col">
                <span className="text-[11px] text-slate-700 leading-tight">
                  <span className="font-bold text-blue-700 hover:underline cursor-pointer">
                    {req.sender?.name}
                  </span>
                </span>
                <span className="text-[9px] text-slate-500 uppercase">quer ser seu amigo</span>
              </div>
            </div>
            
            <div className="flex gap-2 items-center">
              <button 
                onClick={() => handleAction(req.id, 'accept')}
                className="text-[10px] bg-[#E6DB55] hover:bg-[#d4c944] text-[#444] px-3 py-1 rounded-sm font-bold transition-all active:scale-95 shadow-sm"
              >
                aceitar
              </button>
              <button 
                onClick={() => handleAction(req.id, 'decline')}
                className="text-[10px] hover:underline text-red-500 px-1 font-medium"
              >
                não
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}