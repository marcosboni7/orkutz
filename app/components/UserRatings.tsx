"use client";
import { useState } from "react";
import { Smile, Heart, Snowflake } from "lucide-react";

interface UserRatingsProps {
  trusty: number;
  cool: number;
  sexy: number;
  targetUserId?: string; // ID de quem está recebendo o voto
  isReadOnly?: boolean;  // Se for o próprio perfil, desabilita o clique
}

export function UserRatings({ 
  trusty = 0, 
  cool = 0, 
  sexy = 0, 
  targetUserId, 
  isReadOnly = false 
}: UserRatingsProps) {
  // Estado local para refletir as mudanças instantaneamente
  const [currentRatings, setCurrentRatings] = useState({ trusty, cool, sexy });

  const handleRate = async (type: "trusty" | "cool" | "sexy") => {
    // Bloqueia se for o próprio perfil ou se não houver ID alvo
    if (isReadOnly || !targetUserId) return;

    // --- LÓGICA OTIMISTA ---
    // 1. Salva o valor antigo para caso precise voltar atrás (erro)
    const previousValue = currentRatings[type];

    // 2. Atualiza a tela NA HORA
    setCurrentRatings((prev) => ({
      ...prev,
      [type]: prev[type] + 1,
    }));

    try {
      const res = await fetch(`/api/users/${targetUserId}/rate`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });

      if (!res.ok) {
        // Se a API falhar, voltamos o valor original (Rollback)
        const err = await res.json();
        console.error(err.error || "Erro ao votar");
        setCurrentRatings((prev) => ({ ...prev, [type]: previousValue }));
      }
      // Se deu certo, a tela já está atualizada, não precisa fazer mais nada!
      
    } catch (error) {
      console.error("Erro de conexão ao votar");
      // Rollback em caso de erro de rede
      setCurrentRatings((prev) => ({ ...prev, [type]: previousValue }));
    }
  };

  // Lógica para repetir os ícones até 3 vezes (estilo Orkut)
  const renderIcons = (count: number, Icon: any, colorClass: string, type: "trusty" | "cool" | "sexy") => {
    // Aumenta o brilho dos ícones: 0-9 votos (1 ícone), 10-19 (2 ícones), 20+ (3 ícones)
    const level = Math.min(Math.floor(count / 10) + 1, 3);
    
    return (
      <div 
        className={`flex items-center gap-1 p-1 rounded transition-all ${
          !isReadOnly 
            ? "cursor-pointer hover:bg-slate-50 active:scale-125" 
            : ""
        }`}
        onClick={() => handleRate(type)}
        title={!isReadOnly ? `Votar como ${type}` : ""}
      >
        {[...Array(3)].map((_, i) => (
          <Icon 
            key={i} 
            size={16} 
            className={`${
              i < level ? colorClass : "text-slate-200"
            } transition-colors duration-150`} 
            fill={i < level ? "currentColor" : "none"}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-2 mt-4 border-t border-slate-100 pt-4 w-full max-w-[200px]">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">Confiável:</span>
        {renderIcons(currentRatings.trusty, Snowflake, "text-blue-400", "trusty")}
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">Legal:</span>
        {renderIcons(currentRatings.cool, Smile, "text-yellow-500", "cool")}
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">Sexy:</span>
        {renderIcons(currentRatings.sexy, Heart, "text-red-500", "sexy")}
      </div>
      
      {!isReadOnly && (
        <p className="text-[9px] text-slate-400 italic mt-1 text-center animate-pulse">
          Clique nos selinhos para votar!
        </p>
      )}
    </div>
  );
}