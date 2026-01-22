import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nexus - AI Desktop Automation",
  description: "La première plateforme web d'automatisation desktop basée sur l'IA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
