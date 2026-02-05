import { PracticeClient } from "./PracticeClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Modo Práctica",
  description: "Practica con preguntas MIR aleatorias con respuesta inmediata.",
};

export default function PracticePage() {
  return <PracticeClient />;
}
