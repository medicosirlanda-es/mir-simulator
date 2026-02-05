import { cn } from "@/lib/utils";
import { forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "accent" | "ghost";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-text-inverted shadow-sm hover:bg-primary-light hover:-translate-y-px active:translate-y-0 active:bg-primary focus-ring",
  secondary:
    "bg-surface text-primary border border-border hover:bg-background hover:border-primary/20 focus-ring",
  accent:
    "bg-accent-green text-text-inverted shadow-sm hover:bg-accent-green-dark hover:-translate-y-px active:translate-y-0 focus-ring",
  ghost:
    "text-text-secondary hover:bg-background hover:text-text-primary focus-ring",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ variant = "primary", className, children, ...props }, ref) {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold transition-all duration-200 min-h-[44px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0",
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
