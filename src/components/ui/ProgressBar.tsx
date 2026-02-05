import { cn } from "@/lib/utils";

export function ProgressBar({
  value,
  max,
  className,
  color = "primary",
}: {
  value: number;
  max: number;
  className?: string;
  color?: "primary" | "success" | "error" | "accent-green";
}) {
  const percent = max > 0 ? Math.round((value / max) * 100) : 0;

  const colorMap = {
    primary: "bg-gradient-to-r from-primary to-primary-light",
    success: "bg-gradient-to-r from-success-dark to-success",
    error: "bg-error",
    "accent-green": "bg-gradient-to-r from-accent-green-dark to-accent-green",
  };

  return (
    <div
      className={cn("h-2 w-full rounded-full bg-border/50 overflow-hidden", className)}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={`${percent}% completado`}
    >
      <div
        className={cn(
          "h-full rounded-full transition-[width] duration-500 ease-out",
          colorMap[color]
        )}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
