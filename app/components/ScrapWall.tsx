"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface Scrap {
  id: string;
  content: string;
  authorId: string;
  author: {
    name: string | null;
    image: string | null;
  };
  createdAt: string;
}

export function ScrapWall({ targetUserId }: { targetUserId: string }) {
  const { data: session } = useSession();
  const [scraps, setScraps] = useState<Scrap[]>([]);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Busca os recados usando a rota dinâmica corrigida
  const fetchScraps = async () => {
    if (!targetUserId) return;
    try {
      const res = await fetch(`/api/scraps/${targetUserId}`);
      const data = await res.json();
      setScraps(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar scraps:", error);
    }
  };

  useEffect(() => {
    fetchScraps();
  }, [targetUserId]);

  const sendScrap = async () => {
    if (!text.trim() || isLoading || !targetUserId) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/scraps/${targetUserId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: text }),
      });

      if (res.ok) {
        setText("");
        await fetchScraps(); // Recarrega a lista para mostrar o novo scrap com o nome correto
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Erro ao postar o recado.");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Erro de conexão com o servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteScrap = async (id: string) => {
    if (!confirm("Tem certeza que deseja apagar este recado?")) return;

    try {
      const res = await fetch(`/api/scraps/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setScraps((prev) => prev.filter((s) => s.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || "Erro ao deletar");
      }
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white p-4 rounded-lg border border-[#D4E4FA] shadow-sm">
        <textarea 
          className="w-full p-2 text-sm border border-slate-200 rounded outline-none focus:border-blue-400 h-20 resize-none text-slate-800"
          placeholder="Escreva um recado no mural..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isLoading}
        />
        <div className="flex justify-end mt-2">
          <button 
            onClick={sendScrap}
            disabled={isLoading || !text.trim()}
            className={`bg-[#EFEEF0] border border-slate-400 px-4 py-1 text-[#004B91] text-xs font-bold rounded shadow-sm hover:bg-slate-200 transition-colors ${
              (isLoading || !text.trim()) ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Postando..." : "Postar Scrap"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-[#D4E4FA] shadow-sm overflow-hidden">
        <div className="bg-[#D4E4FA] px-4 py-1 text-[#004B91] text-xs font-bold">
          Mural de Recados ({scraps.length})
        </div>
        <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
          {scraps.length === 0 ? (
            <p className="p-4 text-xs text-slate-500 text-center italic">
              Nenhum recado por aqui ainda...
            </p>
          ) : (
            scraps.map((s) => (
              <div key={s.id} className="p-4 flex gap-4 hover:bg-slate-50 transition-colors">
                <img 
                  src={s.author?.image || "https://i.imgur.com/8Q5uO5X.png"} 
                  alt={s.author?.name || "Autor"}
                  className="w-10 h-10 rounded border border-blue-200 object-cover" 
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-blue-600">
                        {s.author?.name || "Membro do OrkutZ"}
                      </p>
                      {(session?.user?.id === s.authorId || session?.user?.id === targetUserId) && (
                        <button 
                          onClick={() => deleteScrap(s.id)}
                          className="text-[10px] text-red-400 hover:text-red-600 font-bold ml-2"
                        >
                          [excluir]
                        </button>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {new Date(s.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 break-words whitespace-pre-wrap">{s.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}