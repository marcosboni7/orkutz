import type { Metadata } from "next";
import { Providers } from "./components/Providers"; // Ajuste o caminho se necessário
import "./globals.css";

export const metadata: Metadata = {
  title: "ORKUTZ - Matando a saudade",
  description: "A rede social das comunidades está de volta.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body className="bg-slate-950 antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}