import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "profit" | "loss" | "warning" | "info" | "neutral";
  className?: string;
}

export function Badge({ children, variant = "neutral", className }: BadgeProps) {
  const variants = {
    profit: "bg-profit/20 text-profit",
    loss: "bg-loss/20 text-loss",
    warning: "bg-warning/20 text-warning",
    info: "bg-info/20 text-info",
    neutral: "bg-background-surface text-foreground-secondary",
  };

  return (
    <span className={cn("px-3 py-1 text-sm font-medium rounded-lg", variants[variant], className)}>
      {children}
    </span>
  );
}

export function DirectionTag({ direction }: { direction: "LONG" | "SHORT" }) {
  const isLong = direction === "LONG";
  return (
    <span className={cn(
      "inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded border",
      isLong ? "border-profit text-profit bg-profit/10" : "border-loss text-loss bg-loss/10"
    )}>
      <span>{isLong ? "↑" : "↓"}</span>
      {direction}
    </span>
  );
}

export function StatusIndicator({ status, label }: { status: "active" | "warning" | "inactive"; label: string }) {
  const config = {
    active: { bg: "bg-profit/10", border: "border-profit/30", dot: "bg-profit animate-pulse-glow", text: "text-profit" },
    warning: { bg: "bg-warning/10", border: "border-warning/30", dot: "bg-warning", text: "text-warning" },
    inactive: { bg: "bg-background-surface", border: "border-border", dot: "bg-foreground-tertiary", text: "text-foreground-secondary" },
  }[status];

  return (
    <span className={cn("inline-flex items-center gap-2 px-3 py-1.5 rounded-full border", config.bg, config.border)}>
      <span className={cn("w-2 h-2 rounded-full", config.dot)} />
      <span className={cn("text-xs font-medium", config.text)}>{label}</span>
    </span>
  );
}
