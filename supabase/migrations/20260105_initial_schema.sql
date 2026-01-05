-- TradeMind Database Schema
-- Version: 1.0
-- Last Updated: January 2026

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE
-- Extends Supabase auth.users with app-specific data
-- ============================================
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  -- Trading Capital Settings
  trading_capital DECIMAL(15,2) DEFAULT 100000,
  daily_loss_limit DECIMAL(15,2) DEFAULT 5000,
  per_trade_risk DECIMAL(15,2) DEFAULT 1000,
  max_trades_per_day INTEGER DEFAULT 10,
  -- Goals
  daily_target DECIMAL(15,2) DEFAULT 2000,
  weekly_target DECIMAL(15,2) DEFAULT 8000,
  monthly_target DECIMAL(15,2) DEFAULT 30000,
  -- App Settings
  onboarding_completed BOOLEAN DEFAULT FALSE,
  theme TEXT DEFAULT 'dark' CHECK (theme IN ('light', 'dark', 'system')),
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TRADING RULES TABLE
-- User's custom trading rules for daily ritual
-- ============================================
CREATE TABLE public.trading_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  rule_text TEXT NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- DAILY SESSIONS TABLE
-- Pre-market ritual and end-of-day summary
-- ============================================
CREATE TABLE public.daily_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  session_date DATE NOT NULL,
  -- Pre-market ritual
  pre_market_mood TEXT CHECK (pre_market_mood IN ('EXCELLENT', 'GOOD', 'NEUTRAL', 'STRESSED', 'ANXIOUS')),
  sleep_hours DECIMAL(3,1),
  exercised BOOLEAN DEFAULT FALSE,
  market_bias TEXT,
  key_levels TEXT,
  rules_checked JSONB DEFAULT '[]', -- Array of rule IDs that were acknowledged
  pre_market_notes TEXT,
  -- Session tracking
  session_started_at TIMESTAMPTZ,
  session_ended_at TIMESTAMPTZ,
  -- End of day
  end_of_day_notes TEXT,
  end_of_day_mood TEXT CHECK (end_of_day_mood IN ('EXCELLENT', 'GOOD', 'NEUTRAL', 'STRESSED', 'ANXIOUS')),
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  -- Ensure one session per user per day
  UNIQUE(user_id, session_date)
);

-- ============================================
-- TRADES TABLE
-- Individual trade entries
-- ============================================
CREATE TABLE public.trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  session_id UUID REFERENCES public.daily_sessions(id) ON DELETE SET NULL,
  -- Trade details
  symbol TEXT NOT NULL,
  trade_type TEXT DEFAULT 'EQUITY' CHECK (trade_type IN ('EQUITY', 'OPTIONS', 'FUTURES')),
  direction TEXT NOT NULL CHECK (direction IN ('LONG', 'SHORT')),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  entry_price DECIMAL(15,2) NOT NULL,
  exit_price DECIMAL(15,2),
  stop_loss DECIMAL(15,2),
  target_price DECIMAL(15,2),
  -- P&L (calculated on trade close)
  pnl DECIMAL(15,2),
  pnl_percent DECIMAL(8,4),
  fees DECIMAL(10,2) DEFAULT 0,
  -- Options-specific fields
  option_type TEXT CHECK (option_type IN ('CE', 'PE')),
  strike_price DECIMAL(15,2),
  expiry_date DATE,
  -- Metadata
  setup_type TEXT, -- e.g., "Breakout", "Pullback", "Reversal"
  emotion_entry TEXT CHECK (emotion_entry IN ('CONFIDENT', 'FEARFUL', 'GREEDY', 'CALM', 'FOMO', 'REVENGE')),
  emotion_exit TEXT CHECK (emotion_exit IN ('CONFIDENT', 'FEARFUL', 'GREEDY', 'CALM', 'FOMO', 'REVENGE')),
  notes TEXT,
  screenshot_url TEXT,
  tags TEXT[] DEFAULT '{}',
  -- Timing
  entry_time TIMESTAMPTZ NOT NULL,
  exit_time TIMESTAMPTZ,
  -- Status
  status TEXT DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'CLOSED', 'CANCELLED')),
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- GOALS TABLE
-- User's trading goals
-- ============================================
CREATE TABLE public.goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  goal_type TEXT NOT NULL CHECK (goal_type IN ('daily', 'weekly', 'monthly')),
  target_amount DECIMAL(15,2) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- WEEKLY REVIEWS TABLE
-- End-of-week reflection
-- ============================================
CREATE TABLE public.weekly_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  -- Reflection
  what_worked TEXT,
  what_didnt_work TEXT,
  rule_violations TEXT,
  key_learnings TEXT,
  next_week_plan TEXT,
  discipline_rating INTEGER CHECK (discipline_rating >= 1 AND discipline_rating <= 10),
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, week_start)
);

-- ============================================
-- MONTHLY REVIEWS TABLE
-- End-of-month summary
-- ============================================
CREATE TABLE public.monthly_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  year INTEGER NOT NULL,
  -- Reflection
  performance_summary TEXT,
  key_insights TEXT,
  strategy_adjustments TEXT,
  areas_to_improve TEXT,
  satisfaction_rating INTEGER CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 10),
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, month, year)
);

-- ============================================
-- QUOTES TABLE
-- Motivational trading quotes for daily ritual
-- ============================================
CREATE TABLE public.quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_text TEXT NOT NULL,
  author TEXT,
  category TEXT DEFAULT 'general',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trading_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Trading rules policies
CREATE POLICY "Users can view own rules" ON public.trading_rules
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own rules" ON public.trading_rules
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own rules" ON public.trading_rules
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own rules" ON public.trading_rules
  FOR DELETE USING (auth.uid() = user_id);

-- Daily sessions policies
CREATE POLICY "Users can view own sessions" ON public.daily_sessions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sessions" ON public.daily_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own sessions" ON public.daily_sessions
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own sessions" ON public.daily_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- Trades policies
CREATE POLICY "Users can view own trades" ON public.trades
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own trades" ON public.trades
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own trades" ON public.trades
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own trades" ON public.trades
  FOR DELETE USING (auth.uid() = user_id);

-- Goals policies
CREATE POLICY "Users can view own goals" ON public.goals
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own goals" ON public.goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own goals" ON public.goals
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own goals" ON public.goals
  FOR DELETE USING (auth.uid() = user_id);

-- Weekly reviews policies
CREATE POLICY "Users can view own weekly reviews" ON public.weekly_reviews
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own weekly reviews" ON public.weekly_reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own weekly reviews" ON public.weekly_reviews
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own weekly reviews" ON public.weekly_reviews
  FOR DELETE USING (auth.uid() = user_id);

-- Monthly reviews policies
CREATE POLICY "Users can view own monthly reviews" ON public.monthly_reviews
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own monthly reviews" ON public.monthly_reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own monthly reviews" ON public.monthly_reviews
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own monthly reviews" ON public.monthly_reviews
  FOR DELETE USING (auth.uid() = user_id);

-- Quotes policies (public read)
CREATE POLICY "Anyone can view quotes" ON public.quotes
  FOR SELECT USING (true);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to insert default trading rules for new users
CREATE OR REPLACE FUNCTION public.create_default_rules()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.trading_rules (user_id, rule_text, is_default, sort_order) VALUES
    (NEW.id, 'Risk Management First - Never risk more than defined limits', true, 1),
    (NEW.id, 'Always Honor Stop Loss - No moving SL against the trade', true, 2),
    (NEW.id, 'Proper Position Sizing - Size based on SL distance, not conviction', true, 3),
    (NEW.id, 'Be Agile in Booking Profits - Do not be greedy, book partial profits', true, 4),
    (NEW.id, 'Never Let a Winner Turn into a Loser - Trail SL to breakeven', true, 5),
    (NEW.id, 'Be Patient - Wait for Proper Entry - No FOMO trades', true, 6),
    (NEW.id, 'Stick to Daily/Weekly/Monthly Targets - Stop when target achieved', true, 7);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create default rules when profile is created
DROP TRIGGER IF EXISTS on_profile_created ON public.profiles;
CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.create_default_rules();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all relevant tables
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_trading_rules_updated_at
  BEFORE UPDATE ON public.trading_rules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_daily_sessions_updated_at
  BEFORE UPDATE ON public.daily_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_trades_updated_at
  BEFORE UPDATE ON public.trades
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_goals_updated_at
  BEFORE UPDATE ON public.goals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_weekly_reviews_updated_at
  BEFORE UPDATE ON public.weekly_reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_monthly_reviews_updated_at
  BEFORE UPDATE ON public.monthly_reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_trading_rules_user ON public.trading_rules(user_id);
CREATE INDEX idx_daily_sessions_user_date ON public.daily_sessions(user_id, session_date);
CREATE INDEX idx_trades_user ON public.trades(user_id);
CREATE INDEX idx_trades_session ON public.trades(session_id);
CREATE INDEX idx_trades_user_entry_time ON public.trades(user_id, entry_time);
CREATE INDEX idx_trades_status ON public.trades(status);
CREATE INDEX idx_goals_user ON public.goals(user_id);
CREATE INDEX idx_weekly_reviews_user ON public.weekly_reviews(user_id, week_start);
CREATE INDEX idx_monthly_reviews_user ON public.monthly_reviews(user_id, year, month);

-- ============================================
-- SEED DATA: Motivational Quotes
-- ============================================
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
