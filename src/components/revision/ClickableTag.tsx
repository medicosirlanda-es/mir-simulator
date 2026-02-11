"use client";

import { cn } from "@/lib/utils";

type TagType = "spec" | "type" | "cog" | "task" | "img";

const TYPE_STYLES: Record<TagType, string> = {
  spec: "bg-primary/[0.08] border-primary/20 text-primary hover:bg-primary/[0.15]",
  type: "bg-accent-orange/[0.08] border-accent-orange/20 text-accent-orange-dark hover:bg-accent-orange/[0.15]",
  cog: "bg-[#8b5cf6]/[0.08] border-[#8b5cf6]/20 text-[#8b5cf6] hover:bg-[#8b5cf6]/[0.15]",
  task: "bg-accent-green/[0.08] border-accent-green/20 text-accent-green-dark hover:bg-accent-green/[0.15]",
  img: "bg-error/[0.08] border-error/20 text-error-dark hover:bg-error/[0.15]",
};

interface ClickableTagProps {
  title: string;
  value: string | null;
  type?: TagType;
  field: string;
  onTagClick: (field: string, value: string) => void;
}

export function ClickableTag({
  title,
  value,
  type = "spec",
  field,
  onTagClick,
}: ClickableTagProps) {
  if (!value) {
    return (
      <div className={cn("border rounded-lg p-2", TYPE_STYLES[type])}>
        <div className="text-[9px] md:text-[10px] uppercase tracking-wider opacity-60 font-medium">
          {title}
        </div>
        <div className="text-[11px] md:text-xs font-medium mt-0.5">—</div>
      </div>
    );
  }

  return (
    <button
      onClick={() => onTagClick(field, value)}
      className={cn(
        "border rounded-lg p-2 text-left cursor-pointer transition-colors w-full",
        TYPE_STYLES[type]
      )}
      title={`Filtrar por ${title}: ${value}`}
    >
      <div className="text-[9px] md:text-[10px] uppercase tracking-wider opacity-60 font-medium">
        {title}
      </div>
      <div className="text-[11px] md:text-xs font-medium mt-0.5">{value}</div>
    </button>
  );
}
