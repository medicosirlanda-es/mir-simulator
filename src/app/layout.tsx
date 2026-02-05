import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Simulador MIR - Exámenes Oficiales 2003-2024",
    template: "%s | Simulador MIR",
  },
  description:
    "Practica con las 5.057 preguntas oficiales del examen MIR (2003-2024). Simulador gratuito con corrección automática y revisión detallada.",
  openGraph: {
    type: "website",
    locale: "es_ES",
    title: "Simulador MIR - Exámenes Oficiales 2003-2024",
    description:
      "Practica con las 5.057 preguntas oficiales del examen MIR (2003-2024). Simulador gratuito con corrección automática.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-ES">
      <body className={`${montserrat.variable} font-sans`}>
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
