# TradeMind Spec - ERRATA & OVERRIDES

**⚠️ IMPORTANT: Read this BEFORE using trademind-spec.md**

The original `trademind-spec.md` contains excellent feature descriptions and business logic, BUT some technical details are outdated. Use these overrides:

---

## 1. Tech Stack Override

**❌ Original (Line 9):**
```
React + TypeScript + Tailwind CSS + shadcn/ui + Supabase
```

**✅ Use Instead:**
```
Next.js 14 (App Router) + TypeScript + Tailwind CSS + shadcn/ui + Supabase + Recharts + Framer Motion + Zustand
```

---

## 2. Color Palette Override

**❌ Original (Lines 1073-1100):** Uses blue (#2563eb) as primary

**✅ Use Instead - "Disciplined Dark" Theme:**
```css
/* Backgrounds */
--background-primary: #0a0f1a;
--background-secondary: #111827;
--background-tertiary: #1a2332;
--background-surface: #242d3d;

/* Brand/Accent */
--brand: #10b981;           /* Emerald - Primary accent */
--brand-hover: #059669;

/* Semantic */
--profit: #22c55e;          /* Green */
--loss: #ef4444;            /* Red */
--warning: #f59e0b;         /* Amber */
--info: #3b82f6;            /* Blue */

/* Text */
--foreground-primary: #f8fafc;
--foreground-secondary: #94a3b8;
--foreground-tertiary: #64748b;

/* Border */
--border: #1f2937;
```

---

## 3. File Structure Override

**❌ Original (Lines 975-1010):** Uses `pages/` directory

**✅ Use Instead - Next.js 14 App Router:**
```
src/
├── app/
│   ├── (app)/                    # Authenticated routes
│   │   ├── dashboard/page.tsx
│   │   ├── journal/page.tsx
│   │   ├── calendar/page.tsx
│   │   ├── analytics/page.tsx
│   │   ├── goals/page.tsx
│   │   ├── rules/page.tsx
│   │   ├── settings/page.tsx
│   │   ├── trade/
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── ritual/page.tsx
│   │   └── layout.tsx
│   ├── (auth)/                   # Auth routes
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── layout.tsx
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── ui/                       # shadcn + custom components
│   ├── navigation/               # Sidebar, MobileNav, Header
│   ├── dashboard/                # Dashboard-specific
│   ├── trades/                   # Trade components
│   └── charts/                   # Chart components
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   └── utils.ts
├── hooks/
├── store/
└── types/
```

---

## 4. Database Schema Override

**❌ Original:** Complex schema with `trading_days`, triggers, functions

**✅ Use Instead - Simplified Schema:**

```sql
-- Profiles (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  trading_capital DECIMAL(15,2) DEFAULT 100000,
  daily_loss_limit DECIMAL(15,2) DEFAULT 5000,
  per_trade_risk DECIMAL(15,2) DEFAULT 1000,
  max_trades_per_day INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trading Rules
CREATE TABLE trading_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  rule_text TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily Sessions (replaces trading_days)
CREATE TABLE daily_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_date DATE NOT NULL,
  pre_market_mood TEXT,
  rules_checked JSONB DEFAULT '[]',
  session_started_at TIMESTAMPTZ,
  session_ended_at TIMESTAMPTZ,
  end_of_day_notes TEXT,
  end_of_day_mood TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, session_date)
);

-- Trades
CREATE TABLE trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_id UUID REFERENCES daily_sessions(id),
  symbol TEXT NOT NULL,
  direction TEXT CHECK (direction IN ('LONG', 'SHORT')),
  quantity INTEGER NOT NULL,
  entry_price DECIMAL(15,2) NOT NULL,
  exit_price DECIMAL(15,2),
  stop_loss DECIMAL(15,2),
  target_price DECIMAL(15,2),
  pnl DECIMAL(15,2),
  pnl_percent DECIMAL(8,4),
  fees DECIMAL(10,2) DEFAULT 0,
  setup_type TEXT,
  notes TEXT,
  screenshot_url TEXT,
  entry_time TIMESTAMPTZ NOT NULL,
  exit_time TIMESTAMPTZ,
  status TEXT DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'CLOSED', 'CANCELLED')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Goals
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  goal_type TEXT CHECK (goal_type IN ('daily', 'weekly', 'monthly')),
  target_amount DECIMAL(15,2),
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 5. What to USE from Original Spec

These sections are still valid and should be referenced:

| Section | Lines | Use For |
|---------|-------|---------|
| Core Philosophy | 13-24 | App purpose and principles |
| Feature Specifications | 26-400 | Feature details and user flows |
| Trade Entry Fields | 173-188 | Form field requirements |
| Analytics Calculations | 250-350 | Statistics formulas |
| Default Trading Rules | 58-65 | Pre-populated rules |
| Alert System | 164-168 | Notification triggers |
| OCR Feature (Phase 3) | 194-240 | Future screenshot parsing |
| Zerodha Integration | 1048-1070 | Future API integration |

---

## 6. Document Priority for Claude Code

When building, prioritize documents in this order:

1. **TRADEMIND-UI-GUIDELINES.md** - Primary implementation reference
2. **TRADEMIND-SPEC-ERRATA.md** - This file (overrides)
3. **trademind-spec.md** - Feature descriptions only

---

## Summary

| Aspect | Use Original Spec? | Use UI Guidelines? |
|--------|-------------------|-------------------|
| Feature descriptions | ✅ Yes | - |
| Business logic | ✅ Yes | - |
| User flows | ✅ Yes | - |
| Tech stack | ❌ No | ✅ Yes |
| Color palette | ❌ No | ✅ Yes |
| File structure | ❌ No | ✅ Yes |
| Database schema | ❌ No | ✅ Yes |
| Component code | ❌ No | ✅ Yes |
