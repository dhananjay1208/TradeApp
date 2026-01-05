import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && <label className="block text-sm text-foreground-secondary">{label}</label>}
        <input
          ref={ref}
          className={cn("input-base", error && "border-loss focus:ring-loss", className)}
          {...props}
        />
        {error && <p className="text-sm text-loss">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
