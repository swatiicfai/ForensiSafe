import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ForensiSafe — Air-Gapped Evidence Vault on Vultr",
  description:
    "Protecting investigative journalists and whistleblowers from state-sponsored spyware, weaponized leak archives, and hostile tracking infrastructure.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-cyber-950 text-slate-100 min-h-screen antialiased selection:bg-cyan-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}
