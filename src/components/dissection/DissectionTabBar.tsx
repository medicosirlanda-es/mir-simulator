"use client";

import { cn } from "@/lib/utils";
import type { DissectionTab } from "@/types/dissection";
import {
  LayoutDashboard,
  Stethoscope,
  FileText,
  Lightbulb,
  Building2,
  Code2,
  Search,
} from "lucide-react";

const TABS: { id: DissectionTab; label: string; shortLabel: string; icon: React.ElementType }[] = [
  { id: "panorama", label: "Panorama", shortLabel: "Panorama", icon: LayoutDashboard },
  { id: "especialidades", label: "Especialidades", shortLabel: "Espec.", icon: Stethoscope },
  { id: "forma", label: "Forma", shortLabel: "Forma", icon: FileText },
  { id: "cognicion", label: "Cognición", shortLabel: "Cognición", icon: Lightbulb },
  { id: "clinica", label: "Clínica", shortLabel: "Clínica", icon: Building2 },
  { id: "codigos", label: "Códigos", shortLabel: "Códigos", icon: Code2 },
  { id: "explorador", label: "Explorador", shortLabel: "Explorar", icon: Search },
];

interface DissectionTabBarProps {
  activeTab: DissectionTab;
  onTabChange: (tab: DissectionTab) => void;
}

export function DissectionTabBar({ activeTab, onTabChange }: DissectionTabBarProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <nav
        aria-label="Secciones de disección"
        className="hidden lg:block w-52 shrink-0 border-r border-border p-4 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto"
      >
        <div className="space-y-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm transition-colors duration-150 text-left",
                  isActive
                    ? "bg-primary/10 text-primary font-medium border-l-2 border-primary"
                    : "text-text-secondary hover:text-text-primary hover:bg-background"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                {tab.label}
              </button>
            );
          })}
        </div>
        <div className="mt-8 pt-4 border-t border-border">
          <p className="text-[10px] text-text-muted leading-relaxed">
            Codificación SNOMED-CT, ICD-10, ATC.
            <br />
            Fuente: Ministerio de Sanidad.
          </p>
        </div>
      </nav>

      {/* Mobile bottom bar */}
      <nav
        aria-label="Secciones de disección"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur border-t border-border flex overflow-x-auto"
      >
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              aria-current={isActive ? "true" : undefined}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 px-1 py-2.5 text-[10px] min-h-[56px] transition-colors",
                isActive
                  ? "text-primary"
                  : "text-text-muted hover:text-text-secondary"
              )}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span>{tab.shortLabel}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
