"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Home, ClipboardList, Calendar, BarChart3,
  Flame, Settings, HelpCircle, TrendingUp, LogOut, ChevronUp, Shield
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/ritual", label: "Ritual", icon: Flame },
  { href: "/trade/assess", label: "Trade Guardian", icon: Shield },
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
  const router = useRouter();
  const supabase = createClient();

  const [userEmail, setUserEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [userInitials, setUserInitials] = useState<string>("U");

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email || "");

        // Try to get profile name
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single();

        const name = profile?.full_name || user.email?.split("@")[0] || "User";
        setUserName(name);

        // Generate initials
        const initials = name
          .split(" ")
          .map((n: string) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);
        setUserInitials(initials || "U");
      }
    }
    loadUser();
  }, [supabase]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

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

      {/* User Profile with Logout */}
      <div className="p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full flex items-center gap-3 p-3 bg-background-surface rounded-xl hover:bg-background-elevated transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand to-info flex items-center justify-center font-bold text-white">
                {userInitials}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="font-medium text-sm truncate">{userName || "Loading..."}</p>
                <p className="text-xs text-foreground-tertiary truncate">{userEmail || "..."}</p>
              </div>
              <ChevronUp className="w-4 h-4 text-foreground-tertiary" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[232px]">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium truncate">{userName}</p>
              <p className="text-xs text-foreground-tertiary truncate">{userEmail}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings" className="cursor-pointer">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-loss focus:text-loss cursor-pointer"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
