# TradeMind - Trading Discipline & Performance Tracker

## Project Overview

**App Name:** TradeMind  
**Purpose:** A web application to help intraday traders maintain discipline, track performance, manage risk, and improve consistency.  
**Target User:** Indian stock market intraday traders using Zerodha and Groww  
**Platform:** Responsive web app (mobile + desktop)  
**Tech Stack:** React + TypeScript + Tailwind CSS + shadcn/ui + Supabase  

---

## Core Philosophy

> "Discipline is the bridge between trading goals and trading results."

TradeMind is designed to:
1. **Reinforce Discipline** - Daily ritual before trading
2. **Manage Risk** - Real-time limit tracking
3. **Track Performance** - Comprehensive analytics
4. **Enable Learning** - Journal and review system
5. **Build Consistency** - Goal setting and accountability

---

## Feature Specifications

### 1. Authentication System

**Provider:** Supabase Auth

- Email/Password signup and login
- Password reset functionality
- Session management
- Protected routes for authenticated users

### 2. Onboarding Flow (First-time Users)

**Step 1: Profile Setup**
- Full Name
- Starting Capital (₹)

**Step 2: Risk Limits Configuration**
- Max Daily Loss (₹)
- Max Loss Per Trade (₹)
- Max Trades Per Day (optional)

**Step 3: Trading Rules Setup**
- Pre-populated with 7 default rules (editable)
- Option to add custom rules
- Drag-and-drop reordering

**Step 4: Goals Setup**
- Daily Profit Target (₹)
- Weekly Profit Target (₹)
- Monthly Profit Target (₹)

**Default Trading Rules:**
1. Risk Management First - Never risk more than defined limits
2. Always Honor Stop Loss - No moving SL against the trade
3. Proper Position Sizing - Size based on SL distance, not conviction
4. Be Agile in Booking Profits - Don't be greedy, book partial profits
5. Never Let a Winner Turn into a Loser - Trail SL to breakeven
6. Be Patient - Wait for Proper Entry - No FOMO trades
7. Stick to Daily/Weekly/Monthly Targets - Stop when target achieved

### 3. Daily Discipline Ritual (Home Screen - Pre-Trading)

**Purpose:** Mental preparation before market opens

**Components:**

#### 3.1 Motivational Quote Card
- Rotating trading wisdom quotes
- Examples:
  - "The goal of a successful trader is to make the best trades. Money is secondary." - Alexander Elder
  - "In trading, the impossible happens about twice a year." - Henri M Simoes
  - "Risk comes from not knowing what you're doing." - Warren Buffett

#### 3.2 Trading Rules Checklist
- Display all active trading rules
- Each rule has a checkbox
- User must check all rules to acknowledge
- Visual indicator: ✅ Acknowledged / ⬜ Pending

#### 3.3 Risk Limits Display Card
```
┌─────────────────────────────────────┐
│  📊 TODAY'S RISK LIMITS             │
├─────────────────────────────────────┤
│  Max Daily Loss    │  ₹ 5,000       │
│  Max Per Trade     │  ₹ 1,000       │
│  Max Trades        │  10            │
├─────────────────────────────────────┤
│  Capital at Risk   │  ₹ 1,00,000    │
└─────────────────────────────────────┘
```

#### 3.4 Pre-Market Mood Selector
- How are you feeling today?
- Options: 😊 Confident | 😐 Neutral | 😰 Anxious | 😤 Aggressive | 🧘 Calm

#### 3.5 Market Notes (Optional)
- Text area for pre-market observations
- Market sentiment, key levels, etc.

#### 3.6 "I Am Ready to Trade" Button
- Large, prominent button
- Only enabled after all rules acknowledged
- Creates a new trading_day record
- Timestamp recorded

### 4. Live Trading Dashboard

**Purpose:** Real-time monitoring during market hours

#### 4.1 Today's P&L Card (Hero Card)
```
┌─────────────────────────────────────────┐
│            TODAY'S P&L                  │
│                                         │
│         ₹ +2,450                        │
│         ▲ 2.45% ROI                     │
│                                         │
│  Trades: 5  |  Won: 4  |  Lost: 1       │
│  Hit Ratio: 80%                         │
└─────────────────────────────────────────┘
Green background for profit, Red for loss
```

#### 4.2 Risk Meter
```
Daily Loss Limit: ₹5,000
┌─────────────────────────────────────┐
│ Used: ₹800 (16%)                    │
│ [████░░░░░░░░░░░░░░░░░░░░░░░░░░░░] │
│ ✅ Safe Zone                        │
└─────────────────────────────────────┘

Zones:
- 0-50%: Green (Safe)
- 50-75%: Yellow (Caution)
- 75-100%: Red (Danger)
- >100%: Dark Red (STOP TRADING!)
```

#### 4.3 Quick Stats Row
- Total Trades Today
- Winning Trades
- Losing Trades
- Best Trade (₹)
- Worst Trade (₹)

#### 4.4 Target Progress
```
Daily Target: ₹3,000
┌─────────────────────────────────────┐
│ Achieved: ₹2,450 (81.67%)           │
│ [████████████████████░░░░░░░░░░░░] │
└─────────────────────────────────────┘
```

#### 4.5 Alert System
- Toast notifications for:
  - 50% of daily loss limit reached (Yellow warning)
  - 75% of daily loss limit reached (Red warning)
  - 100% of daily loss limit reached (Modal: STOP TRADING)
  - Daily target achieved (Green celebration)

### 5. Trade Journal

#### 5.1 Manual Trade Entry Form

**Fields:**
- Date (default: today)
- Time (HH:MM)
- Symbol (text input with suggestions)
- Trade Type: LONG / SHORT
- Quantity
- Entry Price (₹)
- Exit Price (₹)
- P&L (auto-calculated)
- Broker: Zerodha / Groww / Other
- Emotion Before Trade: Confident / Fearful / FOMO / Revenge / Planned / Impulsive
- Emotion After Trade: Satisfied / Regretful / Relieved / Frustrated / Learning
- Notes / Learning (text area)
- Screenshot Upload (optional)

**Auto-calculations:**
- P&L = (Exit Price - Entry Price) × Quantity (for LONG)
- P&L = (Entry Price - Exit Price) × Quantity (for SHORT)
- Is Winner = P&L > 0

#### 5.2 Screenshot Upload & OCR (Phase 3)

**Flow:**
1. User uploads screenshot from Zerodha/Groww
2. Image stored in Supabase Storage
3. Edge Function processes image with AI Vision
4. Extracted data shown for review:
   - Symbol
   - Quantity
   - Avg Buy Price
   - Avg Sell Price
   - P&L
5. User confirms or edits
6. Trade entry created

**Supported Formats:**
- Zerodha Kite positions page
- Zerodha Kite order book
- Groww positions page
- Groww order history

#### 5.3 Trade History List

**Display:**
- Filterable by date range
- Sortable by date, P&L, symbol
- Each trade shows:
  - Symbol + Type badge (LONG/SHORT)
  - Entry → Exit prices
  - P&L (colored green/red)
  - Time
  - Quick notes preview
- Click to expand full details
- Edit and Delete options

### 6. Calendar View (Monthly P&L Overview)

**Purpose:** Visual representation of trading performance

#### 6.1 Monthly Calendar Grid
```
┌─────────────────────────────────────────────────────────────────┐
│  ◀  JANUARY 2026  ▶                                            │
├─────────┬─────────┬─────────┬─────────┬─────────┬──────┬──────┤
│   Mon   │   Tue   │   Wed   │   Thu   │   Fri   │ Sat  │ Sun  │
├─────────┼─────────┼─────────┼─────────┼─────────┼──────┼──────┤
│         │         │    1    │    2    │    3    │   4  │   5  │
│         │         │  🟩     │  🟩     │  🟥     │      │      │
│         │         │ +2,450  │ +1,800  │  -950   │      │      │
├─────────┼─────────┼─────────┼─────────┼─────────┼──────┼──────┤
│    6    │    7    │    8    │    9    │   10    │  11  │  12  │
│  🟩     │  🟥     │  🟩     │  ⬜     │  🟩     │      │      │
│ +3,200  │  -400   │ +1,500  │    0    │ +2,100  │      │      │
├─────────┼─────────┼─────────┼─────────┼─────────┼──────┼──────┤
│   ...   │         │         │         │         │      │      │
└─────────┴─────────┴─────────┴─────────┴─────────┴──────┴──────┘

Legend: 🟩 Profit Day | 🟥 Loss Day | ⬜ Breakeven | Empty = No Trading
```

**Card Colors:**
- Green gradient: Profit (intensity based on amount)
- Red gradient: Loss (intensity based on amount)
- Gray: Breakeven (±₹100)
- No color: No trading / Weekend / Holiday

**Click on Day:**
- Opens day detail modal
- Shows all trades for that day
- Day summary stats

#### 6.2 Monthly Summary Bar
```
┌─────────────────────────────────────────────────────────────────┐
│  January 2026 Summary                                           │
├─────────────────────────────────────────────────────────────────┤
│  Total P&L: ₹15,700  │  Trading Days: 18  │  Hit Ratio: 72%    │
│  Green Days: 13      │  Red Days: 5       │  ROI: 7.85%        │
│  Best Day: ₹3,200    │  Worst Day: -₹950  │  Target: 65% ✅    │
└─────────────────────────────────────────────────────────────────┘
```

#### 6.3 Week View Toggle
- Option to view as weekly cards instead of monthly calendar
- Each week as a horizontal card showing 5 trading days

### 7. Analytics Dashboard

#### 7.1 Performance Overview Cards

**Row 1: P&L Summary**
```
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  Today       │ │  This Week   │ │  This Month  │ │  All Time    │
│  ₹ +2,450    │ │  ₹ +8,700    │ │  ₹ +15,700   │ │  ₹ +45,200   │
│  ▲ 2.45%     │ │  ▲ 4.35%     │ │  ▲ 7.85%     │ │  ▲ 22.6%     │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

**Row 2: Trading Statistics**
```
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  Hit Ratio   │ │  Avg Profit  │ │  Avg Loss    │ │  RR Ratio    │
│    68%       │ │  ₹ 1,850     │ │  ₹ -720      │ │   2.57:1     │
│  ▲ from 65%  │ │  per winner  │ │  per loser   │ │  Excellent   │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

**Row 3: Extremes**
```
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  Max Profit  │ │  Max Loss    │ │  Best Day    │ │  Worst Day   │
│  ₹ +4,200    │ │  ₹ -1,800    │ │  ₹ +5,500    │ │  ₹ -2,100    │
│  RELIANCE    │ │  BANKNIFTY   │ │  Jan 15      │ │  Dec 28      │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

#### 7.2 Charts

**Chart 1: Cumulative P&L Curve**
- Line chart showing equity curve over time
- X-axis: Dates
- Y-axis: Cumulative P&L
- Benchmark line at 0

**Chart 2: Daily P&L Bar Chart**
- Bar chart with green (profit) and red (loss) bars
- Last 30 days or custom range

**Chart 3: Win Rate Trend**
- Line chart showing hit ratio over weeks/months
- Target line overlay

**Chart 4: Trade Distribution**
- Pie chart: Wins vs Losses
- Histogram: P&L distribution

**Chart 5: Performance by Day of Week**
- Bar chart showing avg P&L by Monday, Tuesday, etc.
- Identify best/worst trading days

**Chart 6: Performance by Time of Day** (if time tracked)
- Bar chart showing P&L by market session
- Morning (9:15-11:00), Midday (11:00-1:30), Afternoon (1:30-3:30)

#### 7.3 Statistics Table

| Metric | Today | Week | Month | All Time |
|--------|-------|------|-------|----------|
| Total P&L | ₹2,450 | ₹8,700 | ₹15,700 | ₹45,200 |
| Total Trades | 5 | 28 | 95 | 380 |
| Winning Trades | 4 | 19 | 65 | 258 |
| Losing Trades | 1 | 9 | 30 | 122 |
| Hit Ratio | 80% | 68% | 68% | 68% |
| Avg Profit | ₹750 | ₹680 | ₹710 | ₹695 |
| Avg Loss | ₹350 | ₹420 | ₹390 | ₹405 |
| Max Profit | ₹1,200 | ₹2,100 | ₹4,200 | ₹4,200 |
| Max Loss | ₹350 | ₹800 | ₹1,800 | ₹1,800 |
| Risk-Reward | 2.14:1 | 1.62:1 | 1.82:1 | 1.72:1 |
| ROI | 2.45% | 4.35% | 7.85% | 22.6% |
| Profit Factor | 8.57 | 2.13 | 2.27 | 2.15 |

### 8. Goals & Targets

#### 8.1 Goal Setting Panel

**Daily Goal:**
- Target P&L: ₹___
- Max Acceptable Loss: ₹___

**Weekly Goal:**
- Target P&L: ₹___
- Min Trading Days: ___

**Monthly Goal:**
- Target P&L: ₹___
- Target Hit Ratio: ___%
- Target ROI: ___%

#### 8.2 Goal Progress Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│  🎯 GOAL PROGRESS                                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Daily Target: ₹3,000                                          │
│  [████████████████████████████████░░░░░░░░░░] 81.7%            │
│  ₹2,450 / ₹3,000                                               │
│                                                                 │
│  Weekly Target: ₹15,000                                        │
│  [████████████████████████░░░░░░░░░░░░░░░░░░] 58%              │
│  ₹8,700 / ₹15,000                                              │
│                                                                 │
│  Monthly Target: ₹50,000                                       │
│  [██████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] 31.4%            │
│  ₹15,700 / ₹50,000                                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### 8.3 Goal Achievement History
- Calendar/list view of goal achievements
- Streak tracking: Consecutive days/weeks of goal achievement
- Badges/Achievements for milestones

### 9. Review System

#### 9.1 Weekly Review (Prompted every Sunday)

**Auto-populated Data:**
- Week dates
- Total P&L
- Total trades
- Win/Loss count
- Hit ratio
- Best/Worst day
- Goal achievement status

**User Input Fields:**
- What worked well this week? (text area)
- What didn't work? (text area)
- Did you violate any rules? Which ones? (text area)
- Key learnings (text area)
- Plan for next week (text area)
- Self-discipline rating (1-10 slider)

#### 9.2 Monthly Review (Prompted at month end)

**Auto-populated Data:**
- Complete month statistics
- Week-by-week breakdown
- Goal vs Actual comparison
- Best/Worst weeks

**User Input Fields:**
- Performance summary (text area)
- Key insights gained (text area)
- Strategy adjustments for next month (text area)
- Areas to improve (text area)
- Overall satisfaction rating (1-10)

#### 9.3 Review History
- List of all past reviews
- Searchable and filterable
- Export option

### 10. Settings

#### 10.1 Profile Settings
- Name
- Email
- Password change
- Account deletion

#### 10.2 Trading Configuration
- Starting Capital
- Current Capital (manual adjustment)
- Broker accounts (for reference)

#### 10.3 Risk Limits
- Max Daily Loss (₹)
- Max Loss Per Trade (₹)
- Max Trades Per Day
- Warning thresholds (50%, 75%)

#### 10.4 Trading Rules
- View all rules
- Add new rule
- Edit existing rules
- Reorder rules (drag-drop)
- Activate/Deactivate rules
- Delete rules

#### 10.5 Goals Configuration
- Daily target
- Weekly target
- Monthly target
- Target hit ratio
- Target ROI

#### 10.6 Appearance
- Theme toggle: Light / Dark / System
- Accent color selection (optional)

#### 10.7 Notifications
- Enable/disable alert notifications
- Email summary (daily/weekly) - future

#### 10.8 Data Management
- Export all data (JSON/CSV)
- Export trades to Excel
- Generate PDF report
- Import data (future)
- Clear all data (with confirmation)

### 11. Export Features

#### 11.1 Excel Export
**Trade Log Export:**
- Date, Time, Symbol, Type, Qty, Entry, Exit, P&L, Notes
- Filters: Date range, Broker, Win/Loss

**Daily Summary Export:**
- Date, P&L, Trades, Wins, Losses, Hit Ratio, ROI

**Monthly Report Export:**
- All statistics in formatted Excel

#### 11.2 PDF Report
- Professional formatted report
- Selected date range
- Includes charts and statistics
- Branding: TradeMind logo

---

## Database Schema (Supabase PostgreSQL)

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    starting_capital DECIMAL(12, 2) DEFAULT 100000,
    current_capital DECIMAL(12, 2) DEFAULT 100000,
    max_daily_loss DECIMAL(10, 2) DEFAULT 5000,
    max_trade_loss DECIMAL(10, 2) DEFAULT 1000,
    max_trades_per_day INTEGER DEFAULT 10,
    daily_target DECIMAL(10, 2) DEFAULT 3000,
    weekly_target DECIMAL(10, 2) DEFAULT 15000,
    monthly_target DECIMAL(10, 2) DEFAULT 50000,
    target_hit_ratio DECIMAL(5, 2) DEFAULT 60,
    target_roi DECIMAL(5, 2) DEFAULT 5,
    theme TEXT DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
    onboarding_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trading Rules
CREATE TABLE public.trading_rules (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    rule_order INTEGER NOT NULL,
    rule_text TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trading Days (Daily Sessions)
CREATE TABLE public.trading_days (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    opening_capital DECIMAL(12, 2),
    closing_capital DECIMAL(12, 2),
    total_pnl DECIMAL(10, 2) DEFAULT 0,
    total_trades INTEGER DEFAULT 0,
    winning_trades INTEGER DEFAULT 0,
    losing_trades INTEGER DEFAULT 0,
    max_profit DECIMAL(10, 2) DEFAULT 0,
    max_loss DECIMAL(10, 2) DEFAULT 0,
    hit_ratio DECIMAL(5, 2) DEFAULT 0,
    roi_percent DECIMAL(5, 2) DEFAULT 0,
    pre_market_mood TEXT,
    pre_market_notes TEXT,
    post_market_notes TEXT,
    discipline_score INTEGER CHECK (discipline_score >= 1 AND discipline_score <= 10),
    rules_acknowledged BOOLEAN DEFAULT FALSE,
    rules_acknowledged_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- Individual Trades
CREATE TABLE public.trades (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    trading_day_id UUID REFERENCES public.trading_days(id) ON DELETE CASCADE,
    trade_date DATE NOT NULL,
    trade_time TIME,
    symbol TEXT NOT NULL,
    trade_type TEXT NOT NULL CHECK (trade_type IN ('LONG', 'SHORT')),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    entry_price DECIMAL(10, 2) NOT NULL,
    exit_price DECIMAL(10, 2),
    pnl DECIMAL(10, 2),
    is_winner BOOLEAN,
    is_closed BOOLEAN DEFAULT FALSE,
    broker TEXT DEFAULT 'ZERODHA' CHECK (broker IN ('ZERODHA', 'GROWW', 'OTHER')),
    emotion_before TEXT,
    emotion_after TEXT,
    notes TEXT,
    screenshot_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Weekly Reviews
CREATE TABLE public.weekly_reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    week_start DATE NOT NULL,
    week_end DATE NOT NULL,
    total_pnl DECIMAL(10, 2),
    total_trades INTEGER,
    winning_trades INTEGER,
    losing_trades INTEGER,
    hit_ratio DECIMAL(5, 2),
    goal_achieved BOOLEAN,
    what_worked TEXT,
    what_didnt_work TEXT,
    rule_violations TEXT,
    key_learnings TEXT,
    next_week_plan TEXT,
    discipline_rating INTEGER CHECK (discipline_rating >= 1 AND discipline_rating <= 10),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, week_start)
);

-- Monthly Reviews
CREATE TABLE public.monthly_reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
    year INTEGER NOT NULL,
    total_pnl DECIMAL(12, 2),
    total_trades INTEGER,
    winning_trades INTEGER,
    losing_trades INTEGER,
    hit_ratio DECIMAL(5, 2),
    avg_profit DECIMAL(10, 2),
    avg_loss DECIMAL(10, 2),
    max_profit DECIMAL(10, 2),
    max_loss DECIMAL(10, 2),
    roi_percent DECIMAL(5, 2),
    trading_days INTEGER,
    green_days INTEGER,
    red_days INTEGER,
    goal_achieved BOOLEAN,
    performance_summary TEXT,
    key_insights TEXT,
    strategy_adjustments TEXT,
    areas_to_improve TEXT,
    satisfaction_rating INTEGER CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 10),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, month, year)
);

-- Motivational Quotes
CREATE TABLE public.quotes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    quote_text TEXT NOT NULL,
    author TEXT,
    category TEXT DEFAULT 'general',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Screenshots for OCR processing
CREATE TABLE public.trade_screenshots (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    trade_id UUID REFERENCES public.trades(id) ON DELETE SET NULL,
    file_path TEXT NOT NULL,
    file_name TEXT,
    broker TEXT,
    extracted_data JSONB,
    is_processed BOOLEAN DEFAULT FALSE,
    processing_error TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trading_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trading_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trade_screenshots ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only see and edit their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Trading Rules: Users can only see and manage their own rules
CREATE POLICY "Users can view own rules" ON public.trading_rules
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own rules" ON public.trading_rules
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own rules" ON public.trading_rules
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own rules" ON public.trading_rules
    FOR DELETE USING (auth.uid() = user_id);

-- Trading Days: Users can only see and manage their own trading days
CREATE POLICY "Users can view own trading days" ON public.trading_days
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own trading days" ON public.trading_days
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own trading days" ON public.trading_days
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own trading days" ON public.trading_days
    FOR DELETE USING (auth.uid() = user_id);

-- Trades: Users can only see and manage their own trades
CREATE POLICY "Users can view own trades" ON public.trades
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own trades" ON public.trades
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own trades" ON public.trades
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own trades" ON public.trades
    FOR DELETE USING (auth.uid() = user_id);

-- Weekly Reviews: Users can only see and manage their own reviews
CREATE POLICY "Users can view own weekly reviews" ON public.weekly_reviews
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own weekly reviews" ON public.weekly_reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own weekly reviews" ON public.weekly_reviews
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own weekly reviews" ON public.weekly_reviews
    FOR DELETE USING (auth.uid() = user_id);

-- Monthly Reviews: Users can only see and manage their own reviews
CREATE POLICY "Users can view own monthly reviews" ON public.monthly_reviews
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own monthly reviews" ON public.monthly_reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own monthly reviews" ON public.monthly_reviews
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own monthly reviews" ON public.monthly_reviews
    FOR DELETE USING (auth.uid() = user_id);

-- Screenshots: Users can only see and manage their own screenshots
CREATE POLICY "Users can view own screenshots" ON public.trade_screenshots
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own screenshots" ON public.trade_screenshots
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own screenshots" ON public.trade_screenshots
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own screenshots" ON public.trade_screenshots
    FOR DELETE USING (auth.uid() = user_id);

-- Quotes: Anyone can read quotes
CREATE POLICY "Anyone can view quotes" ON public.quotes
    FOR SELECT USING (true);

-- Functions

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update trading day statistics
CREATE OR REPLACE FUNCTION public.update_trading_day_stats(p_trading_day_id UUID)
RETURNS VOID AS $$
DECLARE
    v_stats RECORD;
    v_opening_capital DECIMAL(12, 2);
BEGIN
    -- Get aggregated stats from trades
    SELECT 
        COUNT(*) as total_trades,
        COUNT(*) FILTER (WHERE is_winner = true) as winning_trades,
        COUNT(*) FILTER (WHERE is_winner = false) as losing_trades,
        COALESCE(SUM(pnl), 0) as total_pnl,
        COALESCE(MAX(pnl) FILTER (WHERE pnl > 0), 0) as max_profit,
        COALESCE(MIN(pnl) FILTER (WHERE pnl < 0), 0) as max_loss
    INTO v_stats
    FROM public.trades
    WHERE trading_day_id = p_trading_day_id AND is_closed = true;

    -- Get opening capital
    SELECT opening_capital INTO v_opening_capital
    FROM public.trading_days
    WHERE id = p_trading_day_id;

    -- Update trading day
    UPDATE public.trading_days
    SET 
        total_trades = v_stats.total_trades,
        winning_trades = v_stats.winning_trades,
        losing_trades = v_stats.losing_trades,
        total_pnl = v_stats.total_pnl,
        max_profit = v_stats.max_profit,
        max_loss = v_stats.max_loss,
        hit_ratio = CASE 
            WHEN v_stats.total_trades > 0 
            THEN ROUND((v_stats.winning_trades::DECIMAL / v_stats.total_trades) * 100, 2)
            ELSE 0 
        END,
        roi_percent = CASE 
            WHEN v_opening_capital > 0 
            THEN ROUND((v_stats.total_pnl / v_opening_capital) * 100, 2)
            ELSE 0 
        END,
        closing_capital = v_opening_capital + v_stats.total_pnl,
        updated_at = NOW()
    WHERE id = p_trading_day_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update stats when trade is modified
CREATE OR REPLACE FUNCTION public.trigger_update_trading_day_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        IF OLD.trading_day_id IS NOT NULL THEN
            PERFORM public.update_trading_day_stats(OLD.trading_day_id);
        END IF;
        RETURN OLD;
    ELSE
        IF NEW.trading_day_id IS NOT NULL THEN
            PERFORM public.update_trading_day_stats(NEW.trading_day_id);
        END IF;
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_trade_change
    AFTER INSERT OR UPDATE OR DELETE ON public.trades
    FOR EACH ROW EXECUTE FUNCTION public.trigger_update_trading_day_stats();

-- Insert default quotes
INSERT INTO public.quotes (quote_text, author, category) VALUES
('The goal of a successful trader is to make the best trades. Money is secondary.', 'Alexander Elder', 'mindset'),
('In trading, the impossible happens about twice a year.', 'Henri M Simoes', 'risk'),
('Risk comes from not knowing what you are doing.', 'Warren Buffett', 'risk'),
('The market can remain irrational longer than you can remain solvent.', 'John Maynard Keynes', 'risk'),
('It is not about being right or wrong, but about how much you make when you are right and how much you lose when you are wrong.', 'George Soros', 'risk'),
('The elements of good trading are: cutting losses, cutting losses, and cutting losses.', 'Ed Seykota', 'discipline'),
('Do not focus on making money; focus on protecting what you have.', 'Paul Tudor Jones', 'risk'),
('The most important thing in trading is not how much you make, but how much you do not lose.', 'Unknown', 'risk'),
('Discipline is the bridge between goals and accomplishment.', 'Jim Rohn', 'discipline'),
('Plan your trade and trade your plan.', 'Unknown', 'discipline'),
('The trend is your friend until the end when it bends.', 'Ed Seykota', 'strategy'),
('Markets are never wrong – opinions often are.', 'Jesse Livermore', 'mindset'),
('Every day I assume every position I have is wrong.', 'Paul Tudor Jones', 'risk'),
('Losers average losers.', 'Paul Tudor Jones', 'discipline'),
('The hard work in trading comes in the preparation. The actual process of trading should be effortless.', 'Jack Schwager', 'discipline');

-- Create indexes for better performance
CREATE INDEX idx_trades_user_date ON public.trades(user_id, trade_date);
CREATE INDEX idx_trades_trading_day ON public.trades(trading_day_id);
CREATE INDEX idx_trading_days_user_date ON public.trading_days(user_id, date);
CREATE INDEX idx_weekly_reviews_user_date ON public.weekly_reviews(user_id, week_start);
CREATE INDEX idx_monthly_reviews_user_date ON public.monthly_reviews(user_id, year, month);
```

---

## UI Component Structure

```
src/
├── components/
│   ├── ui/                     # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── slider.tsx
│   │   ├── toast.tsx
│   │   └── ...
│   │
│   ├── layout/
│   │   ├── Header.tsx          # App header with navigation
│   │   ├── Sidebar.tsx         # Desktop sidebar navigation
│   │   ├── MobileNav.tsx       # Mobile bottom navigation
│   │   ├── Layout.tsx          # Main layout wrapper
│   │   └── ThemeToggle.tsx     # Dark/Light mode toggle
│   │
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   ├── ForgotPassword.tsx
│   │   └── ProtectedRoute.tsx
│   │
│   ├── onboarding/
│   │   ├── OnboardingWizard.tsx
│   │   ├── ProfileStep.tsx
│   │   ├── RiskLimitsStep.tsx
│   │   ├── TradingRulesStep.tsx
│   │   └── GoalsStep.tsx
│   │
│   ├── dashboard/
│   │   ├── DisciplineRitual.tsx    # Pre-trading checklist
│   │   ├── QuoteCard.tsx           # Motivational quote
│   │   ├── RulesChecklist.tsx      # Trading rules with checkboxes
│   │   ├── RiskLimitsCard.tsx      # Today's limits display
│   │   ├── MoodSelector.tsx        # Pre-market mood
│   │   ├── ReadyToTradeButton.tsx  # Confirmation button
│   │   ├── TodayPnLCard.tsx        # Hero P&L display
│   │   ├── RiskMeter.tsx           # Visual risk indicator
│   │   ├── QuickStats.tsx          # Stats row
│   │   └── TargetProgress.tsx      # Goal progress bars
│   │
│   ├── journal/
│   │   ├── TradeEntryForm.tsx      # Manual trade entry
│   │   ├── ScreenshotUpload.tsx    # Upload and OCR
│   │   ├── TradeList.tsx           # Trade history
│   │   ├── TradeCard.tsx           # Individual trade display
│   │   └── TradeDetailModal.tsx    # Full trade details
│   │
│   ├── calendar/
│   │   ├── MonthlyCalendar.tsx     # Calendar grid view
│   │   ├── DayCard.tsx             # Individual day P&L card
│   │   ├── WeekView.tsx            # Weekly cards view
│   │   ├── MonthlySummary.tsx      # Month summary bar
│   │   └── DayDetailModal.tsx      # Day detail popup
│   │
│   ├── analytics/
│   │   ├── AnalyticsDashboard.tsx  # Main analytics page
│   │   ├── PnLSummaryCards.tsx     # P&L overview cards
│   │   ├── StatisticsCards.tsx     # Trading statistics
│   │   ├── EquityCurve.tsx         # Cumulative P&L chart
│   │   ├── DailyPnLChart.tsx       # Daily bar chart
│   │   ├── WinRateChart.tsx        # Win rate trend
│   │   ├── TradeDistribution.tsx   # Pie/histogram charts
│   │   ├── DayOfWeekAnalysis.tsx   # Day performance
│   │   └── StatisticsTable.tsx     # Detailed stats table
│   │
│   ├── goals/
│   │   ├── GoalsDashboard.tsx      # Goals overview
│   │   ├── GoalSettingForm.tsx     # Set/edit goals
│   │   ├── GoalProgressCard.tsx    # Progress display
│   │   └── GoalHistory.tsx         # Achievement history
│   │
│   ├── reviews/
│   │   ├── WeeklyReviewForm.tsx    # Weekly review entry
│   │   ├── MonthlyReviewForm.tsx   # Monthly review entry
│   │   ├── ReviewList.tsx          # Past reviews
│   │   └── ReviewDetailModal.tsx   # View full review
│   │
│   ├── settings/
│   │   ├── SettingsPage.tsx        # Settings layout
│   │   ├── ProfileSettings.tsx     # User profile
│   │   ├── TradingConfig.tsx       # Capital settings
│   │   ├── RiskSettings.tsx        # Risk limits
│   │   ├── RulesManager.tsx        # Manage rules
│   │   ├── GoalsSettings.tsx       # Goal configuration
│   │   ├── AppearanceSettings.tsx  # Theme settings
│   │   └── DataManagement.tsx      # Export/import
│   │
│   └── common/
│       ├── LoadingSpinner.tsx
│       ├── ErrorBoundary.tsx
│       ├── EmptyState.tsx
│       ├── ConfirmDialog.tsx
│       └── AlertNotification.tsx
│
├── pages/
│   ├── index.tsx               # Home/Dashboard
│   ├── login.tsx
│   ├── signup.tsx
│   ├── onboarding.tsx
│   ├── journal.tsx
│   ├── calendar.tsx
│   ├── analytics.tsx
│   ├── goals.tsx
│   ├── reviews.tsx
│   └── settings.tsx
│
├── hooks/
│   ├── useAuth.ts              # Authentication hook
│   ├── useProfile.ts           # User profile data
│   ├── useTradingDay.ts        # Current trading day
│   ├── useTrades.ts            # Trade operations
│   ├── useStats.ts             # Statistics calculations
│   ├── useGoals.ts             # Goals tracking
│   └── useTheme.ts             # Theme management
│
├── lib/
│   ├── supabase.ts             # Supabase client
│   ├── utils.ts                # Utility functions
│   ├── calculations.ts         # P&L, stats calculations
│   ├── dateUtils.ts            # Date helpers
│   └── exportUtils.ts          # Excel/PDF export
│
├── types/
│   └── index.ts                # TypeScript interfaces
│
├── stores/
│   └── appStore.ts             # Zustand global store
│
└── styles/
    └── globals.css             # Global styles + Tailwind
```

---

## API Endpoints (Supabase Functions)

For Phase 3 OCR feature:

### POST /functions/v1/process-screenshot

**Input:**
```json
{
  "imageBase64": "...",
  "broker": "ZERODHA" | "GROWW"
}
```

**Output:**
```json
{
  "success": true,
  "trades": [
    {
      "symbol": "RELIANCE",
      "quantity": 100,
      "entry_price": 2450.50,
      "exit_price": 2478.25,
      "pnl": 2775,
      "trade_type": "LONG"
    }
  ]
}
```

---

## Phase 2: Zerodha API Integration (Future)

### Kite Connect API

**Features to implement:**
1. OAuth authentication with Zerodha
2. Fetch positions automatically
3. Fetch order history
4. Place orders from app
5. Set entry/exit conditions (algo trading)

**Required APIs:**
- Login & Session: `/session/token`
- Positions: `/portfolio/positions`
- Orders: `/orders`
- Place Order: `POST /orders/{variety}`
- Modify Order: `PUT /orders/{variety}/{order_id}`

**Storage:**
- Access token (encrypted)
- API key
- User preferences for auto-sync

---

## Color Palette

### Light Mode
```css
--background: #ffffff
--foreground: #0f172a
--card: #ffffff
--card-foreground: #0f172a
--primary: #2563eb       /* Blue */
--primary-foreground: #ffffff
--secondary: #f1f5f9
--muted: #f1f5f9
--accent: #f1f5f9
--destructive: #ef4444   /* Red for losses */
--success: #22c55e       /* Green for profits */
--warning: #f59e0b       /* Yellow for caution */
--border: #e2e8f0
--ring: #2563eb
```

### Dark Mode
```css
--background: #0f172a
--foreground: #f8fafc
--card: #1e293b
--card-foreground: #f8fafc
--primary: #3b82f6
--primary-foreground: #ffffff
--secondary: #334155
--muted: #334155
--accent: #334155
--destructive: #f87171
--success: #4ade80
--warning: #fbbf24
--border: #334155
--ring: #3b82f6
```

### P&L Colors
```css
/* Profit gradient */
--profit-light: #dcfce7
--profit: #22c55e
--profit-dark: #15803d

/* Loss gradient */
--loss-light: #fee2e2
--loss: #ef4444
--loss-dark: #b91c1c

/* Breakeven */
--breakeven: #94a3b8
```

---

## Development Commands

```bash
# Create new Next.js project
npx create-next-app@latest trademind --typescript --tailwind --eslint --app --src-dir

# Install dependencies
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install zustand @tanstack/react-query
npm install recharts xlsx file-saver
npm install date-fns
npm install lucide-react
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-slot
npm install class-variance-authority clsx tailwind-merge
npm install react-hot-toast

# shadcn/ui setup
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card dialog input select slider toast checkbox

# Development
npm run dev

# Build
npm run build
```

---

## Deployment

**Recommended: Vercel**
1. Connect GitHub repository
2. Configure environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy

**Supabase Setup:**
1. Create new project
2. Run SQL schema
3. Enable Row Level Security
4. Configure authentication providers
5. Create storage bucket for screenshots

---

## Success Metrics

1. **User Engagement**
   - Daily active users
   - Rules acknowledged before trading
   - Trades logged per day

2. **Trading Improvement**
   - Hit ratio trend over time
   - Risk limit adherence
   - Goal achievement rate

3. **App Quality**
   - Page load time < 2s
   - Mobile responsiveness score
   - Error rate < 0.1%

---

## Future Enhancements (Post-MVP)

1. **AI Insights**
   - Pattern detection in losing trades
   - Personalized trading recommendations
   - Sentiment analysis of notes

2. **Social Features**
   - Anonymous performance comparison
   - Community trading rules sharing

3. **Advanced Analytics**
   - Sector-wise performance
   - Time-based patterns
   - Correlation analysis

4. **Integrations**
   - Groww API (when available)
   - TradingView charts embed
   - Telegram notifications

5. **Mobile App**
   - React Native version
   - Push notifications
   - Widget for quick P&L view
