"use client";

import { useState, useEffect } from "react";
import { Check, Flag, X, Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { ReviewStatus } from "@/types/review";
import { cn } from "@/lib/utils";

interface ValidationPanelProps {
  year: number;
  number: number;
  currentStatus: ReviewStatus | null;
  currentNotes: string;
  onSetReview: (status: ReviewStatus, notes: string) => void;
  onClearReview: () => void;
  onExport: () => void;
  onImport: (file: File) => void;
}

const STATUS_CONFIG: Record<ReviewStatus, { label: string; icon: typeof Check; style: string; activeStyle: string }> = {
  approved: {
    label: "Aprobar",
    icon: Check,
    style: "hover:bg-success/10 hover:text-success-dark hover:border-success/30",
    activeStyle: "bg-success/15 text-success-dark border-success/40",
  },
  flagged: {
    label: "Flag",
    icon: Flag,
    style: "hover:bg-warning/10 hover:text-warning-dark hover:border-warning/30",
    activeStyle: "bg-warning/15 text-warning-dark border-warning/40",
  },
  rejected: {
    label: "Rechazar",
    icon: X,
    style: "hover:bg-error/10 hover:text-error-dark hover:border-error/30",
    activeStyle: "bg-error/15 text-error-dark border-error/40",
  },
};

export function ValidationPanel({
  year,
  number,
  currentStatus,
  currentNotes,
  onSetReview,
  onClearReview,
  onExport,
  onImport,
}: ValidationPanelProps) {
  const [notes, setNotes] = useState(currentNotes);

  // Sync notes when question changes
  useEffect(() => {
    setNotes(currentNotes);
  }, [currentNotes, year, number]);

  // Autosave notes on change (debounced)
  useEffect(() => {
    if (notes === currentNotes) return;
    const timer = setTimeout(() => {
      if (currentStatus && notes !== currentNotes) {
        onSetReview(currentStatus, notes);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [notes, currentStatus, currentNotes, onSetReview]);

  function handleStatusClick(status: ReviewStatus) {
    if (currentStatus === status) {
      onClearReview();
    } else {
      onSetReview(status, notes);
    }
  }

  return (
    <div className="bg-surface rounded-xl border border-border p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
          Validación
        </h3>
        <div className="flex gap-1">
          <button
            onClick={onExport}
            className="p-1.5 text-text-muted hover:text-primary transition-colors rounded-lg hover:bg-background"
            title="Exportar revisiones"
          >
            <Download className="h-3.5 w-3.5" />
          </button>
          <label
            className="p-1.5 text-text-muted hover:text-primary transition-colors rounded-lg hover:bg-background cursor-pointer"
            title="Importar revisiones"
          >
            <Upload className="h-3.5 w-3.5" />
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onImport(file);
                e.target.value = "";
              }}
            />
          </label>
        </div>
      </div>

      {/* Status buttons */}
      <div className="flex gap-2 mb-3">
        {(Object.entries(STATUS_CONFIG) as [ReviewStatus, typeof STATUS_CONFIG.approved][]).map(
          ([status, config]) => {
            const Icon = config.icon;
            const isActive = currentStatus === status;
            return (
              <button
                key={status}
                onClick={() => handleStatusClick(status)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-border text-sm font-medium transition-colors",
                  isActive ? config.activeStyle : config.style
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{config.label}</span>
              </button>
            );
          }
        )}
      </div>

      {/* Keyboard hint */}
      <div className="text-[10px] text-text-muted mb-2 flex gap-3">
        <span><kbd className="px-1 py-0.5 bg-background border border-border rounded text-[9px]">A</kbd> Aprobar</span>
        <span><kbd className="px-1 py-0.5 bg-background border border-border rounded text-[9px]">F</kbd> Flag</span>
        <span><kbd className="px-1 py-0.5 bg-background border border-border rounded text-[9px]">R</kbd> Rechazar</span>
      </div>

      {/* Notes */}
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Notas de revisión... (N para enfocar)"
        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none resize-y min-h-[60px]"
        rows={2}
      />
    </div>
  );
}
