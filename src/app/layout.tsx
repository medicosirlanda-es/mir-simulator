import type { Metadata } from "next";
import { Figtree, Noto_Sans } from "next/font/google";
import "./globals.css";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
});

const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Simulador MIR - Exámenes Oficiales 2003-2025",
    template: "%s | Simulador MIR",
  },
  description:
    "Practica con las 5.267 preguntas oficiales del examen MIR (2003-2025). Simulador gratuito con corrección automática y revisión detallada.",
  openGraph: {
    type: "website",
    locale: "es_ES",
    title: "Simulador MIR - Exámenes Oficiales 2003-2025",
    description:
      "Practica con las 5.267 preguntas oficiales del examen MIR (2003-2025). Simulador gratuito con corrección automática.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-ES" className="light">
      <body className={`${figtree.variable} ${notoSans.variable} font-sans`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-white focus:shadow-lg"
        >
          Saltar al contenido principal
        </a>
        {children}
      </body>
    </html>
  );
}
