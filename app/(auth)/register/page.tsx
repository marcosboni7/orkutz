"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      alert("Conta criada com sucesso! Agora é só fazer o login.");
      router.push("/login");
    } else {
      alert("Erro ao cadastrar. Verifique os dados ou tente outro e-mail.");
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Logotipo Clássico */}
      <h1 className="text-6xl font-black italic tracking-tighter">
        <span className="text-[#ED008C]">orkut</span>
        <span className="text-[#004B91] text-xl ml-1">z</span>
      </h1>

      <div className="w-full max-w-[750px] grid grid-cols-1 md:grid-cols-2 bg-[#D4E4FA] p-6 rounded-lg shadow-sm gap-8 border border-[#A0C0F0]">
        
        {/* Lado Esquerdo: Texto de Chamada */}
        <div className="flex flex-col gap-4 text-[#004B91]">
          <h2 className="text-xl font-bold">Cadastre-se já!</h2>
          <p className="text-sm leading-relaxed">
            Crie seu perfil, adicione seus amigos, envie recados e participe de comunidades.
          </p>
          
          <div className="space-y-4 mt-2">
            <div className="flex items-start gap-3">
              <div className="bg-white p-2 rounded shadow-sm">
                <span className="text-lg">📸</span>
              </div>
              <p className="text-xs">Compartilhe suas fotos com quem você gosta.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-white p-2 rounded shadow-sm">
                <span className="text-lg">💬</span>
              </div>
              <p className="text-xs">O mural de recados (scraps) mais famoso da web.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-white p-2 rounded shadow-sm">
                <span className="text-lg">⭐</span>
              </div>
              <p className="text-xs">Ganhe selos de sorte, legal e confiável!</p>
            </div>
          </div>
        </div>

        {/* Lado Direito: Formulário de Cadastro */}
        <div className="bg-white p-6 rounded border border-[#6D92D0] shadow-inner">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Nome completo:</label>
              <input
                type="text"
                placeholder="Como seus amigos te conhecem"
                className="w-full p-1.5 border border-slate-300 rounded text-sm outline-none focus:border-blue-500 transition-all"
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">E-mail:</label>
              <input
                type="email"
                className="w-full p-1.5 border border-slate-300 rounded text-sm outline-none focus:border-blue-500 transition-all"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Senha:</label>
              <input
                type="password"
                className="w-full p-1.5 border border-slate-300 rounded text-sm outline-none focus:border-blue-500 transition-all"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            
            <button className="w-full py-2 mt-2 bg-[#EFEEF0] hover:bg-slate-200 border border-slate-400 text-[#004B91] text-xs font-bold rounded shadow-sm uppercase">
              Finalizar cadastro
            </button>

            <div className="text-center pt-4 border-t border-slate-100">
              <Link 
                href="/login" 
                className="text-blue-600 text-xs font-bold hover:underline"
              >
                JÁ SOU MEMBRO, QUERO LOGAR
              </Link>
            </div>
          </form>
        </div>
      </div>

      <footer className="text-[10px] text-slate-400 uppercase tracking-widest text-center max-w-sm">
        Ao clicar em finalizar, você concorda em ser 100% legal, confiável e sexy.
      </footer>
    </div>
  );
}