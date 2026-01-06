"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTrades, useUser } from "@/hooks/use-data";
import { BaseCard, ProfitCard, LossCard } from "@/components/ui/card-variants";
import { Button } from "@/components/ui/button-variants";
import { AnalyticsSkeleton } from "@/components/ui/skeleton";
import {
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Target,
  BarChart3,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { formatINR } from "@/lib/utils";

// Chart colors
const COLORS = {
  profit: "#22c55e",
  loss: "#ef4444",
  brand: "#10b981",
  grid: "#374151",
  text: "#9ca3af",
};

// Helper to get date string in local timezone (YYYY-MM-DD)
function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

interface TooltipPayload {
  name: string;
  value: number;
  color: string;
}

export default function AnalyticsPage() {
  const router = useRouter();
  const { user, isLoading: userLoading } = useUser();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Calculate date range for current month
  const startOfMonth = useMemo(() =>
    new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).toISOString(),
    [currentMonth]
  );
  const endOfMonth = useMemo(() =>
    new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0, 23, 59, 59).toISOString(),
    [currentMonth]
  );

  // Fetch trades for the selected month
  const { trades, isLoading } = useTrades({
    status: "CLOSED",
    startDate: startOfMonth,
    endDate: endOfMonth,
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/login");
    }
  }, [user, userLoading, router]);

  // Calculate summary stats
  const stats = useMemo(() => {
    const totalPnl = trades.reduce((sum, t) => sum + (t.pnl || 0), 0);
    const winningTrades = trades.filter((t) => (t.pnl || 0) > 0);
    const losingTrades = trades.filter((t) => (t.pnl || 0) < 0);
    const winRate = trades.length > 0 ? (winningTrades.length / trades.length) * 100 : 0;
    const avgPnl = trades.length > 0 ? totalPnl / trades.length : 0;
    const bestTrade = trades.length > 0 ? Math.max(...trades.map((t) => t.pnl || 0)) : 0;
    const worstTrade = trades.length > 0 ? Math.min(...trades.map((t) => t.pnl || 0)) : 0;
    const grossProfit = winningTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
    const grossLoss = Math.abs(losingTrades.reduce((sum, t) => sum + (t.pnl || 0), 0));
    const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? Infinity : 0;

    return {
      totalPnl,
      totalTrades: trades.length,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      winRate,
      avgPnl,
      bestTrade,
      worstTrade,
      profitFactor,
    };
  }, [trades]);

  // Daily P&L data with cumulative (using local timezone)
  const dailyData = useMemo(() => {
    const dailyMap: Record<string, { pnl: number; trades: number }> = {};

    trades.forEach((trade) => {
      const date = formatLocalDate(new Date(trade.entry_time));
      if (!dailyMap[date]) {
        dailyMap[date] = { pnl: 0, trades: 0 };
      }
      dailyMap[date].pnl += trade.pnl || 0;
      dailyMap[date].trades += 1;
    });

    const sortedDates = Object.keys(dailyMap).sort();
    let cumulative = 0;

    return sortedDates.map((dateStr) => {
      cumulative += dailyMap[dateStr].pnl;
      // Parse the date string back to display format
      const [year, month, day] = dateStr.split("-").map(Number);
      const displayDate = new Date(year, month - 1, day).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
      return {
        date: displayDate,
        pnl: dailyMap[dateStr].pnl,
        cumulative,
        trades: dailyMap[dateStr].trades,
      };
    });
  }, [trades]);

  // Win/Loss pie data
  const pieData = useMemo(() => {
    return [
      { name: "Wins", value: stats.winningTrades, color: COLORS.profit },
      { name: "Losses", value: stats.losingTrades, color: COLORS.loss },
    ];
  }, [stats]);

  // Symbol performance data
  const symbolData = useMemo(() => {
    const symbolMap: Record<string, { pnl: number; trades: number }> = {};

    trades.forEach((trade) => {
      if (!symbolMap[trade.symbol]) {
        symbolMap[trade.symbol] = { pnl: 0, trades: 0 };
      }
      symbolMap[trade.symbol].pnl += trade.pnl || 0;
      symbolMap[trade.symbol].trades += 1;
    });

    return Object.entries(symbolMap)
      .map(([symbol, data]) => ({ symbol, ...data }))
      .sort((a, b) => b.pnl - a.pnl)
      .slice(0, 8); // Top 8 symbols
  }, [trades]);

  function navigateMonth(direction: number) {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + direction, 1));
  }

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: {
    active?: boolean;
    payload?: TooltipPayload[];
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background-elevated border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm text-foreground-secondary mb-1">{label}</p>
          {payload.map((entry: TooltipPayload, index: number) => (
            <p key={index} className="text-sm font-medium" style={{ color: entry.color }}>
              {entry.name}: {entry.name.includes("P&L") ? formatINR(entry.value) : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Show skeleton on first load only (cached data shows instantly)
  if (isLoading && trades.length === 0) {
    return <AnalyticsSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-sm text-foreground-secondary">
            Your trading performance insights
          </p>
        </div>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => navigateMonth(-1)}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <h2 className="text-xl font-semibold">
          {currentMonth.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
        </h2>
        <Button variant="ghost" size="sm" onClick={() => navigateMonth(1)}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.totalPnl >= 0 ? (
          <ProfitCard className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-profit" />
              <p className="text-sm text-foreground-tertiary">Total P&L</p>
            </div>
            <p className="text-2xl font-bold text-profit">+{formatINR(stats.totalPnl)}</p>
          </ProfitCard>
        ) : (
          <LossCard className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown className="w-4 h-4 text-loss" />
              <p className="text-sm text-foreground-tertiary">Total P&L</p>
            </div>
            <p className="text-2xl font-bold text-loss">{formatINR(stats.totalPnl)}</p>
          </LossCard>
        )}
        <BaseCard className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-4 h-4 text-brand" />
            <p className="text-sm text-foreground-tertiary">Win Rate</p>
          </div>
          <p className="text-2xl font-bold">{stats.winRate.toFixed(1)}%</p>
        </BaseCard>
        <BaseCard className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-4 h-4 text-info" />
            <p className="text-sm text-foreground-tertiary">Total Trades</p>
          </div>
          <p className="text-2xl font-bold">{stats.totalTrades}</p>
        </BaseCard>
        <BaseCard className="p-4">
          <p className="text-sm text-foreground-tertiary mb-1">Avg P&L / Trade</p>
          <p className={`text-2xl font-bold ${stats.avgPnl >= 0 ? "text-profit" : "text-loss"}`}>
            {stats.avgPnl >= 0 ? "+" : ""}{formatINR(stats.avgPnl)}
          </p>
        </BaseCard>
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <BaseCard className="p-4">
          <p className="text-sm text-foreground-tertiary mb-1">Best Trade</p>
          <p className="text-xl font-bold text-profit">+{formatINR(stats.bestTrade)}</p>
        </BaseCard>
        <BaseCard className="p-4">
          <p className="text-sm text-foreground-tertiary mb-1">Worst Trade</p>
          <p className="text-xl font-bold text-loss">{formatINR(stats.worstTrade)}</p>
        </BaseCard>
        <BaseCard className="p-4">
          <p className="text-sm text-foreground-tertiary mb-1">Profit Factor</p>
          <p className={`text-xl font-bold ${stats.profitFactor >= 1 ? "text-profit" : "text-loss"}`}>
            {stats.profitFactor === Infinity ? "∞" : stats.profitFactor.toFixed(2)}
          </p>
        </BaseCard>
        <BaseCard className="p-4">
          <p className="text-sm text-foreground-tertiary mb-1">Win / Loss</p>
          <p className="text-xl font-bold">
            <span className="text-profit">{stats.winningTrades}</span>
            <span className="text-foreground-tertiary"> / </span>
            <span className="text-loss">{stats.losingTrades}</span>
          </p>
        </BaseCard>
      </div>

      {/* Cumulative P&L Chart */}
      <BaseCard className="p-4">
        <h3 className="text-lg font-semibold mb-4">Cumulative P&L</h3>
        {dailyData.length > 0 ? (
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyData}>
                <defs>
                  <linearGradient id="colorPnl" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.profit} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={COLORS.profit} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} opacity={0.3} />
                <XAxis
                  dataKey="date"
                  stroke={COLORS.text}
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis
                  stroke={COLORS.text}
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="cumulative"
                  name="Cumulative P&L"
                  stroke={COLORS.profit}
                  strokeWidth={2}
                  fill="url(#colorPnl)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[250px] flex items-center justify-center text-foreground-tertiary">
            No trades this month
          </div>
        )}
      </BaseCard>

      {/* Daily P&L + Win/Loss Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Daily P&L Bar Chart */}
        <BaseCard className="p-4 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Daily Performance</h3>
          {dailyData.length > 0 ? (
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} opacity={0.3} />
                  <XAxis
                    dataKey="date"
                    stroke={COLORS.text}
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis
                    stroke={COLORS.text}
                    fontSize={12}
                    tickLine={false}
                    tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="pnl"
                    name="Daily P&L"
                    radius={[4, 4, 0, 0]}
                  >
                    {dailyData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.pnl >= 0 ? COLORS.profit : COLORS.loss}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-foreground-tertiary">
              No trades this month
            </div>
          )}
        </BaseCard>

        {/* Win/Loss Pie Chart */}
        <BaseCard className="p-4">
          <h3 className="text-lg font-semibold mb-4">Win/Loss Ratio</h3>
          {stats.totalTrades > 0 ? (
            <div className="h-[250px] flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height="80%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex gap-6 mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-profit" />
                  <span className="text-sm text-foreground-secondary">
                    Wins ({stats.winningTrades})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-loss" />
                  <span className="text-sm text-foreground-secondary">
                    Losses ({stats.losingTrades})
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-foreground-tertiary">
              No trades this month
            </div>
          )}
        </BaseCard>
      </div>

      {/* Symbol Performance */}
      <BaseCard className="p-4">
        <h3 className="text-lg font-semibold mb-4">Top Symbols</h3>
        {symbolData.length > 0 ? (
          <div className="space-y-3">
            {symbolData.map((item) => {
              const maxPnl = Math.max(...symbolData.map((s) => Math.abs(s.pnl)));
              const barWidth = (Math.abs(item.pnl) / maxPnl) * 100;

              return (
                <div key={item.symbol} className="flex items-center gap-3">
                  <div className="w-24 font-medium truncate">{item.symbol}</div>
                  <div className="flex-1 h-8 bg-background-surface rounded-lg overflow-hidden relative">
                    <div
                      className={`h-full rounded-lg transition-all ${
                        item.pnl >= 0 ? "bg-profit/30" : "bg-loss/30"
                      }`}
                      style={{ width: `${barWidth}%` }}
                    />
                    <div className="absolute inset-0 flex items-center px-3">
                      <span className="text-xs text-foreground-tertiary">
                        {item.trades} trade{item.trades > 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                  <div className={`w-24 text-right font-medium ${
                    item.pnl >= 0 ? "text-profit" : "text-loss"
                  }`}>
                    {item.pnl >= 0 ? "+" : ""}{formatINR(item.pnl)}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-[200px] flex items-center justify-center text-foreground-tertiary">
            No trades this month
          </div>
        )}
      </BaseCard>
    </div>
  );
}
