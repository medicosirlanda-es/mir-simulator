"use client";

import { useState, useEffect } from "react";
import { Check, Flag, X, Download, Upload, MessageSquare } from "lucide-react";
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

const STATUS_CONFIG: Record<ReviewStatus, { label: string; icon: typeof Check; style: string; activeStyle: string; kbd: string }> = {
  approved: {
    label: "Aprobar",
    icon: Check,
    kbd: "A",
    style: "hover:bg-success/10 hover:text-success-dark hover:border-success/30",
    activeStyle: "bg-success/15 text-success-dark border-success/40 shadow-sm shadow-success/10",
  },
  flagged: {
    label: "Flag",
    icon: Flag,
    kbd: "F",
    style: "hover:bg-warning/10 hover:text-warning-dark hover:border-warning/30",
    activeStyle: "bg-warning/15 text-warning-dark border-warning/40 shadow-sm shadow-warning/10",
  },
  rejected: {
    label: "Rechazar",
    icon: X,
    kbd: "R",
    style: "hover:bg-error/10 hover:text-error-dark hover:border-error/30",
    activeStyle: "bg-error/15 text-error-dark border-error/40 shadow-sm shadow-error/10",
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

  useEffect(() => {
    setNotes(currentNotes);
  }, [currentNotes, year, number]);

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
    <div className="bg-surface rounded-2xl border border-border p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-text-primary font-heading uppercase tracking-wide">
          Validacion
        </h3>
        <div className="flex gap-1.5">
          <button
            onClick={onExport}
            className="p-2 text-text-muted hover:text-primary transition-colors rounded-lg hover:bg-primary/5 cursor-pointer"
            title="Exportar revisiones"
          >
            <Download className="h-4 w-4" />
          </button>
          <label
            className="p-2 text-text-muted hover:text-primary transition-colors rounded-lg hover:bg-primary/5 cursor-pointer"
            title="Importar revisiones"
          >
            <Upload className="h-4 w-4" />
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
      <div className="grid grid-cols-3 gap-2.5">
        {(Object.entries(STATUS_CONFIG) as [ReviewStatus, typeof STATUS_CONFIG.approved][]).map(
          ([status, config]) => {
            const Icon = config.icon;
            const isActive = currentStatus === status;
            return (
              <button
                key={status}
                onClick={() => handleStatusClick(status)}
                className={cn(
                  "flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border border-border text-sm font-semibold transition-all cursor-pointer",
                  isActive ? config.activeStyle : config.style
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{config.label}</span>
                <kbd className="text-[10px] font-mono opacity-50 bg-background/50 border border-border/50 rounded px-1.5 py-0.5">{config.kbd}</kbd>
              </button>
            );
          }
        )}
      </div>

      {/* Notes */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <MessageSquare className="h-3.5 w-3.5 text-text-muted" aria-hidden="true" />
          <span className="text-xs font-medium text-text-muted">Notas de revision</span>
        </div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Escribe notas sobre esta pregunta..."
          className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 resize-y min-h-[80px] transition-all"
          rows={3}
        />
      </div>
    </div>
  );
}
