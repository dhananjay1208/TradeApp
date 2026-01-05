// ============================================
// DATABASE TYPES
// These types match the Supabase database schema
// ============================================

// Profile (extends Supabase auth.users)
export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  // Trading Capital Settings
  trading_capital: number;
  daily_loss_limit: number;
  per_trade_risk: number;
  max_trades_per_day: number;
  // Goals
  daily_target: number;
  weekly_target: number;
  monthly_target: number;
  // App Settings
  onboarding_completed: boolean;
  theme: "light" | "dark" | "system";
  // Timestamps
  created_at: string;
  updated_at: string;
}

// Trading Rule Category
export type RuleCategory = "Risk Management" | "Profit Taking" | "Discipline" | "General";

// Trading Rule
export interface TradingRule {
  id: string;
  user_id: string;
  rule_text: string;
  category: RuleCategory;
  is_default: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// Mood types
export type MoodType = "EXCELLENT" | "GOOD" | "NEUTRAL" | "STRESSED" | "ANXIOUS";

// Emotion types for trade entry/exit
export type EmotionType = "CONFIDENT" | "FEARFUL" | "GREEDY" | "CALM" | "FOMO" | "REVENGE";

// Daily Session (pre-market ritual + EOD summary)
export interface DailySession {
  id: string;
  user_id: string;
  session_date: string; // YYYY-MM-DD format
  // Pre-market ritual
  pre_market_mood: MoodType | null;
  sleep_hours: number | null;
  exercised: boolean;
  market_bias: string | null;
  key_levels: string | null;
  rules_checked: string[]; // Array of rule IDs
  pre_market_notes: string | null;
  // Session tracking
  session_started_at: string | null;
  session_ended_at: string | null;
  // End of day
  end_of_day_notes: string | null;
  end_of_day_mood: MoodType | null;
  // Timestamps
  created_at: string;
  updated_at: string;
}

// Trade types
export type TradeType = "EQUITY" | "OPTIONS" | "FUTURES";
export type TradeDirection = "LONG" | "SHORT";
export type TradeStatus = "OPEN" | "CLOSED" | "CANCELLED";
export type OptionType = "CE" | "PE";

// Trade
export interface Trade {
  id: string;
  user_id: string;
  session_id: string | null;
  // Trade details
  symbol: string;
  trade_type: TradeType;
  direction: TradeDirection;
  quantity: number;
  entry_price: number;
  exit_price: number | null;
  stop_loss: number | null;
  target_price: number | null;
  // P&L
  pnl: number | null;
  pnl_percent: number | null;
  fees: number;
  // Options-specific
  option_type: OptionType | null;
  strike_price: number | null;
  expiry_date: string | null;
  // Metadata
  setup_type: string | null;
  emotion_entry: EmotionType | null;
  emotion_exit: EmotionType | null;
  notes: string | null;
  screenshot_url: string | null;
  tags: string[];
  // Timing
  entry_time: string;
  exit_time: string | null;
  // Status
  status: TradeStatus;
  // Timestamps
  created_at: string;
  updated_at: string;
}

// Goal
export interface Goal {
  id: string;
  user_id: string;
  goal_type: "daily" | "weekly" | "monthly";
  target_amount: number;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Weekly Review
export interface WeeklyReview {
  id: string;
  user_id: string;
  week_start: string;
  week_end: string;
  what_worked: string | null;
  what_didnt_work: string | null;
  rule_violations: string | null;
  key_learnings: string | null;
  next_week_plan: string | null;
  discipline_rating: number | null; // 1-10
  created_at: string;
  updated_at: string;
}

// Monthly Review
export interface MonthlyReview {
  id: string;
  user_id: string;
  month: number; // 1-12
  year: number;
  performance_summary: string | null;
  key_insights: string | null;
  strategy_adjustments: string | null;
  areas_to_improve: string | null;
  satisfaction_rating: number | null; // 1-10
  created_at: string;
  updated_at: string;
}

// Quote
export interface Quote {
  id: string;
  quote_text: string;
  author: string | null;
  category: string;
  is_active: boolean;
  created_at: string;
}

// ============================================
// FORM TYPES
// Types for form inputs and validation
// ============================================

export interface TradeFormData {
  symbol: string;
  trade_type: TradeType;
  direction: TradeDirection;
  quantity: number;
  entry_price: number;
  stop_loss?: number;
  target_price?: number;
  setup_type?: string;
  emotion_entry?: EmotionType;
  notes?: string;
  tags?: string[];
  // Options
  option_type?: OptionType;
  strike_price?: number;
  expiry_date?: string;
}

export interface CloseTradeFormData {
  exit_price: number;
  exit_time?: string;
  emotion_exit?: EmotionType;
  notes?: string;
}

export interface RitualFormData {
  pre_market_mood: MoodType;
  sleep_hours?: number;
  exercised?: boolean;
  market_bias?: string;
  key_levels?: string;
  rules_checked: string[];
  pre_market_notes?: string;
}

// ============================================
// COMPUTED / DERIVED TYPES
// Types for UI display and analytics
// ============================================

// Daily Summary (computed from trades)
export interface DailySummary {
  date: string;
  total_pnl: number;
  total_trades: number;
  winning_trades: number;
  losing_trades: number;
  win_rate: number;
  gross_profit: number;
  gross_loss: number;
  largest_win: number;
  largest_loss: number;
  average_win: number;
  average_loss: number;
  risk_reward_ratio: number;
  fees_total: number;
  ritual_completed: boolean;
  mood: MoodType | null;
}

// Dashboard Stats
export interface DashboardStats {
  todayPnl: number;
  todayTrades: number;
  todayWinRate: number;
  weekPnl: number;
  monthPnl: number;
  totalTrades: number;
  winRate: number;
  currentStreak: number;
  riskUsed: number; // Percentage of daily risk limit used
  tradesRemaining: number;
}

// Calendar Day (for heatmap)
export interface CalendarDay {
  date: string;
  pnl: number;
  trades: number;
  intensity: number; // 0-4 for heatmap coloring
}

// Analytics Period Stats
export interface PeriodStats {
  period: string;
  start_date: string;
  end_date: string;
  total_pnl: number;
  total_trades: number;
  winning_trades: number;
  losing_trades: number;
  win_rate: number;
  avg_profit: number;
  avg_loss: number;
  profit_factor: number;
  max_drawdown: number;
  best_trade: number;
  worst_trade: number;
  trading_days: number;
  profitable_days: number;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ============================================
// SUPABASE DATABASE TYPES
// Auto-generated types for Supabase client
// ============================================

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at" | "updated_at">;
        Update: Partial<Omit<Profile, "id" | "created_at">>;
      };
      trading_rules: {
        Row: TradingRule;
        Insert: Omit<TradingRule, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<TradingRule, "id" | "user_id" | "created_at">>;
      };
      daily_sessions: {
        Row: DailySession;
        Insert: Omit<DailySession, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<DailySession, "id" | "user_id" | "created_at">>;
      };
      trades: {
        Row: Trade;
        Insert: Omit<Trade, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Trade, "id" | "user_id" | "created_at">>;
      };
      goals: {
        Row: Goal;
        Insert: Omit<Goal, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Goal, "id" | "user_id" | "created_at">>;
      };
      weekly_reviews: {
        Row: WeeklyReview;
        Insert: Omit<WeeklyReview, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<WeeklyReview, "id" | "user_id" | "created_at">>;
      };
      monthly_reviews: {
        Row: MonthlyReview;
        Insert: Omit<MonthlyReview, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<MonthlyReview, "id" | "user_id" | "created_at">>;
      };
      quotes: {
        Row: Quote;
        Insert: Omit<Quote, "id" | "created_at">;
        Update: Partial<Omit<Quote, "id" | "created_at">>;
      };
    };
  };
};
