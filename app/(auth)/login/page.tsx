"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) alert("Credenciais inválidas!");
    else router.push("/");
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Logotipo Clássico (Pink/Blue) */}
      <h1 className="text-6xl font-black italic tracking-tighter">
        <span className="text-[#ED008C]">orkut</span>
        <span className="text-[#004B91] text-xl ml-1">z</span>
      </h1>

      <div className="w-full max-w-[700px] grid grid-cols-1 md:grid-cols-2 bg-[#D4E4FA] p-6 rounded-lg shadow-sm gap-8 border border-[#A0C0F0]">
        
        {/* Lado Esquerdo: Mensagem de Boas-vindas */}
        <div className="flex flex-col gap-4 text-[#004B91]">
          <h2 className="text-lg font-bold">Conecte-se com seus amigos!</h2>
          <ul className="text-sm space-y-3">
            <li className="flex gap-2">
              <span className="font-bold text-pink-600">»</span> Relembre momentos com fotos e recados.
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-pink-600">»</span> Participe de comunidades incríveis.
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-pink-600">»</span> Saiba quem visitou seu perfil.
            </li>
          </ul>
          <div className="mt-4 p-4 bg-white/50 rounded border border-white">
             <p className="text-xs italic">"O Orkut ajuda você a manter contato e compartilhar momentos com as pessoas que fazem parte da sua vida."</p>
          </div>
        </div>

        {/* Lado Direito: Formulário de Login */}
        <div className="bg-white p-6 rounded border border-[#6D92D0] shadow-inner">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">E-mail:</label>
              <input
                type="email"
                className="w-full p-1 border border-slate-300 rounded text-sm outline-none focus:border-blue-500"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Senha:</label>
              <input
                type="password"
                className="w-full p-1 border border-slate-300 rounded text-sm outline-none focus:border-blue-500"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <button className="w-full py-1 bg-[#EFEEF0] hover:bg-slate-200 border border-slate-400 text-[#004B91] text-xs font-bold rounded shadow-sm">
              Login
            </button>

            <div className="text-center pt-4 border-t border-slate-100">
              <p className="text-[10px] text-slate-500 mb-2">Ainda não é membro?</p>
              <Link 
                href="/register" 
                className="text-blue-600 text-xs font-bold hover:underline"
              >
                CRIAR UMA CONTA AGORA
              </Link>
            </div>
          </form>
        </div>
      </div>

      <footer className="text-[10px] text-slate-500 uppercase tracking-widest">
        Sobre o Orkutz - Privacidade - Termos
      </footer>
    </div>
  );
}