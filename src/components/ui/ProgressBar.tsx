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
    primary: "bg-primary",
    success: "bg-success",
    error: "bg-error",
    "accent-green": "bg-accent-green",
  };

  return (
    <div
      className={cn("h-2 w-full rounded-full bg-background overflow-hidden", className)}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={`${percent}% completado`}
    >
      <div
        className={cn(
          "h-full rounded-full transition-all duration-500 ease-out",
          colorMap[color]
        )}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
