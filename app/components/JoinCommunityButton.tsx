"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface JoinCommunityButtonProps {
  communityId: string;
  isMember: boolean;
}

export function JoinCommunityButton({ communityId, isMember: initialIsMember }: JoinCommunityButtonProps) {
  const [isMember, setIsMember] = useState(initialIsMember);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleJoinLeave = async () => {
    setLoading(true);
    const method = isMember ? "DELETE" : "POST";

    const res = await fetch(`/api/communities/${communityId}/join`, {
      method,
    });

    if (res.ok) {
      setIsMember(!isMember);
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleJoinLeave}
      disabled={loading}
      className={`px-4 py-1 rounded text-xs font-bold uppercase transition ${
        isMember 
          ? "bg-slate-200 text-slate-600 hover:bg-red-100 hover:text-red-600" 
          : "bg-[#E6DB55] text-black hover:bg-[#d4c944]"
      }`}
    >
      {loading ? "Processando..." : isMember ? "Sair da Comunidade" : "Participar"}
    </button>
  );
}