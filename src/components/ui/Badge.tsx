import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "success" | "error" | "warning" | "primary";

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-background text-text-secondary",
  success: "bg-success-light text-success-dark",
  error: "bg-error-light text-error-dark",
  warning: "bg-warning-light text-warning",
  primary: "bg-primary/10 text-primary",
};

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
