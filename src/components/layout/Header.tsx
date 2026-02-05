"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { BookOpen } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-primary text-text-inverted shadow-md">
      <Container className="flex h-16 items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-bold text-lg hover:opacity-90 transition-opacity"
        >
          <BookOpen className="h-6 w-6" />
          <span>{APP_NAME}</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm font-medium opacity-80 hover:opacity-100 transition-opacity"
          >
            Exámenes
          </Link>
          <Link
            href="/practicar"
            className="text-sm font-medium opacity-80 hover:opacity-100 transition-opacity"
          >
            Practicar
          </Link>
        </nav>
      </Container>
    </header>
  );
}
