import "@/styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Finanças",
  description: "Gerenciamento financeiro pessoal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`} style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
