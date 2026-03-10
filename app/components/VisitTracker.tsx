"use client";
import { useEffect } from "react";

export function VisitTracker({ profileId }: { profileId: string }) {
  useEffect(() => {
    // Registra a visita ao montar o componente
    fetch("/api/visits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profileId }),
    }).catch(err => console.error("Erro ao registrar visita", err));
  }, [profileId]);

  return null; // Não renderiza nada na tela
}