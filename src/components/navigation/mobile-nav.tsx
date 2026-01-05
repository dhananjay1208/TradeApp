"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Flame, Plus, ClipboardList, Settings } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/ritual", label: "Ritual", icon: Flame },
  { href: "/trade/new", label: "Add", icon: Plus, isFab: true },
  { href: "/journal", label: "Journal", icon: ClipboardList },
  { href: "/settings", label: "Settings", icon: Settings },
];

interface MobileNavProps {
  className?: string;
}

export function MobileNav({ className }: MobileNavProps) {
  const pathname = usePathname();

  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 z-50 glass border-t border-border pb-safe",
      className
    )}>
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          if (item.isFab) {
            return (
              <Link key={item.href} href={item.href} className="flex flex-col items-center">
                <div className="w-14 h-14 -mt-8 rounded-full bg-gradient-btn-secondary flex items-center justify-center shadow-lg">
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <span className="text-xs mt-1 text-foreground-tertiary">{item.label}</span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center py-2 px-4 transition-colors",
                isActive ? "text-brand" : "text-foreground-tertiary"
              )}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
