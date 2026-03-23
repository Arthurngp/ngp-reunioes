import type { Metadata } from "next";
import { Geist } from "next/font/google";
import NavBar from "@/components/NavBar";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NGP — Reunião Semanal",
  description: "Sistema de acompanhamento semanal NGP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={geist.variable}>
      <body>
        <NavBar />
        <main style={{ maxWidth: 900, margin: '0 auto', padding: '28px 20px 60px' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
