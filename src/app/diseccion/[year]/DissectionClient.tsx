"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { DissectionHeader } from "@/components/dissection/DissectionHeader";
import { DissectionTabBar } from "@/components/dissection/DissectionTabBar";
import { DrillDownModal } from "@/components/dissection/DrillDownModal";
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
import type { DissectionTab, DissectionFilters, DissectionQuestion } from "@/types/dissection";
import { Loader2 } from "lucide-react";

interface DrillDownState {
  title: string;
  questions: DissectionQuestion[];
}

export function DissectionClient({ yearParam }: { yearParam: string }) {
  const router = useRouter();
  const { data, isLoading, error } = useDissectionData(yearParam);
  const [activeTab, setActiveTab] = useState<DissectionTab>("panorama");
  const [explorerFilters, setExplorerFilters] = useState<DissectionFilters>({});
  const [drillDown, setDrillDown] = useState<DrillDownState | null>(null);

  const isAll = yearParam === "all";
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

  // Drill-down: filter questions by a field+value and open modal
  const handleDrillDown = useCallback(
    (title: string, filterFn: (q: DissectionQuestion) => boolean) => {
      if (!data) return;
      const filtered = data.filter(filterFn);
      if (filtered.length > 0) {
        setDrillDown({ title, questions: filtered });
      }
    },
    [data]
  );

  // Convenience: drill-down by specialty name
  const handleSpecialtyDrillDown = useCallback(
    (specialty: string) => {
      handleDrillDown(specialty, (q) => q.specialty === specialty);
    },
    [handleDrillDown]
  );

  // Convenience: drill-down by SNOMED display name
  const handleSnomedDrillDown = useCallback(
    (display: string) => {
      handleDrillDown(`SNOMED: ${display}`, (q) =>
        Object.values(q.snomed).some((entries) =>
          entries.some((e: { code: string; display: string }) => e.display === display || e.code === display)
        )
      );
    },
    [handleDrillDown]
  );

  // Convenience: drill-down by ICD-10 code
  const handleIcd10DrillDown = useCallback(
    (code: string) => {
      handleDrillDown(`ICD-10: ${code}`, (q) => q.icd10.includes(code));
    },
    [handleDrillDown]
  );

  // Convenience: drill-down by ATC code/label
  const handleAtcDrillDown = useCallback(
    (label: string) => {
      // ATC codes in CodeBarList may have format "C07AB — Atenolol"
      const code = label.split(" — ")[0].trim();
      handleDrillDown(`ATC: ${label}`, (q) =>
        q.atc.includes(code) ||
        (q.snomed?.pharmaceuticals ?? []).some(
          (p: { code: string; display: string; atc?: string }) => p.atc === code || `${p.atc} — ${p.display}` === label
        )
      );
    },
    [handleDrillDown]
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
              <PanoramaSection
                data={data}
                yearLabel={yearLabel}
                onNavigateToExplorer={navigateToExplorer}
                onSpecialtyClick={handleSpecialtyDrillDown}
              />
            )}
            {activeTab === "especialidades" && (
              <EspecialidadesSection
                data={data}
                onNavigateToExplorer={navigateToExplorer}
                onSpecialtyClick={handleSpecialtyDrillDown}
              />
            )}
            {activeTab === "forma" && (
              <FormaSection data={data} isMultiYear={isAll} />
            )}
            {activeTab === "cognicion" && (
              <CognicionSection
                data={data}
                onSpecialtyClick={handleSpecialtyDrillDown}
              />
            )}
            {activeTab === "clinica" && (
              <ClinicaSection
                data={data}
                onSpecialtyClick={handleSpecialtyDrillDown}
              />
            )}
            {activeTab === "codigos" && (
              <CodigosSection
                data={data}
                onSnomedClick={handleSnomedDrillDown}
                onIcd10Click={handleIcd10DrillDown}
                onAtcClick={handleAtcDrillDown}
              />
            )}
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

      {/* Drill-down modal */}
      {drillDown && (
        <DrillDownModal
          title={drillDown.title}
          questions={drillDown.questions}
          onClose={() => setDrillDown(null)}
        />
      )}
    </>
  );
}
