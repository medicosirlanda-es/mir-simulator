import type { Metadata } from "next";
import { Montserrat, Merriweather } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-merriweather",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Simulador MIR - Exámenes Oficiales 2003-2024",
    template: "%s | Simulador MIR",
  },
  description:
    "Practica con los 5.057 preguntas oficiales del examen MIR (2003-2024). Simulador gratuito con corrección automática y revisión detallada.",
  openGraph: {
    type: "website",
    locale: "es_ES",
    title: "Simulador MIR - Exámenes Oficiales 2003-2024",
    description:
      "Practica con los 5.057 preguntas oficiales del examen MIR (2003-2024). Simulador gratuito con corrección automática.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-ES">
      <body
        className={`${montserrat.variable} ${merriweather.variable} font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
