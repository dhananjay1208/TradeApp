"use client";

import useSWR from "swr";
import { createClient } from "@/lib/supabase/client";
import type { Profile, Trade, TradingRule, DailySession } from "@/types";

const supabase = createClient();

// Global SWR configuration
export const swrConfig = {
  revalidateOnFocus: false,
  revalidateIfStale: true,
  dedupingInterval: 5000, // Dedupe requests within 5 seconds
};

// ============================================
// USER HOOK
// ============================================
async function fetchUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

export function useUser() {
  const { data: user, error, isLoading, mutate } = useSWR(
    "user",
    fetchUser,
    {
      ...swrConfig,
      revalidateOnMount: true,
    }
  );

  return {
    user,
    isLoading,
    isError: error,
    mutate,
  };
}

// ============================================
// PROFILE HOOK
// ============================================
async function fetchProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data as Profile;
}

export function useProfile() {
  const { user } = useUser();

  const { data: profile, error, isLoading, mutate } = useSWR(
    user ? ["profile", user.id] : null,
    () => fetchProfile(user!.id),
    swrConfig
  );

  return {
    profile,
    isLoading,
    isError: error,
    mutate,
  };
}

// ============================================
// TRADES HOOK
// ============================================
interface TradesOptions {
  limit?: number;
  status?: "OPEN" | "CLOSED" | "all";
  startDate?: string;
  endDate?: string;
}

async function fetchTrades(userId: string, options: TradesOptions = {}) {
  let query = supabase
    .from("trades")
    .select("*")
    .eq("user_id", userId)
    .order("entry_time", { ascending: false });

  if (options.status && options.status !== "all") {
    query = query.eq("status", options.status);
  }

  if (options.startDate) {
    query = query.gte("entry_time", options.startDate);
  }

  if (options.endDate) {
    query = query.lte("entry_time", options.endDate);
  }

  if (options.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Trade[];
}

export function useTrades(options: TradesOptions = {}) {
  const { user } = useUser();

  const cacheKey = user
    ? ["trades", user.id, JSON.stringify(options)]
    : null;

  const { data: trades, error, isLoading, mutate } = useSWR(
    cacheKey,
    () => fetchTrades(user!.id, options),
    swrConfig
  );

  return {
    trades: trades || [],
    isLoading,
    isError: error,
    mutate,
  };
}

// ============================================
// TRADING RULES HOOK
// ============================================
async function fetchTradingRules(userId: string, activeOnly = true) {
  let query = supabase
    .from("trading_rules")
    .select("*")
    .eq("user_id", userId)
    .order("sort_order", { ascending: true });

  if (activeOnly) {
    query = query.eq("is_active", true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as TradingRule[];
}

export function useTradingRules(activeOnly = true) {
  const { user } = useUser();

  const { data: rules, error, isLoading, mutate } = useSWR(
    user ? ["trading_rules", user.id, activeOnly] : null,
    () => fetchTradingRules(user!.id, activeOnly),
    swrConfig
  );

  return {
    rules: rules || [],
    isLoading,
    isError: error,
    mutate,
  };
}

// ============================================
// TODAY'S SESSION HOOK
// ============================================
async function fetchTodaySession(userId: string) {
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("daily_sessions")
    .select("*")
    .eq("user_id", userId)
    .eq("session_date", today)
    .single();

  // No session today is not an error
  if (error && error.code !== "PGRST116") throw error;
  return data as DailySession | null;
}

export function useTodaySession() {
  const { user } = useUser();

  const { data: session, error, isLoading, mutate } = useSWR(
    user ? ["today_session", user.id] : null,
    () => fetchTodaySession(user!.id),
    swrConfig
  );

  return {
    session,
    isLoading,
    isError: error,
    mutate,
  };
}

// ============================================
// DASHBOARD DATA HOOK (Combined)
// ============================================
interface DashboardData {
  profile: Profile | null;
  todaySession: DailySession | null;
  todayTrades: Trade[];
  recentTrades: Trade[];
}

async function fetchDashboardData(userId: string): Promise<DashboardData> {
  const today = new Date().toISOString().split("T")[0];
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  // Parallel fetches for better performance
  const [profileRes, sessionRes, todayTradesRes, recentTradesRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single(),
    supabase
      .from("daily_sessions")
      .select("*")
      .eq("user_id", userId)
      .eq("session_date", today)
      .single(),
    supabase
      .from("trades")
      .select("*")
      .eq("user_id", userId)
      .gte("entry_time", startOfDay.toISOString())
      .order("entry_time", { ascending: false }),
    supabase
      .from("trades")
      .select("*")
      .eq("user_id", userId)
      .order("entry_time", { ascending: false })
      .limit(5),
  ]);

  return {
    profile: profileRes.data as Profile | null,
    todaySession: sessionRes.error?.code === "PGRST116" ? null : (sessionRes.data as DailySession | null),
    todayTrades: (todayTradesRes.data || []) as Trade[],
    recentTrades: (recentTradesRes.data || []) as Trade[],
  };
}

export function useDashboardData() {
  const { user } = useUser();

  const { data, error, isLoading, mutate } = useSWR(
    user ? ["dashboard", user.id] : null,
    () => fetchDashboardData(user!.id),
    {
      ...swrConfig,
      revalidateOnMount: true,
    }
  );

  return {
    profile: data?.profile || null,
    todaySession: data?.todaySession || null,
    todayTrades: data?.todayTrades || [],
    recentTrades: data?.recentTrades || [],
    isLoading,
    isError: error,
    mutate,
  };
}

// ============================================
// RITUAL DATA HOOK (Combined)
// ============================================
interface RitualData {
  profile: Pick<Profile, "daily_loss_limit" | "per_trade_risk" | "max_trades_per_day" | "trading_capital"> | null;
  rules: TradingRule[];
  todaySession: DailySession | null;
  quote: { id: string; quote_text: string; author: string | null } | null;
}

async function fetchRitualData(userId: string): Promise<RitualData> {
  const today = new Date().toISOString().split("T")[0];

  // Parallel fetches for better performance
  const [profileRes, rulesRes, sessionRes, quotesRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("daily_loss_limit, per_trade_risk, max_trades_per_day, trading_capital")
      .eq("id", userId)
      .single(),
    supabase
      .from("trading_rules")
      .select("*")
      .eq("user_id", userId)
      .eq("is_active", true)
      .order("sort_order", { ascending: true }),
    supabase
      .from("daily_sessions")
      .select("*")
      .eq("user_id", userId)
      .eq("session_date", today)
      .single(),
    supabase
      .from("quotes")
      .select("id, quote_text, author")
      .eq("is_active", true),
  ]);

  // Pick random quote
  const quotes = quotesRes.data || [];
  const randomQuote = quotes.length > 0 ? quotes[Math.floor(Math.random() * quotes.length)] : null;

  return {
    profile: profileRes.data as RitualData["profile"],
    rules: (rulesRes.data || []) as TradingRule[],
    todaySession: sessionRes.error?.code === "PGRST116" ? null : (sessionRes.data as DailySession | null),
    quote: randomQuote,
  };
}

export function useRitualData() {
  const { user } = useUser();

  const { data, error, isLoading, mutate } = useSWR(
    user ? ["ritual", user.id] : null,
    () => fetchRitualData(user!.id),
    {
      ...swrConfig,
      revalidateOnMount: true,
    }
  );

  return {
    profile: data?.profile || null,
    rules: data?.rules || [],
    todaySession: data?.todaySession || null,
    quote: data?.quote || null,
    isLoading,
    isError: error,
    mutate,
  };
}

// ============================================
// SETTINGS DATA HOOK (Combined)
// ============================================
interface SettingsData {
  profile: Profile | null;
  rules: TradingRule[];
}

async function fetchSettingsData(userId: string): Promise<SettingsData> {
  // Parallel fetches for better performance
  const [profileRes, rulesRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single(),
    supabase
      .from("trading_rules")
      .select("*")
      .eq("user_id", userId)
      .order("sort_order", { ascending: true }),
  ]);

  return {
    profile: profileRes.data as Profile | null,
    rules: (rulesRes.data || []) as TradingRule[],
  };
}

export function useSettingsData() {
  const { user } = useUser();

  const { data, error, isLoading, mutate } = useSWR(
    user ? ["settings", user.id] : null,
    () => fetchSettingsData(user!.id),
    {
      ...swrConfig,
      revalidateOnMount: true,
    }
  );

  return {
    profile: data?.profile || null,
    rules: data?.rules || [],
    isLoading,
    isError: error,
    mutate,
  };
}
