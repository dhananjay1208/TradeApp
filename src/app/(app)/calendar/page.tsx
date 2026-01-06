"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTrades, useUser } from "@/hooks/use-data";
import { BaseCard, ProfitCard, LossCard } from "@/components/ui/card-variants";
import { Button } from "@/components/ui/button-variants";
import { CalendarSkeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import type { Trade } from "@/types";
import { formatINR } from "@/lib/utils";

interface DaySummary {
  date: string;
  pnl: number;
  trades: number;
  wins: number;
  losses: number;
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Helper to get date string in local timezone (YYYY-MM-DD)
function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function CalendarPage() {
  const router = useRouter();
  const { user, isLoading: userLoading } = useUser();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<DaySummary | null>(null);
  const [selectedDayTrades, setSelectedDayTrades] = useState<Trade[]>([]);

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

  // Group trades by date (using local timezone)
  const dailySummaries = useMemo(() => {
    const summaries: Record<string, DaySummary> = {};

    trades.forEach((trade) => {
      const date = formatLocalDate(new Date(trade.entry_time));
      if (!summaries[date]) {
        summaries[date] = { date, pnl: 0, trades: 0, wins: 0, losses: 0 };
      }
      summaries[date].pnl += trade.pnl || 0;
      summaries[date].trades += 1;
      if ((trade.pnl || 0) > 0) summaries[date].wins += 1;
      if ((trade.pnl || 0) < 0) summaries[date].losses += 1;
    });

    return summaries;
  }, [trades]);

  // Generate calendar grid
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Adjust for Monday start (0 = Monday, 6 = Sunday)
    let startOffset = firstDay.getDay() - 1;
    if (startOffset < 0) startOffset = 6;

    const days: (Date | null)[] = [];

    // Add empty slots for days before first of month
    for (let i = 0; i < startOffset; i++) {
      days.push(null);
    }

    // Add days of month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  }, [currentMonth]);

  // Monthly stats
  const monthlyStats = useMemo(() => {
    const totalPnl = Object.values(dailySummaries).reduce((sum, day) => sum + day.pnl, 0);
    const tradingDays = Object.keys(dailySummaries).length;
    const greenDays = Object.values(dailySummaries).filter((d) => d.pnl > 0).length;
    const redDays = Object.values(dailySummaries).filter((d) => d.pnl < 0).length;
    const totalTrades = trades.length;
    const winningTrades = trades.filter((t) => (t.pnl || 0) > 0).length;
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;

    return { totalPnl, tradingDays, greenDays, redDays, totalTrades, winRate };
  }, [dailySummaries, trades]);

  function handleDayClick(date: Date) {
    const dateStr = formatLocalDate(date);
    const summary = dailySummaries[dateStr];
    if (summary) {
      setSelectedDay(summary);
      const dayTrades = trades.filter(
        (t) => formatLocalDate(new Date(t.entry_time)) === dateStr
      );
      setSelectedDayTrades(dayTrades);
    }
  }

  function navigateMonth(direction: number) {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + direction, 1));
  }

  function getDayColor(pnl: number): string {
    if (pnl > 0) return "bg-profit/20 border-profit/50 hover:bg-profit/30";
    if (pnl < 0) return "bg-loss/20 border-loss/50 hover:bg-loss/30";
    return "bg-foreground-tertiary/10 hover:bg-foreground-tertiary/20";
  }

  // Show skeleton on first load only (cached data shows instantly)
  if (isLoading && trades.length === 0) {
    return <CalendarSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Calendar</h1>
          <p className="text-sm text-foreground-secondary">
            Monthly P&L overview
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

      {/* Monthly Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        {monthlyStats.totalPnl >= 0 ? (
          <ProfitCard className="col-span-2 p-4">
            <p className="text-sm text-foreground-tertiary">Total P&L</p>
            <p className="text-2xl font-bold text-profit">+{formatINR(monthlyStats.totalPnl)}</p>
          </ProfitCard>
        ) : (
          <LossCard className="col-span-2 p-4">
            <p className="text-sm text-foreground-tertiary">Total P&L</p>
            <p className="text-2xl font-bold text-loss">{formatINR(monthlyStats.totalPnl)}</p>
          </LossCard>
        )}
        <BaseCard className="p-4">
          <p className="text-sm text-foreground-tertiary">Trading Days</p>
          <p className="text-2xl font-bold">{monthlyStats.tradingDays}</p>
        </BaseCard>
        <BaseCard className="p-4">
          <p className="text-sm text-foreground-tertiary">Green Days</p>
          <p className="text-2xl font-bold text-profit">{monthlyStats.greenDays}</p>
        </BaseCard>
        <BaseCard className="p-4">
          <p className="text-sm text-foreground-tertiary">Red Days</p>
          <p className="text-2xl font-bold text-loss">{monthlyStats.redDays}</p>
        </BaseCard>
        <BaseCard className="p-4">
          <p className="text-sm text-foreground-tertiary">Win Rate</p>
          <p className="text-2xl font-bold">{monthlyStats.winRate.toFixed(0)}%</p>
        </BaseCard>
      </div>

      {/* Calendar Grid */}
      <BaseCard className="p-4">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {WEEKDAYS.map((day) => (
            <div key={day} className="text-center text-sm font-medium text-foreground-tertiary py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const dateStr = formatLocalDate(date);
            const summary = dailySummaries[dateStr];
            const isToday = dateStr === formatLocalDate(new Date());
            const isWeekend = date.getDay() === 0 || date.getDay() === 6;

            return (
              <button
                key={dateStr}
                onClick={() => summary && handleDayClick(date)}
                disabled={!summary}
                className={`aspect-square p-1 rounded-xl border transition-all flex flex-col items-center justify-center ${
                  summary
                    ? getDayColor(summary.pnl)
                    : isWeekend
                    ? "bg-background-surface/50 border-transparent"
                    : "bg-transparent border-transparent"
                } ${isToday ? "ring-2 ring-brand" : ""} ${
                  summary ? "cursor-pointer" : "cursor-default"
                }`}
              >
                <span className={`text-sm ${isToday ? "font-bold" : ""} ${
                  isWeekend && !summary ? "text-foreground-tertiary" : ""
                }`}>
                  {date.getDate()}
                </span>
                {summary && (
                  <span className={`text-xs font-medium ${
                    summary.pnl >= 0 ? "text-profit" : "text-loss"
                  }`}>
                    {summary.pnl >= 0 ? "+" : ""}
                    {Math.abs(summary.pnl) >= 1000
                      ? `${(summary.pnl / 1000).toFixed(1)}k`
                      : summary.pnl.toFixed(0)}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-profit/30 border border-profit/50" />
            <span className="text-sm text-foreground-tertiary">Profit</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-loss/30 border border-loss/50" />
            <span className="text-sm text-foreground-tertiary">Loss</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded ring-2 ring-brand" />
            <span className="text-sm text-foreground-tertiary">Today</span>
          </div>
        </div>
      </BaseCard>

      {/* Day Detail Dialog */}
      <Dialog open={!!selectedDay} onOpenChange={() => setSelectedDay(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedDay && new Date(selectedDay.date).toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </DialogTitle>
          </DialogHeader>
          {selectedDay && (
            <div className="space-y-4">
              {/* Day Stats */}
              <div className={`p-4 rounded-xl ${
                selectedDay.pnl >= 0
                  ? "bg-profit/10 border border-profit/30"
                  : "bg-loss/10 border border-loss/30"
              }`}>
                <p className="text-sm text-foreground-tertiary">Day P&L</p>
                <p className={`text-3xl font-bold ${
                  selectedDay.pnl >= 0 ? "text-profit" : "text-loss"
                }`}>
                  {selectedDay.pnl >= 0 ? "+" : ""}{formatINR(selectedDay.pnl)}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-background-surface rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold">{selectedDay.trades}</p>
                  <p className="text-xs text-foreground-tertiary">Trades</p>
                </div>
                <div className="bg-background-surface rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-profit">{selectedDay.wins}</p>
                  <p className="text-xs text-foreground-tertiary">Won</p>
                </div>
                <div className="bg-background-surface rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-loss">{selectedDay.losses}</p>
                  <p className="text-xs text-foreground-tertiary">Lost</p>
                </div>
              </div>

              {/* Trades List */}
              <div>
                <h4 className="font-medium mb-2">Trades</h4>
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {selectedDayTrades.map((trade) => (
                    <div
                      key={trade.id}
                      className="flex items-center justify-between p-2 bg-background-surface rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        {trade.direction === "LONG" ? (
                          <TrendingUp className="w-4 h-4 text-profit" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-loss" />
                        )}
                        <span className="font-medium">{trade.symbol}</span>
                      </div>
                      <span className={`font-medium ${
                        (trade.pnl || 0) >= 0 ? "text-profit" : "text-loss"
                      }`}>
                        {(trade.pnl || 0) >= 0 ? "+" : ""}{formatINR(trade.pnl || 0)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
