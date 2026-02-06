import { cn } from "@/lib/utils";
import { STAT_COLORS, type StatColor } from "@/lib/dissection-utils";

interface StatCardProps {
  value: string | number;
  title: string;
  subtitle: string;
  color?: StatColor;
}

export function StatCard({ value, title, subtitle, color = "blue" }: StatCardProps) {
  const { bg, text } = STAT_COLORS[color];
  return (
    <div
      className={cn(
        "rounded-xl border border-border p-4 md:p-5 bg-surface shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
        bg
      )}
    >
      <div className={cn("text-2xl md:text-3xl font-bold tracking-tight", text)}>
        {value}
      </div>
      <div className="text-xs md:text-sm font-medium text-text-primary mt-1">
        {title}
      </div>
      <div className="text-[11px] text-text-muted mt-0.5">{subtitle}</div>
    </div>
  );
}
