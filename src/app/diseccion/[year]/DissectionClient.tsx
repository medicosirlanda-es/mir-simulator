"use client";

import { useState, useCallback } from "react";
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
import type { DissectionTab, DissectionFilters } from "@/types/dissection";
import { Loader2 } from "lucide-react";

export function DissectionClient({ year }: { year: number }) {
  const { data, isLoading, error } = useDissectionData(year);
  const [activeTab, setActiveTab] = useState<DissectionTab>("panorama");
  const [explorerFilters, setExplorerFilters] = useState<DissectionFilters>({});

  const navigateToExplorer = useCallback((filters: DissectionFilters) => {
    setExplorerFilters(filters);
    setActiveTab("explorador");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleTabChange = useCallback((tab: DissectionTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

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
              year={year}
              totalQuestions={data.length}
              specialtyCount={specialtyCount}
            />

            {activeTab === "panorama" && (
              <PanoramaSection data={data} onNavigateToExplorer={navigateToExplorer} />
            )}
            {activeTab === "especialidades" && (
              <EspecialidadesSection data={data} onNavigateToExplorer={navigateToExplorer} />
            )}
            {activeTab === "forma" && <FormaSection data={data} />}
            {activeTab === "cognicion" && <CognicionSection data={data} />}
            {activeTab === "clinica" && <ClinicaSection data={data} />}
            {activeTab === "codigos" && <CodigosSection data={data} />}
            {activeTab === "explorador" && (
              <ExploradorSection
                data={data}
                initialFilters={explorerFilters}
                onFiltersChange={setExplorerFilters}
              />
            )}
          </Container>
        </main>
      </div>
      <Footer />
    </>
  );
}
