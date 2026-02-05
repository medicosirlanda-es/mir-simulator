import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
  hover = false,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  id?: string;
  role?: string;
  "aria-label"?: string;
}) {
  return (
    <div
      className={cn(
        "bg-surface rounded-2xl border border-border shadow-sm",
        hover &&
          "transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-primary/30 focus-within:-translate-y-1 focus-within:shadow-md focus-within:border-primary/30",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
