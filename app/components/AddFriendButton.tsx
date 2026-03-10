"use client";

import { useState } from "react";
import { UserPlus, Check, Loader2 } from "lucide-react";

interface AddFriendButtonProps {
  targetUserId: string;
}

export function AddFriendButton({ targetUserId }: AddFriendButtonProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleAddFriend = async () => {
    if (status === "loading" || status === "sent") return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/friends/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ targetUserId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao enviar solicitação");
      }

      setStatus("sent");
    } catch (error: any) {
      console.error("Erro ao adicionar amigo:", error.message);
      setErrorMessage(error.message);
      setStatus("error");
      
      // Volta para o estado inicial após 3 segundos se for erro
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  // Estilos base seguindo o padrão do seu projeto
  const baseClass = "text-left text-xs flex items-center gap-2 transition-all";

  if (status === "sent") {
    return (
      <div className={`${baseClass} text-green-600 font-bold`}>
        <Check size={14} />
        Solicitação enviada
      </div>
    );
  }

  return (
    <button
      onClick={handleAddFriend}
      disabled={status === "loading"}
      className={`${baseClass} ${
        status === "error" ? "text-red-500" : "text-blue-600 hover:underline"
      } disabled:opacity-70 disabled:no-underline`}
    >
      {status === "loading" ? (
        <Loader2 size={14} className="animate-spin" />
      ) : status === "error" ? (
        <span>❌</span>
      ) : (
        <span>➕</span>
      )}
      
      {status === "loading" && "Enviando..."}
      {status === "error" && (errorMessage || "Erro ao adicionar")}
      {status === "idle" && "Adicionar Amigo"}
    </button>
  );
}