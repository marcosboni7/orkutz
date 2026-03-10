"use client";
import { useEffect, useState } from "react";
import { Clover } from "lucide-react";

const luckPhrases = [
  "A sorte favorece os audazes.",
  "Sua criatividade o levará a novos caminhos hoje.",
  "O OrkutZ diz: Adicione alguém novo hoje!",
  "A paciência é a chave para todas as portas.",
  "Grandes coisas estão por vir, só add se for aceitar.",
  "Siga sua intuição, ela raramente erra.",
  "Hoje é um bom dia para enviar um scrap de bom dia.",
  "O sucesso está a um clique de distância.",
  "Cuidado com o que você posta, o Google está de olho (brincadeira!).",
  "Sua felicidade depende apenas de você.",
  "Um amigo antigo entrará em contato em breve.",
  "A vida é curta, mude seu status do Orkut hoje."
];

export function DailyLuck() {
  const [luck, setLuck] = useState("");

  useEffect(() => {
    // Sorteia uma frase da lista
    const randomIndex = Math.floor(Math.random() * luckPhrases.length);
    setLuck(luckPhrases[randomIndex]);
  }, []);

  return (
    <div className="bg-[#FFFFE1] border border-[#F5E6A3] p-3 rounded-lg shadow-sm flex items-start gap-3">
      <div className="bg-[#F5E6A3] p-1.5 rounded-full text-green-700">
        <Clover size={16} />
      </div>
      <div>
        <h4 className="text-[10px] font-bold text-[#666] uppercase tracking-wider mb-0.5">
          Sorte do Dia
        </h4>
        <p className="text-[13px] text-slate-700 leading-tight italic">
          "{luck}"
        </p>
      </div>
    </div>
  );
}