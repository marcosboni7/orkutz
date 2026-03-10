"use client";
import { useState, useEffect } from "react";

export function StatusField({ initialStatus }: { initialStatus: string }) {
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState(initialStatus);

  // Sincroniza o estado quando o componente recebe um novo valor do servidor
  useEffect(() => {
    setStatus(initialStatus);
  }, [initialStatus]);

  const handleSave = async () => {
    // Se o valor não mudou, nem faz a requisição
    if (status === initialStatus) {
      setIsEditing(false);
      return;
    }

    setIsEditing(false);
    
    try {
      // AJUSTADO: Agora aponta para /api/users/status (conforme sua pasta)
      const response = await fetch("/api/users/status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erro da API:", errorData.error);
        throw new Error(errorData.error || "Erro ao salvar");
      }
      
      console.log("Status atualizado com sucesso no banco!");
    } catch (error) {
      console.error("Erro ao salvar status:", error);
      // Volta o texto original em caso de falha (ex: banco resetado)
      setStatus(initialStatus);
    }
  };

  return (
    <div className="flex items-center gap-2 text-xs min-h-[20px]">
      <span className="font-bold text-[#ED008C] whitespace-nowrap uppercase tracking-tighter">
        Sorte de hoje:
      </span>
      
      {isEditing ? (
        <input 
          autoFocus
          className="border border-blue-300 px-1 outline-none text-slate-700 w-full bg-[#FFFDE7] shadow-inner"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
        />
      ) : (
        <span 
          className="italic text-slate-500 cursor-pointer hover:bg-[#F0F7FF] hover:text-[#004B91] transition-all rounded px-1 w-full overflow-hidden text-ellipsis"
          onClick={() => setIsEditing(true)}
          title="Clique para editar seu status"
        >
          "{status || "Clique aqui para definir sua sorte..."}"
        </span>
      )}
    </div>
  );
}