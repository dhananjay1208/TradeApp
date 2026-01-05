import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const variants = {
    primary: "bg-gradient-btn-primary text-white shadow-glow-brand hover:brightness-110",
    secondary: "bg-gradient-btn-secondary text-white hover:brightness-110",
    outline: "bg-transparent border border-border-subtle text-foreground-secondary hover:bg-background-surface hover:text-foreground-primary",
    ghost: "bg-transparent text-foreground-secondary hover:bg-background-surface hover:text-foreground-primary",
    danger: "bg-gradient-to-r from-red-500 to-red-600 text-white hover:brightness-110",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm rounded-lg",
    md: "px-6 py-3 text-sm rounded-xl",
    lg: "px-8 py-4 text-base rounded-xl",
  };

  return (
    <button
      className={cn(
        "font-semibold transition-all flex items-center justify-center gap-2",
        "disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}
