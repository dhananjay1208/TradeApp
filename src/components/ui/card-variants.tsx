import { cn } from "@/lib/utils";

export function BaseCard({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("card-base", className)} {...props}>
      {children}
    </div>
  );
}

export function ProfitCard({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("rounded-2xl p-6 border card-profit", className)} {...props}>
      {children}
    </div>
  );
}

export function LossCard({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("rounded-2xl p-6 border card-loss", className)} {...props}>
      {children}
    </div>
  );
}
