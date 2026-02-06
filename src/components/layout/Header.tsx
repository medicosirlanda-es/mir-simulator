"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { BookOpen } from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Exámenes" },
  { href: "/practicar", label: "Practicar" },
  { href: "/diseccion/2024", label: "Disección" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-primary-dark to-primary text-text-inverted shadow-md">
      <Container className="flex h-16 items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-bold text-lg hover:opacity-90 transition-opacity"
          aria-label="Simulador MIR - Inicio"
        >
          <BookOpen className="h-6 w-6" aria-hidden="true" />
          <span>{APP_NAME}</span>
        </Link>
        <nav aria-label="Navegación principal" className="flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-white/20 text-white"
                    : "text-white/75 hover:bg-white/10 hover:text-white"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </Container>
    </header>
  );
}
