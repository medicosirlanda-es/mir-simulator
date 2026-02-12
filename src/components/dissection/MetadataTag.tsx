import { cn } from "@/lib/utils";

type MetadataTagType = "spec" | "type" | "cog" | "task" | "img";

const TYPE_STYLES: Record<MetadataTagType, string> = {
  spec: "bg-primary/[0.08] border-primary/20 text-primary",
  type: "bg-accent-orange/[0.08] border-accent-orange/20 text-accent-orange-dark",
  cog: "bg-primary-dark/[0.08] border-primary-dark/20 text-primary-dark",
  task: "bg-accent-green/[0.08] border-accent-green/20 text-accent-green-dark",
  img: "bg-error/[0.08] border-error/20 text-error-dark",
};

interface MetadataTagProps {
  title: string;
  value: string | null;
  type?: MetadataTagType;
}

export function MetadataTag({ title, value, type = "spec" }: MetadataTagProps) {
  return (
    <div className={cn("border rounded-lg p-2", TYPE_STYLES[type])}>
      <div className="text-[9px] md:text-[10px] uppercase tracking-wider opacity-60 font-medium">
        {title}
      </div>
      <div className="text-[11px] md:text-xs font-medium mt-0.5">
        {value || "—"}
      </div>
    </div>
  );
}
