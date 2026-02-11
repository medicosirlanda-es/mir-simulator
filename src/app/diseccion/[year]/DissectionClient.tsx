"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { DissectionHeader } from "@/components/dissection/DissectionHeader";
import { DissectionTabBar } from "@/components/dissection/DissectionTabBar";
import { PanoramaSection } from "@/components/dissection/sections/PanoramaSection";
import { EspecialidadesSection } from "@/components/dissection/sections/EspecialidadesSection";
import { FormaSection } from "@/components/dissection/sections/FormaSection";
import { CognicionSection } from "@/components/dissection/sections/CognicionSection";
import { ClinicaSection } from "@/components/dissection/sections/ClinicaSection";
import { CodigosSection } from "@/components/dissection/sections/CodigosSection";
import { ExploradorSection } from "@/components/dissection/sections/ExploradorSection";
import { useDissectionData } from "@/hooks/useDissectionData";
import { DISSECTION_YEARS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { DissectionTab, DissectionFilters } from "@/types/dissection";
import { Loader2 } from "lucide-react";

export function DissectionClient({ yearParam }: { yearParam: string }) {
  const router = useRouter();
  const { data, isLoading, error } = useDissectionData(yearParam);
  const [activeTab, setActiveTab] = useState<DissectionTab>("panorama");
  const [explorerFilters, setExplorerFilters] = useState<DissectionFilters>({});

  const isAll = yearParam === "all";
  const yearNum = isAll ? null : parseInt(yearParam, 10);
  const yearLabel = isAll ? "2020–2024" : yearParam;

  const navigateToExplorer = useCallback((filters: DissectionFilters) => {
    setExplorerFilters(filters);
    setActiveTab("explorador");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleTabChange = useCallback((tab: DissectionTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleYearChange = useCallback(
    (year: string) => {
      router.push(`/diseccion/${year}`);
    },
    [router]
  );

  if (isLoading) {
    return (
      <>
        <Header />
        <main id="main-content" className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
            <p className="mt-3 text-text-secondary text-sm">Cargando disección...</p>
          </div>
        </main>
      </>
    );
  }

  if (error || !data) {
    return (
      <>
        <Header />
        <main id="main-content" className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-error font-semibold">Error al cargar datos</p>
            <p className="mt-1 text-text-secondary text-sm">{error}</p>
          </div>
        </main>
      </>
    );
  }

  const specialtyCount = new Set(data.map((q) => q.specialty)).size;

  return (
    <>
      <Header />
      <div className="flex min-h-screen">
        <DissectionTabBar activeTab={activeTab} onTabChange={handleTabChange} />
        <main id="main-content" className="flex-1 min-w-0 pb-20 lg:pb-0">
          <Container className="py-6">
            <DissectionHeader
              yearLabel={yearLabel}
              totalQuestions={data.length}
              specialtyCount={specialtyCount}
            />

            {/* Year pills */}
            <div className="flex flex-wrap gap-1.5 mb-6">
              <button
                onClick={() => handleYearChange("all")}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium transition-colors border",
                  isAll
                    ? "bg-primary/15 text-primary border-primary/30"
                    : "text-text-muted hover:bg-background border-transparent hover:border-border"
                )}
              >
                Todos (2020–2024)
              </button>
              {DISSECTION_YEARS.map((y) => (
                <button
                  key={y}
                  onClick={() => handleYearChange(String(y))}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium transition-colors border",
                    yearParam === String(y)
                      ? "bg-primary/15 text-primary border-primary/30"
                      : "text-text-muted hover:bg-background border-transparent hover:border-border"
                  )}
                >
                  {y}
                </button>
              ))}
            </div>

            {activeTab === "panorama" && (
              <PanoramaSection data={data} yearLabel={yearLabel} onNavigateToExplorer={navigateToExplorer} />
            )}
            {activeTab === "especialidades" && (
              <EspecialidadesSection data={data} onNavigateToExplorer={navigateToExplorer} />
            )}
            {activeTab === "forma" && <FormaSection data={data} isMultiYear={isAll} />}
            {activeTab === "cognicion" && <CognicionSection data={data} />}
            {activeTab === "clinica" && <ClinicaSection data={data} />}
            {activeTab === "codigos" && <CodigosSection data={data} />}
            {activeTab === "explorador" && (
              <ExploradorSection
                data={data}
                initialFilters={explorerFilters}
                onFiltersChange={setExplorerFilters}
                isMultiYear={isAll}
              />
            )}
          </Container>
        </main>
      </div>
      <Footer />
    </>
  );
}
