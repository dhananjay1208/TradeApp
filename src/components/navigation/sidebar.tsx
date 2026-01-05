"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home, ClipboardList, Calendar, BarChart3,
  Flame, Settings, HelpCircle, TrendingUp
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/ritual", label: "Ritual", icon: Flame },
  { href: "/journal", label: "Journal", icon: ClipboardList },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
];

const bottomItems = [
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/help", label: "Help", icon: HelpCircle },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={cn(
      "w-[260px] flex flex-col bg-background-secondary border-r border-border",
      className
    )}>
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-btn-primary flex items-center justify-center shadow-glow-brand">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <span className="font-bold text-lg">TradeMind</span>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "nav-item",
                isActive && "nav-item-active"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Nav */}
      <div className="px-3 pb-3 space-y-1">
        <div className="border-t border-border my-3" />
        {bottomItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="nav-item"
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* User Profile */}
      <div className="p-3">
        <div className="flex items-center gap-3 p-3 bg-background-surface rounded-xl">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand to-info flex items-center justify-center font-bold text-white">
            DK
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">DK Trader</p>
            <p className="text-xs text-foreground-tertiary truncate">dk@example.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
