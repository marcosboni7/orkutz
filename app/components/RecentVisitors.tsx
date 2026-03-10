"use client";
import { useEffect, useState } from "react";

export function RecentVisitors() {
  const [visitors, setVisitors] = useState([]);

  useEffect(() => {
    fetch("/api/visits")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // Filtrar para mostrar apenas a visita mais recente de cada pessoa (opcional)
          const uniqueVisitors = data.filter((v, index, self) =>
            index === self.findIndex((t) => t.visitorId === v.visitorId)
          ).slice(0, 5);
          setVisitors(uniqueVisitors);
        }
      });
  }, []);

  if (visitors.length === 0) return null;

  return (
    <div className="bg-white rounded-lg border border-[#D4E4FA] shadow-sm overflow-hidden">
      <div className="bg-[#D4E4FA] px-3 py-1 text-[#004B91] text-[11px] font-bold">
        Visitantes recentes
      </div>
      <div className="p-2 flex flex-wrap gap-2 justify-center">
        {visitors.map((v: any) => (
          <div key={v.id} title={`${v.visitorName} visitou em ${new Date(v.visitedAt).toLocaleDateString()}`} className="flex flex-col items-center">
            <img 
              src={v.visitorImg || "https://i.imgur.com/8Q5uO5X.png"} 
              className="w-10 h-10 border border-[#A0C0F0] rounded-sm object-cover"
            />
            <span className="text-[9px] text-[#004B91] w-10 truncate text-center font-medium">
              {v.visitorName.split(" ")[0]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}