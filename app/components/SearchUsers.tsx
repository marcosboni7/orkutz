"use client";
import { useState, useEffect } from "react";
import { Search, UserPlus } from "lucide-react";

export function SearchUsers() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.length >= 2) {
        fetch(`/api/users/search?q=${query}`)
          .then((res) => res.json())
          .then((data) => setResults(data));
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const addFriend = async (receiverId: string) => {
    try {
      const res = await fetch("/api/friends", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Mudamos de friendId para receiverId para casar com o Schema novo
        body: JSON.stringify({ receiverId }),
      });

      if (res.ok) {
        alert("Solicitação enviada! Agora a pessoa precisa aceitar no OrkutZ dela.");
        setQuery("");
        setResults([]);
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Erro ao enviar solicitação.");
      }
    } catch (error) {
      console.error("Erro ao adicionar amigo:", error);
      alert("Erro de conexão.");
    }
  };

  return (
    <div className="relative w-full max-w-xs">
      <div className="flex items-center bg-white border border-[#A0C0F0] rounded-full px-3 py-1 shadow-sm">
        <Search size={14} className="text-slate-400 mr-2" />
        <input
          type="text"
          placeholder="Pesquisar pessoas..."
          className="bg-transparent outline-none text-[11px] w-full text-slate-700"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Dropdown de Resultados */}
      {results.length > 0 && (
        <div className="absolute top-10 left-0 w-full bg-white border border-[#A0C0F0] rounded-lg shadow-lg z-[100] overflow-hidden">
          {results.map((user: any) => (
            <div key={user.id} className="flex items-center justify-between p-2 hover:bg-[#F0F7FF] border-b border-slate-50 last:border-0">
              <div className="flex items-center gap-2">
                <img 
                  src={user.image || "https://i.imgur.com/8Q5uO5X.png"} 
                  className="w-7 h-7 rounded-full border border-blue-100 object-cover" 
                  alt={user.name}
                />
                <span className="text-[11px] font-medium text-[#004B91]">{user.name}</span>
              </div>
              <button 
                onClick={() => addFriend(user.id)}
                className="p-1.5 hover:bg-blue-100 rounded-full text-blue-600 transition-colors"
                title="Adicionar amigo"
              >
                <UserPlus size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}