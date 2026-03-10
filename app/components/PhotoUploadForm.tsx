"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Camera } from "lucide-react";

export function PhotoUploadForm({ albumId, profileId }: { albumId: string, profileId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);

    // Converte a imagem para Base64 para salvar no banco (simples para teste)
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result as string;

      const res = await fetch("/api/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          url: base64Image, 
          albumId, 
          profileId 
        }),
      });

      if (res.ok) {
        router.refresh();
      } else {
        alert("Erro ao subir imagem. Talvez o arquivo seja muito grande.");
      }
      setLoading(false);
    };
  };

  return (
    <div className="flex items-center gap-4">
      <label className="cursor-pointer bg-[#E6DB55] hover:bg-[#d4c944] px-4 py-2 rounded-sm text-[11px] font-bold uppercase flex items-center gap-2 transition-colors">
        <Camera size={14} />
        {loading ? "Subindo..." : "Anexar Foto"}
        <input 
          type="file" 
          className="hidden" 
          accept="image/*"
          onChange={handleFileChange}
          disabled={loading}
        />
      </label>
      <p className="text-[10px] text-yellow-800 italic">
        Formatos aceitos: JPG, PNG. Máx: 2MB.
      </p>
    </div>
  );
}