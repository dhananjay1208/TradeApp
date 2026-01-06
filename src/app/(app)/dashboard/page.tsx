"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDashboardData, useUser } from "@/hooks/use-data";
import { BaseCard, ProfitCard, LossCard } from "@/components/ui/card-variants";
import { Button } from "@/components/ui/button-variants";
import { Badge, StatusIndicator } from "@/components/ui/badge-variants";
import { Progress } from "@/components/ui/progress";
import { DashboardSkeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Target,
  AlertTriangle,
  Plus,
  ArrowRight,
  Trophy,
  Flame,
  Clock,
  Shield,
} from "lucide-react";
import { formatINR } from "@/lib/utils";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading: userLoading } = useUser();
  const { profile, todaySession, todayTrades, recentTrades, isLoading } = useDashboardData();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/login");
    }
  }, [user, userLoading, router]);

  // Show skeleton while loading (only on first load, cached data shows instantly)
  if (isLoading && !profile) {
    return <DashboardSkeleton />;
  }

  // Calculate stats
  const closedTrades = todayTrades.filter((t) => t.status === "CLOSED");
  const openTrades = todayTrades.filter((t) => t.status === "OPEN");
  const todayPnl = closedTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
  const winningTrades = closedTrades.filter((t) => (t.pnl || 0) > 0).length;
  const losingTrades = closedTrades.filter((t) => (t.pnl || 0) < 0).length;
  const winRate = closedTrades.length > 0 ? (winningTrades / closedTrades.length) * 100 : 0;
  const bestTrade = closedTrades.length > 0 ? Math.max(...closedTrades.map((t) => t.pnl || 0)) : 0;
  const worstTrade = closedTrades.length > 0 ? Math.min(...closedTrades.map((t) => t.pnl || 0)) : 0;

  // Risk calculations
  const dailyLossUsed = Math.abs(Math.min(0, todayPnl));
  const riskPercent = profile ? (dailyLossUsed / profile.daily_loss_limit) * 100 : 0;
  const tradesRemaining = profile ? profile.max_trades_per_day - todayTrades.length : 0;

  // Target progress
  const targetProgress = profile && profile.daily_target > 0
    ? Math.min(100, (todayPnl / profile.daily_target) * 100)
    : 0;

  const ritualDone = todaySession?.session_started_at !== null;

  // Greeting based on time
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
  const userName = profile?.full_name?.split(" ")[0] || "Trader";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{greeting}, {userName}!</h1>
          <p className="text-sm text-foreground-secondary">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {ritualDone ? (
            <StatusIndicator status="active" label="Ritual Done" />
          ) : (
            <Link href="/ritual">
              <Button variant="secondary" size="sm">
                <Flame className="w-4 h-4 mr-2" />
                Start Ritual
              </Button>
            </Link>
          )}
          <Link href="/trade/new">
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              New Trade
            </Button>
          </Link>
        </div>
      </div>

      {/* Ritual Reminder */}
      {!ritualDone && (
        <BaseCard className="bg-gradient-to-r from-warning/10 to-transparent border-warning/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-warning/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="font-semibold">Complete Your Pre-Market Ritual</p>
                <p className="text-sm text-foreground-secondary">
                  Review your rules and set your mindset before trading
                </p>
              </div>
            </div>
            <Link href="/ritual">
              <Button variant="outline" size="sm">
                Start Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </BaseCard>
      )}

      {/* Trade Guardian Reminder */}
      <BaseCard className="bg-gradient-to-r from-brand/20 to-info/10 border-brand/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-brand" />
            </div>
            <div>
              <p className="font-semibold">Before You Trade</p>
              <p className="text-sm text-foreground-secondary">
                Use Trade Guardian to validate your next trade
              </p>
            </div>
          </div>
          <Link href="/trade/assess">
            <Button size="sm">
              Start Assessment
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </BaseCard>

      {/* P&L Hero Card */}
      {todayPnl >= 0 ? (
        <ProfitCard>
          <div className="text-center py-4">
            <p className="text-sm text-foreground-secondary mb-1">Today&apos;s P&L</p>
            <p className="text-4xl font-bold text-profit mb-2">
              +{formatINR(todayPnl)}
            </p>
            {profile && todayPnl > 0 && (
              <p className="text-sm text-foreground-secondary">
                {((todayPnl / profile.trading_capital) * 100).toFixed(2)}% ROI
              </p>
            )}
          </div>
          <div className="grid grid-cols-4 gap-4 pt-4 border-t border-profit/20">
            <div className="text-center">
              <p className="text-2xl font-bold">{todayTrades.length}</p>
              <p className="text-xs text-foreground-tertiary">Trades</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-profit">{winningTrades}</p>
              <p className="text-xs text-foreground-tertiary">Won</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-loss">{losingTrades}</p>
              <p className="text-xs text-foreground-tertiary">Lost</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{winRate.toFixed(0)}%</p>
              <p className="text-xs text-foreground-tertiary">Win Rate</p>
            </div>
          </div>
        </ProfitCard>
      ) : (
        <LossCard>
          <div className="text-center py-4">
            <p className="text-sm text-foreground-secondary mb-1">Today&apos;s P&L</p>
            <p className="text-4xl font-bold text-loss mb-2">
              {formatINR(todayPnl)}
            </p>
            {profile && (
              <p className="text-sm text-foreground-secondary">
                {((todayPnl / profile.trading_capital) * 100).toFixed(2)}% ROI
              </p>
            )}
          </div>
          <div className="grid grid-cols-4 gap-4 pt-4 border-t border-loss/20">
            <div className="text-center">
              <p className="text-2xl font-bold">{todayTrades.length}</p>
              <p className="text-xs text-foreground-tertiary">Trades</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-profit">{winningTrades}</p>
              <p className="text-xs text-foreground-tertiary">Won</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-loss">{losingTrades}</p>
              <p className="text-xs text-foreground-tertiary">Lost</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{winRate.toFixed(0)}%</p>
              <p className="text-xs text-foreground-tertiary">Win Rate</p>
            </div>
          </div>
        </LossCard>
      )}

      {/* Risk Meter & Target Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Risk Meter */}
        <BaseCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <AlertTriangle className={`w-4 h-4 ${riskPercent > 75 ? "text-loss" : riskPercent > 50 ? "text-warning" : "text-profit"}`} />
              Risk Meter
            </h3>
            <Badge variant={riskPercent > 75 ? "loss" : riskPercent > 50 ? "warning" : "profit"}>
              {riskPercent.toFixed(0)}% Used
            </Badge>
          </div>
          <Progress
            value={Math.min(100, riskPercent)}
            className={`h-3 ${riskPercent > 75 ? "[&>div]:bg-loss" : riskPercent > 50 ? "[&>div]:bg-warning" : "[&>div]:bg-profit"}`}
          />
          <div className="flex justify-between mt-2 text-sm">
            <span className="text-foreground-tertiary">
              Loss: {formatINR(dailyLossUsed)}
            </span>
            <span className="text-foreground-tertiary">
              Limit: {formatINR(profile?.daily_loss_limit || 0)}
            </span>
          </div>
          {riskPercent >= 100 && (
            <div className="mt-4 p-3 bg-loss/10 border border-loss/30 rounded-xl">
              <p className="text-sm text-loss font-semibold">
                Daily loss limit reached! Consider stopping for today.
              </p>
            </div>
          )}
        </BaseCard>

        {/* Target Progress */}
        <BaseCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Target className="w-4 h-4 text-brand" />
              Daily Target
            </h3>
            {targetProgress >= 100 && (
              <Badge variant="profit">
                <Trophy className="w-3 h-3 mr-1" />
                Achieved!
              </Badge>
            )}
          </div>
          <Progress
            value={Math.max(0, targetProgress)}
            className="h-3 [&>div]:bg-brand"
          />
          <div className="flex justify-between mt-2 text-sm">
            <span className="text-foreground-tertiary">
              P&L: {formatINR(todayPnl)}
            </span>
            <span className="text-foreground-tertiary">
              Target: {formatINR(profile?.daily_target || 0)}
            </span>
          </div>
        </BaseCard>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <BaseCard className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-info" />
            <span className="text-sm text-foreground-tertiary">Open Positions</span>
          </div>
          <p className="text-2xl font-bold">{openTrades.length}</p>
        </BaseCard>
        <BaseCard className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-brand" />
            <span className="text-sm text-foreground-tertiary">Trades Left</span>
          </div>
          <p className="text-2xl font-bold">{Math.max(0, tradesRemaining)}</p>
        </BaseCard>
        <BaseCard className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-profit" />
            <span className="text-sm text-foreground-tertiary">Best Trade</span>
          </div>
          <p className={`text-2xl font-bold ${bestTrade > 0 ? "text-profit" : ""}`}>
            {bestTrade > 0 ? `+${formatINR(bestTrade)}` : "—"}
          </p>
        </BaseCard>
        <BaseCard className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-loss" />
            <span className="text-sm text-foreground-tertiary">Worst Trade</span>
          </div>
          <p className={`text-2xl font-bold ${worstTrade < 0 ? "text-loss" : ""}`}>
            {worstTrade < 0 ? formatINR(worstTrade) : "—"}
          </p>
        </BaseCard>
      </div>

      {/* Recent Trades */}
      <BaseCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Recent Trades</h3>
          <Link href="/journal" className="text-sm text-brand hover:text-brand-hover">
            View All
          </Link>
        </div>
        {recentTrades.length === 0 ? (
          <div className="text-center py-8">
            <TrendingUp className="w-10 h-10 text-foreground-tertiary mx-auto mb-2" />
            <p className="text-foreground-secondary">No trades yet</p>
            <Link href="/trade/new">
              <Button variant="outline" size="sm" className="mt-3">
                Add Trade
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {recentTrades.map((trade) => (
              <div
                key={trade.id}
                className="flex items-center justify-between p-3 bg-background-surface rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    trade.direction === "LONG" ? "bg-profit/20" : "bg-loss/20"
                  }`}>
                    {trade.direction === "LONG" ? (
                      <TrendingUp className="w-4 h-4 text-profit" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-loss" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{trade.symbol}</p>
                    <p className="text-xs text-foreground-tertiary">
                      {new Date(trade.entry_time).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {trade.pnl !== null ? (
                    <p className={`font-semibold ${trade.pnl >= 0 ? "text-profit" : "text-loss"}`}>
                      {trade.pnl >= 0 ? "+" : ""}{formatINR(trade.pnl)}
                    </p>
                  ) : (
                    <Badge variant="info">Open</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </BaseCard>
    </div>
  );
}
