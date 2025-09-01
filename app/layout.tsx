import "./globals.css";
import "../styles/tokens.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "@/src/providers/Providers";
import Sidebar from "@/components/Shared/Sidebar";
import Topbar from "@/components/Shared/Topbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Calm Scholar",
  description: "Vocabulary + Zettelkasten PWA"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full antialiased`}>
        <Providers>
          <div className="min-h-screen grid grid-rows-[auto_1fr]">
            <Topbar />
            <div className="grid grid-cols-1 md:grid-cols-[280px_1fr]">
              <Sidebar />
              <main className="p-4 md:p-8">{children}</main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
