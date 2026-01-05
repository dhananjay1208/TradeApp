"use client";

import { Bell } from "lucide-react";
import { StatusIndicator } from "@/components/ui/badge-variants";

export function Header() {
  return (
    <header className="sticky top-0 z-40 glass border-b border-border">
      <div className="flex items-center justify-between px-4 lg:px-6 py-4">
        <div className="lg:hidden">
          {/* Mobile: could add menu button here */}
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <StatusIndicator status="active" label="Live" />
          <button className="w-10 h-10 bg-background-surface border border-border rounded-xl flex items-center justify-center text-foreground-secondary hover:bg-background-elevated transition relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-loss rounded-full" />
          </button>
          <div className="lg:hidden w-10 h-10 rounded-full bg-gradient-to-br from-brand to-info flex items-center justify-center font-bold text-white">
            DK
          </div>
        </div>
      </div>
    </header>
  );
}
