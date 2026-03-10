"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { SearchUsers } from "./SearchUsers"; // Importando o componente que criamos

export function Navbar({ userName }: { userName: string }) {
  return (
    <nav className="bg-[#6D92D0] p-1 shadow-sm w-full relative z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 text-white text-sm">
        
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-black italic tracking-tighter leading-none py-1">
            orkutz
          </h1>
          
          <div className="hidden md:flex gap-4 font-normal text-[11px]">
            <Link href="/" className="hover:underline">Início</Link>
            <Link href="/perfil" className="hover:underline">Perfil</Link>
            <Link href="/amigos" className="hover:underline">Amigos</Link>
            <Link href="/comunidades" className="hover:underline">Comunidades</Link>
          </div>
        </div>

        {/* BARRA DE BUSCA CENTRALIZADA */}
        <div className="hidden lg:block flex-1 max-w-xs mx-10">
          <SearchUsers />
        </div>
        
        <div className="flex items-center gap-4 text-[11px]">
          <span className="font-bold underline decoration-blue-300">{userName}</span>
          <button 
            onClick={() => signOut()}
            className="hover:underline border-l border-blue-400 pl-4"
          >
            Sair
          </button>
        </div>
      </div>
    </nav>
  );
}