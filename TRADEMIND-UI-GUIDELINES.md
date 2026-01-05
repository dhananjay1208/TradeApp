# TradeMind UI Development Guidelines
## Complete Reference for Building the Application

**Version:** 1.0  
**Last Updated:** January 2026  
**Tech Stack:** Next.js 14 (App Router) + TypeScript + Tailwind CSS + shadcn/ui + Supabase

---

## Table of Contents

1. [Project Setup](#1-project-setup)
2. [Design Tokens](#2-design-tokens)
3. [Typography](#3-typography)
4. [Spacing & Layout](#4-spacing--layout)
5. [Component Specifications](#5-component-specifications)
6. [Page Layouts](#6-page-layouts)
7. [Navigation](#7-navigation)
8. [Charts & Data Visualization](#8-charts--data-visualization)
9. [Forms & Inputs](#9-forms--inputs)
10. [Feedback & States](#10-feedback--states)
11. [Animations](#11-animations)
12. [Responsive Design](#12-responsive-design)
13. [Accessibility](#13-accessibility)
14. [Icons](#14-icons)
15. [File Structure](#15-file-structure)

---

## 1. Project Setup

### 1.1 Initialize Project

```bash
npx create-next-app@latest trademind --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd trademind
```

### 1.2 Install Dependencies

```bash
# UI Components
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input label select checkbox dialog sheet toast tabs avatar badge progress slider switch textarea dropdown-menu popover calendar

# Additional packages
npm install lucide-react recharts date-fns zustand @supabase/supabase-js @supabase/auth-helpers-nextjs framer-motion
```

### 1.3 Tailwind Configuration

Create/update `tailwind.config.ts`:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Background Colors
        background: {
          DEFAULT: "hsl(var(--background))",
          primary: "#0a0f1a",
          secondary: "#111827",
          tertiary: "#1a2332",
          surface: "#242d3d",
          elevated: "#2d3748",
        },
        
        // Foreground/Text Colors
        foreground: {
          DEFAULT: "hsl(var(--foreground))",
          primary: "#f8fafc",
          secondary: "#94a3b8",
          tertiary: "#64748b",
          muted: "#475569",
        },
        
        // Brand Colors
        brand: {
          DEFAULT: "#10b981",
          hover: "#059669",
          muted: "#065f46",
          light: "#d1fae5",
        },
        
        // Semantic Colors
        profit: {
          DEFAULT: "#22c55e",
          bg: "rgba(34, 197, 94, 0.1)",
          border: "rgba(34, 197, 94, 0.3)",
          glow: "rgba(34, 197, 94, 0.15)",
        },
        loss: {
          DEFAULT: "#ef4444",
          bg: "rgba(239, 68, 68, 0.1)",
          border: "rgba(239, 68, 68, 0.3)",
          glow: "rgba(239, 68, 68, 0.15)",
        },
        warning: {
          DEFAULT: "#f59e0b",
          bg: "rgba(245, 158, 11, 0.1)",
          border: "rgba(245, 158, 11, 0.3)",
        },
        info: {
          DEFAULT: "#3b82f6",
          bg: "rgba(59, 130, 246, 0.1)",
          border: "rgba(59, 130, 246, 0.3)",
        },
        
        // Accent Colors
        accent: {
          blue: "#3b82f6",
          purple: "#8b5cf6",
          cyan: "#06b6d4",
          amber: "#f59e0b",
        },
        
        // Border Colors
        border: {
          DEFAULT: "#1f2937",
          subtle: "#374151",
          accent: "rgba(16, 185, 129, 0.3)",
        },
      },
      
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      
      fontSize: {
        "display-xl": ["3rem", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "800" }],
        "display-lg": ["2.25rem", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "700" }],
        "display-md": ["1.75rem", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "700" }],
      },
      
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      
      boxShadow: {
        "glow-profit": "0 0 40px rgba(34, 197, 94, 0.15)",
        "glow-loss": "0 0 40px rgba(239, 68, 68, 0.15)",
        "glow-brand": "0 0 40px rgba(16, 185, 129, 0.2)",
        "glow-blue": "0 0 40px rgba(59, 130, 246, 0.2)",
        "card": "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)",
        "card-hover": "0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.2)",
      },
      
      backgroundImage: {
        "gradient-card": "linear-gradient(145deg, #1a2332 0%, #111827 100%)",
        "gradient-profit": "linear-gradient(145deg, rgba(34, 197, 94, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%)",
        "gradient-loss": "linear-gradient(145deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.05) 100%)",
        "gradient-blue": "linear-gradient(145deg, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.05) 100%)",
        "gradient-btn-primary": "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        "gradient-btn-secondary": "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
        "gradient-btn-danger": "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
      },
      
      animation: {
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "shimmer": "shimmer 1.5s infinite",
        "slide-up": "slide-up 0.3s ease-out",
        "slide-down": "slide-down 0.3s ease-out",
        "fade-in": "fade-in 0.2s ease-out",
      },
      
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "slide-up": {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-down": {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

### 1.4 Global CSS

Update `src/app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 222 47% 7%;
    --foreground: 210 40% 98%;
    --card: 222 47% 9%;
    --card-foreground: 210 40% 98%;
    --popover: 222 47% 9%;
    --popover-foreground: 210 40% 98%;
    --primary: 160 84% 39%;
    --primary-foreground: 210 40% 98%;
    --secondary: 217 33% 17%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217 33% 17%;
    --muted-foreground: 215 20% 55%;
    --accent: 217 33% 17%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 84% 60%;
    --destructive-foreground: 210 40% 98%;
    --border: 217 33% 17%;
    --input: 217 33% 17%;
    --ring: 160 84% 39%;
    --radius: 0.75rem;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  
  body {
    @apply bg-background-primary text-foreground-primary font-sans antialiased;
  }
  
  /* Custom Scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    @apply bg-background-secondary;
  }
  
  ::-webkit-scrollbar-thumb {
    @apply bg-border-subtle rounded;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    @apply bg-foreground-tertiary;
  }
}

@layer components {
  /* Glass Effect */
  .glass {
    @apply bg-background-secondary/80 backdrop-blur-xl;
  }
  
  /* Skeleton Loading */
  .skeleton {
    background: linear-gradient(90deg, #1a2332 25%, #242d3d 50%, #1a2332 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }
  
  /* Card Variants */
  .card-base {
    @apply bg-gradient-card rounded-2xl border border-border p-6 shadow-card transition-all duration-200;
  }
  
  .card-base:hover {
    @apply shadow-card-hover border-border-subtle;
  }
  
  .card-profit {
    @apply bg-gradient-profit border-profit-border shadow-glow-profit;
  }
  
  .card-loss {
    @apply bg-gradient-loss border-loss-border shadow-glow-loss;
  }
  
  /* Button Variants */
  .btn-primary {
    @apply bg-gradient-btn-primary text-white font-semibold rounded-xl px-6 py-3 shadow-glow-brand transition-all duration-200;
  }
  
  .btn-primary:hover {
    @apply shadow-lg brightness-110;
  }
  
  .btn-primary:active {
    @apply scale-[0.98];
  }
  
  .btn-secondary {
    @apply bg-gradient-btn-secondary text-white font-semibold rounded-xl px-6 py-3 transition-all duration-200;
  }
  
  .btn-outline {
    @apply bg-transparent border border-border-subtle text-foreground-secondary font-semibold rounded-xl px-6 py-3 transition-all duration-200;
  }
  
  .btn-outline:hover {
    @apply bg-background-surface text-foreground-primary;
  }
  
  .btn-ghost {
    @apply bg-transparent text-foreground-secondary font-semibold rounded-xl px-6 py-3 transition-all duration-200;
  }
  
  .btn-ghost:hover {
    @apply bg-background-surface text-foreground-primary;
  }
  
  /* Input Styles */
  .input-base {
    @apply w-full bg-background-surface border border-border rounded-xl px-4 py-3 text-foreground-primary placeholder:text-foreground-tertiary transition-all duration-200;
  }
  
  .input-base:focus {
    @apply outline-none ring-2 ring-brand border-transparent;
  }
  
  /* Navigation Item */
  .nav-item {
    @apply flex items-center gap-3 px-4 py-3 text-foreground-secondary rounded-xl transition-all duration-200;
  }
  
  .nav-item:hover {
    @apply bg-background-surface text-foreground-primary;
  }
  
  .nav-item-active {
    @apply bg-brand/10 text-brand border-l-2 border-brand;
  }
}

@layer utilities {
  /* Text Gradient */
  .text-gradient {
    @apply bg-clip-text text-transparent bg-gradient-to-r from-brand to-accent-cyan;
  }
  
  /* Hide scrollbar but keep functionality */
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}
```

---

## 2. Design Tokens

### 2.1 Color Tokens (Quick Reference)

```typescript
// src/lib/tokens.ts

export const colors = {
  // Backgrounds
  bg: {
    primary: "#0a0f1a",      // Main app background
    secondary: "#111827",    // Card backgrounds
    tertiary: "#1a2332",     // Elevated surfaces
    surface: "#242d3d",      // Input fields, hover states
    elevated: "#2d3748",     // Dropdowns, popovers
  },
  
  // Text
  text: {
    primary: "#f8fafc",      // Headlines, important text
    secondary: "#94a3b8",    // Body text, descriptions
    tertiary: "#64748b",     // Captions, labels
    muted: "#475569",        // Disabled text
  },
  
  // Brand
  brand: {
    default: "#10b981",      // Primary accent (Emerald)
    hover: "#059669",        // Hover state
    muted: "#065f46",        // Muted variant
  },
  
  // Semantic
  profit: "#22c55e",         // Green for profit/success
  loss: "#ef4444",           // Red for loss/error
  warning: "#f59e0b",        // Amber for warnings
  info: "#3b82f6",           // Blue for info
  
  // Accents
  accent: {
    blue: "#3b82f6",
    purple: "#8b5cf6",
    cyan: "#06b6d4",
    amber: "#f59e0b",
  },
  
  // Borders
  border: {
    default: "#1f2937",
    subtle: "#374151",
    accent: "rgba(16, 185, 129, 0.3)",
  },
} as const;

// Tailwind class mappings for quick reference
export const colorClasses = {
  bg: {
    primary: "bg-background-primary",
    secondary: "bg-background-secondary",
    tertiary: "bg-background-tertiary",
    surface: "bg-background-surface",
    elevated: "bg-background-elevated",
  },
  text: {
    primary: "text-foreground-primary",
    secondary: "text-foreground-secondary",
    tertiary: "text-foreground-tertiary",
    muted: "text-foreground-muted",
  },
  semantic: {
    profit: "text-profit",
    loss: "text-loss",
    warning: "text-warning",
    info: "text-info",
  },
} as const;
```

### 2.2 Spacing Scale

```typescript
// Spacing follows 4px base unit
export const spacing = {
  0: "0px",
  1: "4px",     // 0.25rem
  2: "8px",     // 0.5rem
  3: "12px",    // 0.75rem
  4: "16px",    // 1rem
  5: "20px",    // 1.25rem
  6: "24px",    // 1.5rem
  8: "32px",    // 2rem
  10: "40px",   // 2.5rem
  12: "48px",   // 3rem
  16: "64px",   // 4rem
  20: "80px",   // 5rem
} as const;

// Usage in Tailwind: p-4, m-6, gap-3, etc.
```

---

## 3. Typography

### 3.1 Font Setup

Add to `src/app/layout.tsx`:

```typescript
import { Inter } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <body>{children}</body>
    </html>
  );
}
```

### 3.2 Typography Scale

```typescript
// Typography specifications
export const typography = {
  // Display - Hero sections, large numbers
  displayXl: "text-5xl font-extrabold tracking-tight",      // 48px
  displayLg: "text-4xl font-bold tracking-tight",           // 36px
  displayMd: "text-3xl font-bold",                          // 28px
  
  // Headings
  h1: "text-2xl font-bold",                                 // 24px
  h2: "text-xl font-semibold",                              // 20px
  h3: "text-lg font-semibold",                              // 18px
  h4: "text-base font-semibold",                            // 16px
  
  // Body
  bodyLg: "text-base",                                      // 16px
  bodyMd: "text-sm",                                        // 14px
  bodySm: "text-[13px]",                                    // 13px
  
  // Utility
  caption: "text-xs",                                       // 12px
  label: "text-xs font-medium uppercase tracking-wider",   // 12px, uppercase
  
  // Monospace (for numbers/prices)
  monoLg: "font-mono text-2xl font-semibold",              // Prices
  monoMd: "font-mono text-base font-medium",               // Data values
} as const;
```

### 3.3 Typography Components

```tsx
// src/components/ui/typography.tsx
import { cn } from "@/lib/utils";

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
}

export function DisplayXL({ children, className }: TypographyProps) {
  return <h1 className={cn("text-5xl font-extrabold tracking-tight", className)}>{children}</h1>;
}

export function DisplayLg({ children, className }: TypographyProps) {
  return <h2 className={cn("text-4xl font-bold tracking-tight", className)}>{children}</h2>;
}

export function H1({ children, className }: TypographyProps) {
  return <h1 className={cn("text-2xl font-bold", className)}>{children}</h1>;
}

export function H2({ children, className }: TypographyProps) {
  return <h2 className={cn("text-xl font-semibold", className)}>{children}</h2>;
}

export function H3({ children, className }: TypographyProps) {
  return <h3 className={cn("text-lg font-semibold", className)}>{children}</h3>;
}

export function Body({ children, className }: TypographyProps) {
  return <p className={cn("text-sm text-foreground-secondary", className)}>{children}</p>;
}

export function Caption({ children, className }: TypographyProps) {
  return <span className={cn("text-xs text-foreground-tertiary", className)}>{children}</span>;
}

export function Label({ children, className }: TypographyProps) {
  return <span className={cn("text-xs font-medium uppercase tracking-wider text-foreground-tertiary", className)}>{children}</span>;
}

export function MonoValue({ children, className }: TypographyProps) {
  return <span className={cn("font-mono text-2xl font-semibold", className)}>{children}</span>;
}
```

---

## 4. Spacing & Layout

### 4.1 Layout Constants

```typescript
// src/lib/layout.ts

export const layout = {
  // Sidebar
  sidebarWidth: "260px",
  sidebarCollapsed: "64px",
  
  // Content
  maxContentWidth: "1280px",
  contentPadding: {
    mobile: "16px",
    tablet: "24px",
    desktop: "32px",
  },
  
  // Navigation
  bottomNavHeight: "64px",
  headerHeight: "64px",
  
  // Cards
  cardPadding: "24px",       // p-6
  cardRadius: "16px",        // rounded-2xl
  cardGap: "24px",           // gap-6
  
  // Grid
  gridGap: {
    sm: "12px",              // gap-3
    md: "16px",              // gap-4
    lg: "24px",              // gap-6
  },
} as const;
```

### 4.2 Grid System

```tsx
// Standard grid layouts

// 2 Column (Stats)
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {/* Cards */}
</div>

// 3 Column (Dashboard)
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Cards */}
</div>

// 4 Column (Stats Row)
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  {/* Stat items */}
</div>

// Sidebar + Content Layout
<div className="flex min-h-screen">
  <aside className="hidden lg:flex w-[260px] flex-col bg-background-secondary border-r border-border">
    {/* Sidebar */}
  </aside>
  <main className="flex-1 p-6">
    {/* Main content */}
  </main>
</div>
```

---

## 5. Component Specifications

### 5.1 Card Components

```tsx
// src/components/ui/card-variants.tsx
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Base Card
export function BaseCard({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn(
        "bg-gradient-card rounded-2xl border border-border p-6",
        "shadow-card hover:shadow-card-hover transition-all duration-200",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// Profit Card (for positive P&L)
export function ProfitCard({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn(
        "bg-gradient-profit rounded-2xl border border-profit-border p-6",
        "shadow-glow-profit transition-all duration-200",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// Loss Card (for negative P&L)
export function LossCard({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn(
        "bg-gradient-loss rounded-2xl border border-loss-border p-6",
        "shadow-glow-loss transition-all duration-200",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// Stat Card with Icon
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  change?: string;
  changeType?: "profit" | "loss" | "neutral";
  sparkline?: React.ReactNode;
}

export function StatCard({ icon, label, value, change, changeType = "neutral", sparkline }: StatCardProps) {
  return (
    <BaseCard className="flex items-start justify-between">
      <div>
        <div className="w-10 h-10 rounded-xl bg-brand/20 flex items-center justify-center mb-3">
          {icon}
        </div>
        <p className="text-xs text-foreground-tertiary uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
        {change && (
          <p className={cn(
            "text-sm mt-1",
            changeType === "profit" && "text-profit",
            changeType === "loss" && "text-loss",
            changeType === "neutral" && "text-foreground-secondary"
          )}>
            {change}
          </p>
        )}
      </div>
      {sparkline && <div className="w-20 h-12">{sparkline}</div>}
    </BaseCard>
  );
}
```

### 5.2 Hero P&L Card

```tsx
// src/components/dashboard/hero-pnl-card.tsx
interface HeroPnLCardProps {
  pnl: number;
  pnlPercent: number;
  trades: number;
  won: number;
  lost: number;
  winRate: number;
}

export function HeroPnLCard({ pnl, pnlPercent, trades, won, lost, winRate }: HeroPnLCardProps) {
  const isProfit = pnl >= 0;
  
  return (
    <div className={cn(
      "rounded-2xl p-6 border transition-all",
      isProfit 
        ? "bg-gradient-profit border-profit-border shadow-glow-profit" 
        : "bg-gradient-loss border-loss-border shadow-glow-loss"
    )}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-sm text-foreground-secondary">Today's P&L</p>
          <p className={cn(
            "text-4xl font-bold mt-1 font-mono",
            isProfit ? "text-profit" : "text-loss"
          )}>
            {isProfit ? "+" : ""}₹{Math.abs(pnl).toLocaleString('en-IN')}
          </p>
          <p className={cn(
            "text-sm mt-1",
            isProfit ? "text-profit/80" : "text-loss/80"
          )}>
            {isProfit ? "+" : ""}{pnlPercent.toFixed(2)}% ROI
          </p>
        </div>
        <div className={cn(
          "w-14 h-14 rounded-2xl flex items-center justify-center",
          isProfit ? "bg-profit/20" : "bg-loss/20"
        )}>
          {isProfit ? (
            <TrendingUp className={cn("w-7 h-7", isProfit ? "text-profit" : "text-loss")} />
          ) : (
            <TrendingDown className="w-7 h-7 text-loss" />
          )}
        </div>
      </div>
      
      <div className={cn(
        "grid grid-cols-4 gap-2 pt-4 border-t",
        isProfit ? "border-profit/20" : "border-loss/20"
      )}>
        <div className="text-center">
          <p className="text-lg font-bold">{trades}</p>
          <p className="text-xs text-foreground-tertiary">Trades</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-profit">{won}</p>
          <p className="text-xs text-foreground-tertiary">Won</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-loss">{lost}</p>
          <p className="text-xs text-foreground-tertiary">Lost</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-info">{winRate}%</p>
          <p className="text-xs text-foreground-tertiary">Win Rate</p>
        </div>
      </div>
    </div>
  );
}
```

### 5.3 Trade Card

```tsx
// src/components/trades/trade-card.tsx
interface TradeCardProps {
  symbol: string;
  direction: "LONG" | "SHORT";
  quantity: number;
  entryPrice: number;
  exitPrice?: number;
  pnl?: number;
  time: string;
  onClick?: () => void;
}

export function TradeCard({ 
  symbol, 
  direction, 
  quantity, 
  entryPrice, 
  exitPrice, 
  pnl, 
  time,
  onClick 
}: TradeCardProps) {
  const isLong = direction === "LONG";
  const isProfit = pnl && pnl >= 0;
  
  return (
    <div 
      onClick={onClick}
      className={cn(
        "flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all",
        isProfit !== undefined && isProfit 
          ? "bg-profit/5 border-profit/20 hover:bg-profit/10"
          : "bg-loss/5 border-loss/20 hover:bg-loss/10"
      )}
    >
      <div className="flex items-center gap-4">
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center",
          isLong ? "bg-profit/20" : "bg-loss/20"
        )}>
          <span className={cn(
            "font-bold",
            isLong ? "text-profit" : "text-loss"
          )}>
            {isLong ? "↑" : "↓"}
          </span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">{symbol}</span>
            <span className={cn(
              "text-xs px-2 py-0.5 rounded font-medium",
              isLong 
                ? "bg-profit/20 text-profit" 
                : "bg-loss/20 text-loss"
            )}>
              {direction}
            </span>
          </div>
          <p className="text-sm text-foreground-tertiary">
            {quantity} qty • ₹{entryPrice.toLocaleString('en-IN')}
            {exitPrice && ` → ₹${exitPrice.toLocaleString('en-IN')}`}
          </p>
        </div>
      </div>
      <div className="text-right">
        {pnl !== undefined && (
          <p className={cn(
            "text-lg font-bold font-mono",
            isProfit ? "text-profit" : "text-loss"
          )}>
            {isProfit ? "+" : ""}₹{Math.abs(pnl).toLocaleString('en-IN')}
          </p>
        )}
        <p className="text-xs text-foreground-tertiary">{time}</p>
      </div>
    </div>
  );
}
```

### 5.4 Risk Monitor Card

```tsx
// src/components/dashboard/risk-monitor.tsx
interface RiskMonitorProps {
  dailyLossUsed: number;
  dailyLossLimit: number;
  perTradeRisk: number;
  perTradeLimit: number;
  tradesCount: number;
  maxTrades: number;
}

export function RiskMonitor({
  dailyLossUsed,
  dailyLossLimit,
  perTradeRisk,
  perTradeLimit,
  tradesCount,
  maxTrades,
}: RiskMonitorProps) {
  const dailyPercent = (dailyLossUsed / dailyLossLimit) * 100;
  const perTradePercent = (perTradeRisk / perTradeLimit) * 100;
  const tradesPercent = (tradesCount / maxTrades) * 100;
  
  const getStatus = (percent: number) => {
    if (percent < 50) return { color: "bg-profit", label: "Safe", textColor: "text-profit" };
    if (percent < 75) return { color: "bg-warning", label: "Caution", textColor: "text-warning" };
    if (percent < 90) return { color: "bg-amber-500", label: "Warning", textColor: "text-amber-500" };
    return { color: "bg-loss", label: "Danger", textColor: "text-loss" };
  };
  
  const overallStatus = getStatus(Math.max(dailyPercent, perTradePercent));
  
  return (
    <BaseCard>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Shield className="w-5 h-5 text-brand" />
          Risk Monitor
        </h3>
        <span className={cn(
          "text-xs px-2 py-1 rounded-full font-medium",
          `bg-${overallStatus.color.replace('bg-', '')}/20`,
          overallStatus.textColor
        )}>
          {overallStatus.label}
        </span>
      </div>
      
      <div className="space-y-4">
        {/* Daily Loss */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-foreground-secondary">Daily Loss Used</span>
            <span>₹{dailyLossUsed.toLocaleString('en-IN')} / ₹{dailyLossLimit.toLocaleString('en-IN')}</span>
          </div>
          <div className="h-2 bg-background-surface rounded-full overflow-hidden">
            <div 
              className={cn("h-full rounded-full transition-all", getStatus(dailyPercent).color)}
              style={{ width: `${Math.min(dailyPercent, 100)}%` }}
            />
          </div>
        </div>
        
        {/* Per Trade Risk */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-foreground-secondary">Per Trade Risk</span>
            <span>₹{perTradeRisk.toLocaleString('en-IN')} / ₹{perTradeLimit.toLocaleString('en-IN')}</span>
          </div>
          <div className="h-2 bg-background-surface rounded-full overflow-hidden">
            <div 
              className={cn("h-full rounded-full transition-all", getStatus(perTradePercent).color)}
              style={{ width: `${Math.min(perTradePercent, 100)}%` }}
            />
          </div>
        </div>
        
        {/* Trades Count */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-foreground-secondary">Trades Today</span>
            <span>{tradesCount} / {maxTrades}</span>
          </div>
          <div className="h-2 bg-background-surface rounded-full overflow-hidden">
            <div 
              className={cn("h-full rounded-full transition-all", getStatus(tradesPercent).color)}
              style={{ width: `${Math.min(tradesPercent, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </BaseCard>
  );
}
```

### 5.5 Buttons

```tsx
// src/components/ui/button-variants.tsx
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const variants = {
    primary: "bg-gradient-btn-primary text-white shadow-glow-brand hover:shadow-lg hover:brightness-110",
    secondary: "bg-gradient-btn-secondary text-white hover:shadow-lg hover:brightness-110",
    outline: "bg-transparent border border-border-subtle text-foreground-secondary hover:bg-background-surface hover:text-foreground-primary",
    ghost: "bg-transparent text-foreground-secondary hover:bg-background-surface hover:text-foreground-primary",
    danger: "bg-gradient-btn-danger text-white hover:shadow-lg hover:brightness-110",
  };
  
  const sizes = {
    sm: "px-4 py-2 text-sm rounded-lg",
    md: "px-6 py-3 text-sm rounded-xl",
    lg: "px-8 py-4 text-base rounded-xl",
  };
  
  return (
    <button
      className={cn(
        "font-semibold transition-all duration-200 flex items-center justify-center gap-2",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
        "active:scale-[0.98]",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : leftIcon}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
}

// Icon Button
interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  badge?: number | boolean;
}

export function IconButton({
  icon,
  variant = "ghost",
  size = "md",
  badge,
  className,
  ...props
}: IconButtonProps) {
  const variants = {
    primary: "bg-gradient-btn-primary text-white",
    secondary: "bg-background-surface border border-border text-foreground-secondary hover:bg-background-elevated hover:text-foreground-primary",
    ghost: "text-foreground-secondary hover:bg-background-surface hover:text-foreground-primary",
  };
  
  const sizes = {
    sm: "w-8 h-8 rounded-lg",
    md: "w-10 h-10 rounded-xl",
    lg: "w-12 h-12 rounded-xl",
  };
  
  return (
    <button
      className={cn(
        "flex items-center justify-center transition-all duration-200 relative",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {icon}
      {badge && (
        <span className="absolute top-1 right-1 w-2 h-2 bg-loss rounded-full" />
      )}
    </button>
  );
}

// FAB (Floating Action Button)
export function FAB({
  icon,
  onClick,
  className,
}: {
  icon: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-14 h-14 rounded-full bg-gradient-btn-secondary text-white",
        "flex items-center justify-center shadow-lg hover:shadow-xl transition-all",
        "active:scale-95",
        className
      )}
    >
      {icon}
    </button>
  );
}
```

### 5.6 Badges & Tags

```tsx
// src/components/ui/badge-variants.tsx
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "profit" | "loss" | "warning" | "info" | "neutral" | "outline";
  size?: "sm" | "md";
  className?: string;
}

export function Badge({ 
  children, 
  variant = "neutral", 
  size = "md",
  className 
}: BadgeProps) {
  const variants = {
    profit: "bg-profit/20 text-profit",
    loss: "bg-loss/20 text-loss",
    warning: "bg-warning/20 text-warning",
    info: "bg-info/20 text-info",
    neutral: "bg-background-surface text-foreground-secondary",
    outline: "border border-border-subtle text-foreground-secondary",
  };
  
  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
  };
  
  return (
    <span className={cn(
      "inline-flex items-center gap-1 font-medium rounded-lg",
      variants[variant],
      sizes[size],
      className
    )}>
      {children}
    </span>
  );
}

// Direction Tag
export function DirectionTag({ direction }: { direction: "LONG" | "SHORT" }) {
  const isLong = direction === "LONG";
  
  return (
    <span className={cn(
      "inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded border",
      isLong 
        ? "border-profit text-profit bg-profit/10" 
        : "border-loss text-loss bg-loss/10"
    )}>
      <span>{isLong ? "↑" : "↓"}</span>
      {direction}
    </span>
  );
}

// Status Indicator
export function StatusIndicator({ 
  status, 
  label 
}: { 
  status: "active" | "warning" | "inactive"; 
  label: string;
}) {
  const statuses = {
    active: { bg: "bg-profit/10", border: "border-profit/30", dot: "bg-profit", text: "text-profit" },
    warning: { bg: "bg-warning/10", border: "border-warning/30", dot: "bg-warning", text: "text-warning" },
    inactive: { bg: "bg-background-surface", border: "border-border", dot: "bg-foreground-tertiary", text: "text-foreground-secondary" },
  };
  
  const config = statuses[status];
  
  return (
    <span className={cn(
      "inline-flex items-center gap-2 px-3 py-1.5 rounded-full border",
      config.bg,
      config.border
    )}>
      <span className={cn(
        "w-2 h-2 rounded-full",
        config.dot,
        status === "active" && "animate-pulse-glow"
      )} />
      <span className={cn("text-xs font-medium", config.text)}>{label}</span>
    </span>
  );
}
```

---

## 6. Page Layouts

### 6.1 Main App Layout

```tsx
// src/app/(app)/layout.tsx
import { Sidebar } from "@/components/navigation/sidebar";
import { MobileNav } from "@/components/navigation/mobile-nav";
import { Header } from "@/components/navigation/header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background-primary">
      {/* Desktop Sidebar */}
      <Sidebar className="hidden lg:flex" />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-4 lg:p-6 pb-20 lg:pb-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <MobileNav className="lg:hidden" />
    </div>
  );
}
```

### 6.2 Dashboard Layout

```tsx
// src/app/(app)/dashboard/page.tsx
export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Good Morning, DK! 👋</h1>
          <p className="text-sm text-foreground-secondary">Monday, January 6, 2026</p>
        </div>
        <StatusIndicator status="active" label="Live" />
      </div>
      
      {/* Hero P&L */}
      <HeroPnLCard
        pnl={2450}
        pnlPercent={2.45}
        trades={5}
        won={4}
        lost={1}
        winRate={80}
      />
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RiskMonitor
          dailyLossUsed={350}
          dailyLossLimit={5000}
          perTradeRisk={850}
          perTradeLimit={1000}
          tradesCount={5}
          maxTrades={10}
        />
        <TargetProgress
          dailyTarget={2000}
          dailyProgress={2450}
          weeklyTarget={8000}
          weeklyProgress={4650}
          monthlyTarget={30000}
          monthlyProgress={9300}
        />
      </div>
      
      {/* Today's Trades */}
      <BaseCard>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Today's Trades</h2>
          <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="w-4 h-4" />}>
            View All
          </Button>
        </div>
        <div className="space-y-3">
          {trades.map((trade) => (
            <TradeCard key={trade.id} {...trade} />
          ))}
        </div>
      </BaseCard>
      
      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <Button variant="primary" size="lg" leftIcon={<Plus className="w-5 h-5" />}>
          Add Trade
        </Button>
        <Button variant="outline" size="lg" leftIcon={<BarChart3 className="w-5 h-5" />}>
          Analytics
        </Button>
      </div>
      
      {/* End Session Button */}
      <Button variant="outline" className="w-full" leftIcon={<Square className="w-4 h-4" />}>
        End Trading Session
      </Button>
    </div>
  );
}
```

### 6.3 Pre-Market Ritual Layout

```tsx
// src/app/(app)/ritual/page.tsx
export default function RitualPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold">🌅 Pre-Market Ritual</h1>
        <p className="text-sm text-foreground-secondary mt-1">Monday, January 6, 2026</p>
      </div>
      
      {/* Motivational Quote */}
      <BaseCard className="text-center">
        <p className="text-lg italic text-foreground-secondary">
          "The goal of a successful trader is to make the best trades. Money is secondary."
        </p>
        <p className="text-sm text-foreground-tertiary mt-2">— Alexander Elder</p>
      </BaseCard>
      
      {/* Risk Limits Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatMini label="Max Loss" value="₹5,000" />
        <StatMini label="Per Trade" value="₹1,000" />
        <StatMini label="Max Trades" value="10" />
        <StatMini label="Capital" value="₹1,00,000" />
      </div>
      
      {/* Rules Checklist */}
      <BaseCard>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">📋 Trading Rules</h2>
          <Badge variant="info">6/7</Badge>
        </div>
        <div className="space-y-3">
          {rules.map((rule) => (
            <RuleCheckbox key={rule.id} {...rule} />
          ))}
        </div>
      </BaseCard>
      
      {/* Mood Selection */}
      <BaseCard>
        <h2 className="font-semibold mb-4">😊 How are you feeling today?</h2>
        <div className="grid grid-cols-3 gap-3">
          {moods.map((mood) => (
            <MoodButton key={mood.id} {...mood} />
          ))}
        </div>
      </BaseCard>
      
      {/* Start Button */}
      <Button 
        variant="primary" 
        size="lg" 
        className="w-full"
        leftIcon={<Rocket className="w-5 h-5" />}
        disabled={!isReady}
      >
        Ready to Trade!
      </Button>
    </div>
  );
}
```

---

## 7. Navigation

### 7.1 Sidebar Component

```tsx
// src/components/navigation/sidebar.tsx
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  ClipboardList, 
  Calendar, 
  BarChart3, 
  Target, 
  Shield, 
  Settings, 
  HelpCircle,
  LogOut
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/journal", label: "Journal", icon: ClipboardList },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/goals", label: "Goals", icon: Target },
  { href: "/rules", label: "Rules", icon: Shield },
];

const bottomItems = [
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/help", label: "Help", icon: HelpCircle },
];

export function Sidebar({ className }: { className?: string }) {
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
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                isActive 
                  ? "bg-brand/10 text-brand border-l-2 border-brand" 
                  : "text-foreground-secondary hover:bg-background-surface hover:text-foreground-primary"
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
            className="flex items-center gap-3 px-4 py-3 text-foreground-secondary hover:bg-background-surface hover:text-foreground-primary rounded-xl transition-all"
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
      
      {/* User Profile */}
      <div className="p-3">
        <div className="flex items-center gap-3 p-3 bg-background-surface rounded-xl">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand to-accent-blue flex items-center justify-center font-bold text-white">
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
```

### 7.2 Mobile Bottom Navigation

```tsx
// src/components/navigation/mobile-nav.tsx
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, Plus, ClipboardList, Settings } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/trade/new", label: "Add", icon: Plus, isFab: true },
  { href: "/journal", label: "Journal", icon: ClipboardList },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function MobileNav({ className }: { className?: string }) {
  const pathname = usePathname();
  
  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 z-50",
      "glass border-t border-border",
      "safe-area-bottom",
      className
    )}>
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          
          if (item.isFab) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center"
              >
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
```

### 7.3 Header Component

```tsx
// src/components/navigation/header.tsx
import { Bell, Search } from "lucide-react";
import { StatusIndicator } from "@/components/ui/badge-variants";
import { IconButton } from "@/components/ui/button-variants";

export function Header() {
  return (
    <header className="sticky top-0 z-40 glass border-b border-border">
      <div className="flex items-center justify-between px-4 lg:px-6 py-4">
        {/* Left: Mobile menu / Search */}
        <div className="flex items-center gap-4">
          <IconButton 
            icon={<Search className="w-5 h-5" />} 
            variant="ghost"
            className="lg:hidden"
          />
        </div>
        
        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <StatusIndicator status="active" label="Live" />
          <IconButton 
            icon={<Bell className="w-5 h-5" />} 
            variant="secondary"
            badge={true}
          />
          {/* Avatar - Mobile only */}
          <div className="lg:hidden w-10 h-10 rounded-full bg-gradient-to-br from-brand to-accent-blue flex items-center justify-center font-bold text-white">
            DK
          </div>
        </div>
      </div>
    </header>
  );
}
```

---

## 8. Charts & Data Visualization

### 8.1 Recharts Setup

```tsx
// src/components/charts/equity-curve.tsx
"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface EquityCurveProps {
  data: Array<{
    date: string;
    value: number;
  }>;
}

export function EquityCurve({ data }: EquityCurveProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
        <XAxis 
          dataKey="date" 
          stroke="#64748b" 
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis 
          stroke="#64748b" 
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `₹${(value / 1000)}K`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#111827",
            border: "1px solid #1f2937",
            borderRadius: "12px",
            padding: "12px",
          }}
          labelStyle={{ color: "#94a3b8" }}
          formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, "Equity"]}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#10b981"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorEquity)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
```

### 8.2 P&L Bar Chart

```tsx
// src/components/charts/pnl-bars.tsx
"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface PnLBarsProps {
  data: Array<{
    day: string;
    pnl: number;
  }>;
}

export function PnLBars({ data }: PnLBarsProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
        <XAxis 
          dataKey="day" 
          stroke="#64748b" 
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis 
          stroke="#64748b" 
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `₹${value}`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#111827",
            border: "1px solid #1f2937",
            borderRadius: "12px",
            padding: "12px",
          }}
          formatter={(value: number) => [
            `${value >= 0 ? '+' : ''}₹${value.toLocaleString('en-IN')}`,
            "P&L"
          ]}
        />
        <Bar dataKey="pnl" radius={[6, 6, 0, 0]}>
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.pnl >= 0 ? "#22c55e" : "#ef4444"} 
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
```

### 8.3 Calendar Heatmap

```tsx
// src/components/charts/calendar-heatmap.tsx
"use client";

import { cn } from "@/lib/utils";

interface CalendarDay {
  date: Date;
  pnl?: number;
  trades?: number;
  isHoliday?: boolean;
}

interface CalendarHeatmapProps {
  year: number;
  month: number; // 0-indexed
  data: CalendarDay[];
  onDayClick?: (day: CalendarDay) => void;
}

export function CalendarHeatmap({ year, month, data, onDayClick }: CalendarHeatmapProps) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const today = new Date();
  
  const getColorClass = (pnl?: number) => {
    if (pnl === undefined) return "bg-background-surface";
    if (pnl > 2000) return "bg-profit opacity-100";
    if (pnl > 1000) return "bg-profit opacity-70";
    if (pnl > 0) return "bg-profit opacity-40";
    if (pnl > -1000) return "bg-loss opacity-40";
    if (pnl > -2000) return "bg-loss opacity-70";
    return "bg-loss opacity-100";
  };
  
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  return (
    <div>
      {/* Week Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-xs text-foreground-tertiary py-2">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for offset */}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}
        
        {/* Day cells */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const date = new Date(year, month, day);
          const dayData = data.find(
            (d) => d.date.toDateString() === date.toDateString()
          );
          const isToday = date.toDateString() === today.toDateString();
          
          return (
            <button
              key={day}
              onClick={() => dayData && onDayClick?.(dayData)}
              className={cn(
                "aspect-square rounded-lg p-1 flex flex-col items-center justify-center",
                "transition-all hover:ring-1 hover:ring-border-subtle",
                getColorClass(dayData?.pnl),
                isToday && "ring-2 ring-info",
                dayData?.isHoliday && "bg-background-elevated"
              )}
            >
              <span className={cn(
                "text-sm",
                isToday && "font-bold text-info"
              )}>
                {day}
              </span>
              {dayData?.pnl !== undefined && (
                <span className="text-[8px] font-medium">
                  {dayData.pnl >= 0 ? "+" : ""}
                  ₹{(Math.abs(dayData.pnl) / 1000).toFixed(1)}K
                </span>
              )}
            </button>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4 text-xs">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-profit" /> Profit
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-loss" /> Loss
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-background-surface" /> No Trade
        </span>
      </div>
    </div>
  );
}
```

---

## 9. Forms & Inputs

### 9.1 Input Components

```tsx
// src/components/ui/input-variants.tsx
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightIcon, className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm text-foreground-secondary">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-tertiary">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full bg-background-surface border border-border rounded-xl",
              "px-4 py-3 text-foreground-primary placeholder:text-foreground-tertiary",
              "transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent",
              error && "border-loss focus:ring-loss",
              leftIcon && "pl-12",
              rightIcon && "pr-12",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground-tertiary">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-sm text-loss">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
```

### 9.2 Direction Toggle

```tsx
// src/components/ui/direction-toggle.tsx
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface DirectionToggleProps {
  value: "LONG" | "SHORT";
  onChange: (value: "LONG" | "SHORT") => void;
}

export function DirectionToggle({ value, onChange }: DirectionToggleProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <button
        type="button"
        onClick={() => onChange("LONG")}
        className={cn(
          "py-3 rounded-xl border-2 font-semibold flex items-center justify-center gap-2 transition-all",
          value === "LONG"
            ? "border-profit bg-profit/10 text-profit"
            : "border-border text-foreground-secondary hover:border-profit hover:bg-profit/10 hover:text-profit"
        )}
      >
        <TrendingUp className="w-5 h-5" />
        LONG
      </button>
      <button
        type="button"
        onClick={() => onChange("SHORT")}
        className={cn(
          "py-3 rounded-xl border-2 font-semibold flex items-center justify-center gap-2 transition-all",
          value === "SHORT"
            ? "border-loss bg-loss/10 text-loss"
            : "border-border text-foreground-secondary hover:border-loss hover:bg-loss/10 hover:text-loss"
        )}
      >
        <TrendingDown className="w-5 h-5" />
        SHORT
      </button>
    </div>
  );
}
```

### 9.3 Mood Selector

```tsx
// src/components/ui/mood-selector.tsx
import { cn } from "@/lib/utils";

const moods = [
  { id: "confident", emoji: "😎", label: "Confident" },
  { id: "focused", emoji: "🎯", label: "Focused" },
  { id: "calm", emoji: "😌", label: "Calm" },
  { id: "anxious", emoji: "😰", label: "Anxious" },
  { id: "tired", emoji: "😴", label: "Tired" },
  { id: "neutral", emoji: "😐", label: "Neutral" },
];

interface MoodSelectorProps {
  value: string | null;
  onChange: (mood: string) => void;
}

export function MoodSelector({ value, onChange }: MoodSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {moods.map((mood) => (
        <button
          key={mood.id}
          type="button"
          onClick={() => onChange(mood.id)}
          className={cn(
            "p-4 rounded-xl border-2 text-center transition-all",
            value === mood.id
              ? "border-brand bg-brand/10"
              : "border-border hover:border-brand/50"
          )}
        >
          <span className="text-2xl">{mood.emoji}</span>
          <p className="text-sm mt-1">{mood.label}</p>
        </button>
      ))}
    </div>
  );
}
```

### 9.4 Rule Checkbox

```tsx
// src/components/ui/rule-checkbox.tsx
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface RuleCheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function RuleCheckbox({ id, label, checked, onChange }: RuleCheckboxProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all",
        checked
          ? "bg-brand/10 border-brand/30"
          : "bg-background-surface border-border hover:border-border-subtle"
      )}
    >
      <div
        className={cn(
          "w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all",
          checked
            ? "bg-brand border-brand"
            : "bg-transparent border-border-subtle"
        )}
      >
        {checked && <Check className="w-4 h-4 text-white" />}
      </div>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <span className={cn(
        "font-medium",
        checked ? "text-foreground-primary" : "text-foreground-secondary"
      )}>
        {label}
      </span>
    </label>
  );
}
```

---

## 10. Feedback & States

### 10.1 Toast Notifications

```tsx
// Using shadcn/ui toast with custom styling
// src/components/ui/toast-custom.tsx

import { toast as sonnerToast } from "sonner";
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";

export const toast = {
  success: (message: string) => {
    sonnerToast(message, {
      icon: <CheckCircle className="w-5 h-5 text-profit" />,
      className: "bg-background-secondary border border-profit/30 text-foreground-primary",
    });
  },
  
  error: (message: string) => {
    sonnerToast(message, {
      icon: <XCircle className="w-5 h-5 text-loss" />,
      className: "bg-background-secondary border border-loss/30 text-foreground-primary",
    });
  },
  
  warning: (message: string) => {
    sonnerToast(message, {
      icon: <AlertTriangle className="w-5 h-5 text-warning" />,
      className: "bg-background-secondary border border-warning/30 text-foreground-primary",
    });
  },
  
  info: (message: string) => {
    sonnerToast(message, {
      icon: <Info className="w-5 h-5 text-info" />,
      className: "bg-background-secondary border border-info/30 text-foreground-primary",
    });
  },
};
```

### 10.2 Loading States

```tsx
// src/components/ui/loading-states.tsx

// Skeleton Card
export function SkeletonCard() {
  return (
    <div className="bg-gradient-card rounded-2xl border border-border p-6">
      <div className="space-y-4">
        <div className="skeleton h-4 w-1/3 rounded" />
        <div className="skeleton h-8 w-1/2 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-2/3 rounded" />
      </div>
    </div>
  );
}

// Skeleton Trade Card
export function SkeletonTradeCard() {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl border border-border">
      <div className="flex items-center gap-4">
        <div className="skeleton w-10 h-10 rounded-xl" />
        <div className="space-y-2">
          <div className="skeleton h-4 w-24 rounded" />
          <div className="skeleton h-3 w-32 rounded" />
        </div>
      </div>
      <div className="space-y-2 text-right">
        <div className="skeleton h-5 w-16 rounded ml-auto" />
        <div className="skeleton h-3 w-12 rounded ml-auto" />
      </div>
    </div>
  );
}

// Full Page Loader
export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-brand border-t-transparent animate-spin" />
        <p className="text-sm text-foreground-secondary">Loading...</p>
      </div>
    </div>
  );
}
```

### 10.3 Empty States

```tsx
// src/components/ui/empty-states.tsx
import { cn } from "@/lib/utils";
import { Button } from "./button-variants";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center py-12 px-6",
      className
    )}>
      <div className="w-16 h-16 rounded-2xl bg-background-surface flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-foreground-secondary max-w-sm mb-6">{description}</p>
      {action && (
        <Button variant="primary" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
```

---

## 11. Animations

### 11.1 Page Transitions

```tsx
// src/components/animations/page-transition.tsx
"use client";

import { motion } from "framer-motion";

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
```

### 11.2 Animation Variants

```tsx
// src/lib/animations.ts

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const slideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

export const slideDown = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

export const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Transition presets
export const transitions = {
  fast: { duration: 0.15, ease: [0.16, 1, 0.3, 1] },
  normal: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
  slow: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  spring: { type: "spring", stiffness: 400, damping: 30 },
};
```

---

## 12. Responsive Design

### 12.1 Breakpoint Reference

```typescript
// Tailwind breakpoints
const breakpoints = {
  sm: "640px",   // Large phones
  md: "768px",   // Tablets
  lg: "1024px",  // Laptops
  xl: "1280px",  // Desktops
  "2xl": "1536px", // Large monitors
};

// Mobile-first approach examples:
// Default (0-639px): Mobile
// sm:  (640px+): Large phones
// md:  (768px+): Tablets - Switch from bottom nav to collapsible sidebar
// lg:  (1024px+): Laptops - Full sidebar visible
// xl:  (1280px+): Desktop - Maximum content width
```

### 12.2 Responsive Patterns

```tsx
// Grid Examples
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
  {/* Cards adapt from 1 col on mobile to 3 cols on desktop */}
</div>

// Sidebar + Content
<div className="flex min-h-screen">
  {/* Sidebar - hidden on mobile, visible on lg+ */}
  <aside className="hidden lg:flex w-[260px] ...">
    ...
  </aside>
  
  {/* Main content - full width on mobile, adjusted on lg+ */}
  <main className="flex-1 p-4 lg:p-6 pb-20 lg:pb-6">
    ...
  </main>
</div>

// Bottom nav - visible on mobile, hidden on lg+
<nav className="fixed bottom-0 lg:hidden ...">
  ...
</nav>

// Text sizing
<h1 className="text-2xl lg:text-3xl font-bold">
  Responsive Heading
</h1>

// Spacing
<div className="p-4 md:p-6 lg:p-8">
  Content with responsive padding
</div>
```

---

## 13. Accessibility

### 13.1 Focus States

```css
/* All interactive elements should have visible focus */
.focus-ring {
  @apply focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-background-primary;
}
```

### 13.2 Screen Reader

```tsx
// Always include sr-only text for icon-only buttons
<button aria-label="Close modal">
  <X className="w-5 h-5" />
  <span className="sr-only">Close modal</span>
</button>

// Live regions for dynamic content
<div role="status" aria-live="polite">
  {/* Dynamic P&L updates */}
</div>
```

### 13.3 Color Contrast

All text/background combinations meet WCAG 2.1 AA standards:
- Primary text (#f8fafc) on primary bg (#0a0f1a): 15.2:1 ✓
- Secondary text (#94a3b8) on primary bg: 7.1:1 ✓
- Profit green (#22c55e) on dark bg: 8.5:1 ✓
- Loss red (#ef4444) on dark bg: 4.8:1 ✓

---

## 14. Icons

Use Lucide React for all icons. Here's the icon mapping for TradeMind:

```tsx
// src/lib/icons.ts
import {
  Home,
  ClipboardList,
  Calendar,
  BarChart3,
  Target,
  Shield,
  Settings,
  HelpCircle,
  TrendingUp,
  TrendingDown,
  Plus,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  X,
  Check,
  Bell,
  Search,
  User,
  LogOut,
  Moon,
  Sun,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  ArrowUp,
  ArrowDown,
  DollarSign,
  Percent,
  Activity,
  Clock,
  Edit,
  Trash2,
  Save,
  Camera,
  Image,
  Rocket,
  Square,
  Play,
  Pause,
  Eye,
  EyeOff,
} from "lucide-react";

// Usage example
export const icons = {
  navigation: { Home, ClipboardList, Calendar, BarChart3, Target, Shield, Settings, HelpCircle },
  trading: { TrendingUp, TrendingDown, DollarSign, Percent, Activity },
  actions: { Plus, Edit, Trash2, Save, Camera, Image },
  feedback: { AlertTriangle, Info, CheckCircle, XCircle },
  // ... etc
};
```

---

## 15. File Structure

```
src/
├── app/
│   ├── (app)/                    # Authenticated routes
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── journal/
│   │   │   └── page.tsx
│   │   ├── calendar/
│   │   │   └── page.tsx
│   │   ├── analytics/
│   │   │   └── page.tsx
│   │   ├── goals/
│   │   │   └── page.tsx
│   │   ├── rules/
│   │   │   └── page.tsx
│   │   ├── settings/
│   │   │   └── page.tsx
│   │   ├── trade/
│   │   │   ├── new/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── ritual/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (auth)/                   # Authentication routes
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   ├── onboarding/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                  # Landing/Splash
├── components/
│   ├── ui/                       # Base UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── badge.tsx
│   │   ├── dialog.tsx
│   │   ├── toast.tsx
│   │   └── ... (shadcn components)
│   ├── navigation/               # Navigation components
│   │   ├── sidebar.tsx
│   │   ├── mobile-nav.tsx
│   │   └── header.tsx
│   ├── dashboard/                # Dashboard-specific
│   │   ├── hero-pnl-card.tsx
│   │   ├── risk-monitor.tsx
│   │   ├── target-progress.tsx
│   │   └── quick-stats.tsx
│   ├── trades/                   # Trade components
│   │   ├── trade-card.tsx
│   │   ├── trade-form.tsx
│   │   └── trade-list.tsx
│   ├── charts/                   # Chart components
│   │   ├── equity-curve.tsx
│   │   ├── pnl-bars.tsx
│   │   ├── calendar-heatmap.tsx
│   │   └── win-rate-donut.tsx
│   ├── ritual/                   # Ritual components
│   │   ├── rule-checkbox.tsx
│   │   ├── mood-selector.tsx
│   │   └── risk-summary.tsx
│   └── animations/               # Animation components
│       └── page-transition.tsx
├── lib/
│   ├── utils.ts                  # cn() and utilities
│   ├── tokens.ts                 # Design tokens
│   ├── animations.ts             # Animation variants
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   └── constants.ts              # App constants
├── hooks/
│   ├── use-trades.ts
│   ├── use-user.ts
│   ├── use-settings.ts
│   └── use-theme.ts
├── store/
│   ├── trade-store.ts
│   ├── user-store.ts
│   └── app-store.ts
├── types/
│   ├── trade.ts
│   ├── user.ts
│   └── settings.ts
└── styles/
    └── fonts.ts
```

---

## Quick Reference Card

### Colors (Most Used)
```
bg-background-primary     #0a0f1a   Main background
bg-background-secondary   #111827   Cards
bg-background-surface     #242d3d   Inputs, hovers
text-foreground-primary   #f8fafc   Headlines
text-foreground-secondary #94a3b8   Body text
text-foreground-tertiary  #64748b   Captions
text-profit              #22c55e   Green
text-loss                #ef4444   Red
text-brand               #10b981   Accent
border-border            #1f2937   Default border
```

### Sizing (Most Used)
```
rounded-xl               12px
rounded-2xl              16px
p-4                      16px
p-6                      24px
gap-4                    16px
gap-6                    24px
h-10 w-10                40px (icon buttons)
h-12                     48px (input height)
```

### Typography (Most Used)
```
text-2xl font-bold       24px Headlines
text-xl font-semibold    20px Section titles
text-lg font-semibold    18px Card titles
text-sm                  14px Body text
text-xs                  12px Captions
font-mono                Monospace for numbers
```

---

This document provides everything needed to build TradeMind with consistent, professional UI. Follow these guidelines for every component and page.
