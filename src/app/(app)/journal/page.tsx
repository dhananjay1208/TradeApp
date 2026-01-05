"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { BaseCard, ProfitCard, LossCard } from "@/components/ui/card-variants";
import { Button } from "@/components/ui/button-variants";
import { Badge, DirectionTag } from "@/components/ui/badge-variants";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Plus,
  Search,
  Filter,
  Loader2,
  TrendingUp,
  Clock,
  Trash2,
  CheckCircle2,
} from "lucide-react";
import type { Trade, EmotionType } from "@/types";
import { formatINR } from "@/lib/utils";

const EMOTIONS: { value: EmotionType; label: string }[] = [
  { value: "CONFIDENT", label: "Confident" },
  { value: "CALM", label: "Calm" },
  { value: "FEARFUL", label: "Fearful" },
  { value: "GREEDY", label: "Greedy" },
  { value: "FOMO", label: "FOMO" },
  { value: "REVENGE", label: "Revenge" },
];

export default function JournalPage() {
  const router = useRouter();
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(true);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [filteredTrades, setFilteredTrades] = useState<Trade[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Close trade modal
  const [closingTrade, setClosingTrade] = useState<Trade | null>(null);
  const [exitPrice, setExitPrice] = useState("");
  const [emotionExit, setEmotionExit] = useState<EmotionType | "">("");
  const [exitNotes, setExitNotes] = useState("");
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    loadTrades();
  }, []);

  useEffect(() => {
    filterTrades();
  }, [trades, searchQuery, statusFilter]);

  async function loadTrades() {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("trades")
        .select("*")
        .eq("user_id", user.id)
        .order("entry_time", { ascending: false });

      if (error) throw error;
      setTrades(data || []);
    } catch (error) {
      console.error("Error loading trades:", error);
      toast.error("Failed to load trades");
    } finally {
      setIsLoading(false);
    }
  }

  function filterTrades() {
    let filtered = [...trades];

    if (searchQuery) {
      filtered = filtered.filter((trade) =>
        trade.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((trade) => trade.status === statusFilter);
    }

    setFilteredTrades(filtered);
  }

  async function handleCloseTrade() {
    if (!closingTrade || !exitPrice) {
      toast.error("Please enter exit price");
      return;
    }

    setIsClosing(true);
    try {
      const exit = parseFloat(exitPrice);
      const pnl = closingTrade.direction === "LONG"
        ? (exit - closingTrade.entry_price) * closingTrade.quantity
        : (closingTrade.entry_price - exit) * closingTrade.quantity;

      const pnlPercent = ((exit - closingTrade.entry_price) / closingTrade.entry_price) * 100;

      const { error } = await supabase
        .from("trades")
        .update({
          exit_price: exit,
          exit_time: new Date().toISOString(),
          pnl,
          pnl_percent: closingTrade.direction === "LONG" ? pnlPercent : -pnlPercent,
          emotion_exit: emotionExit || null,
          notes: exitNotes ? `${closingTrade.notes || ""}\n\nExit: ${exitNotes}` : closingTrade.notes,
          status: "CLOSED",
        })
        .eq("id", closingTrade.id);

      if (error) throw error;

      toast.success(pnl >= 0 ? "Trade closed with profit!" : "Trade closed with loss");
      setClosingTrade(null);
      setExitPrice("");
      setEmotionExit("");
      setExitNotes("");
      loadTrades();
    } catch (error) {
      console.error("Error closing trade:", error);
      toast.error("Failed to close trade");
    } finally {
      setIsClosing(false);
    }
  }

  async function handleDeleteTrade(tradeId: string) {
    if (!confirm("Are you sure you want to delete this trade?")) return;

    try {
      const { error } = await supabase.from("trades").delete().eq("id", tradeId);
      if (error) throw error;
      toast.success("Trade deleted");
      loadTrades();
    } catch (error) {
      console.error("Error deleting trade:", error);
      toast.error("Failed to delete trade");
    }
  }

  // Stats
  const openTrades = trades.filter((t) => t.status === "OPEN").length;
  const closedTrades = trades.filter((t) => t.status === "CLOSED");
  const totalPnl = closedTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
  const winningTrades = closedTrades.filter((t) => (t.pnl || 0) > 0).length;
  const winRate = closedTrades.length > 0 ? (winningTrades / closedTrades.length) * 100 : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Trade Journal</h1>
          <p className="text-sm text-foreground-secondary">
            Track and review your trades
          </p>
        </div>
        <Link href="/trade/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Trade
          </Button>
        </Link>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <BaseCard className="p-4">
          <p className="text-sm text-foreground-tertiary">Open Trades</p>
          <p className="text-2xl font-bold text-info">{openTrades}</p>
        </BaseCard>
        <BaseCard className="p-4">
          <p className="text-sm text-foreground-tertiary">Total Trades</p>
          <p className="text-2xl font-bold">{trades.length}</p>
        </BaseCard>
        {totalPnl >= 0 ? (
          <ProfitCard className="p-4">
            <p className="text-sm text-foreground-tertiary">Total P&L</p>
            <p className="text-2xl font-bold text-profit">+{formatINR(totalPnl)}</p>
          </ProfitCard>
        ) : (
          <LossCard className="p-4">
            <p className="text-sm text-foreground-tertiary">Total P&L</p>
            <p className="text-2xl font-bold text-loss">{formatINR(totalPnl)}</p>
          </LossCard>
        )}
        <BaseCard className="p-4">
          <p className="text-sm text-foreground-tertiary">Win Rate</p>
          <p className="text-2xl font-bold">{winRate.toFixed(1)}%</p>
        </BaseCard>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-tertiary" />
          <Input
            placeholder="Search by symbol..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Trades</SelectItem>
            <SelectItem value="OPEN">Open</SelectItem>
            <SelectItem value="CLOSED">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Trade List */}
      {filteredTrades.length === 0 ? (
        <BaseCard className="py-12 text-center">
          <TrendingUp className="w-12 h-12 text-foreground-tertiary mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No trades yet</h3>
          <p className="text-foreground-secondary mb-4">
            Start logging your trades to track performance
          </p>
          <Link href="/trade/new">
            <Button>Add Your First Trade</Button>
          </Link>
        </BaseCard>
      ) : (
        <div className="space-y-3">
          {filteredTrades.map((trade) => (
            <TradeCard
              key={trade.id}
              trade={trade}
              onClose={() => {
                setClosingTrade(trade);
                setExitPrice("");
              }}
              onDelete={() => handleDeleteTrade(trade.id)}
            />
          ))}
        </div>
      )}

      {/* Close Trade Dialog */}
      <Dialog open={!!closingTrade} onOpenChange={() => setClosingTrade(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Close Trade</DialogTitle>
          </DialogHeader>
          {closingTrade && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-background-surface rounded-xl">
                <div>
                  <p className="font-semibold">{closingTrade.symbol}</p>
                  <p className="text-sm text-foreground-tertiary">
                    Entry: ₹{closingTrade.entry_price.toLocaleString("en-IN")} × {closingTrade.quantity}
                  </p>
                </div>
                <DirectionTag direction={closingTrade.direction} />
              </div>

              <div>
                <Label htmlFor="exitPrice">Exit Price *</Label>
                <Input
                  id="exitPrice"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={exitPrice}
                  onChange={(e) => setExitPrice(e.target.value)}
                  className="mt-1.5"
                />
              </div>

              {exitPrice && (
                <div className={`p-3 rounded-xl ${
                  (closingTrade.direction === "LONG"
                    ? parseFloat(exitPrice) > closingTrade.entry_price
                    : parseFloat(exitPrice) < closingTrade.entry_price)
                    ? "bg-profit/10 border border-profit/30"
                    : "bg-loss/10 border border-loss/30"
                }`}>
                  <p className="text-sm text-foreground-tertiary">Estimated P&L</p>
                  <p className={`text-xl font-bold ${
                    (closingTrade.direction === "LONG"
                      ? parseFloat(exitPrice) > closingTrade.entry_price
                      : parseFloat(exitPrice) < closingTrade.entry_price)
                      ? "text-profit"
                      : "text-loss"
                  }`}>
                    {formatINR(
                      closingTrade.direction === "LONG"
                        ? (parseFloat(exitPrice) - closingTrade.entry_price) * closingTrade.quantity
                        : (closingTrade.entry_price - parseFloat(exitPrice)) * closingTrade.quantity
                    )}
                  </p>
                </div>
              )}

              <div>
                <Label>Exit Emotion</Label>
                <Select value={emotionExit} onValueChange={(v) => setEmotionExit(v as EmotionType)}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="How do you feel?" />
                  </SelectTrigger>
                  <SelectContent>
                    {EMOTIONS.map((emotion) => (
                      <SelectItem key={emotion.value} value={emotion.value}>
                        {emotion.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Exit Notes</Label>
                <Textarea
                  placeholder="What did you learn from this trade?"
                  value={exitNotes}
                  onChange={(e) => setExitNotes(e.target.value)}
                  className="mt-1.5"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setClosingTrade(null)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleCloseTrade}
                  disabled={isClosing || !exitPrice}
                >
                  {isClosing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Close Trade
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TradeCard({
  trade,
  onClose,
  onDelete,
}: {
  trade: Trade;
  onClose: () => void;
  onDelete: () => void;
}) {
  const isOpen = trade.status === "OPEN";
  const isProfitable = (trade.pnl || 0) > 0;

  const CardComponent = isOpen ? BaseCard : isProfitable ? ProfitCard : LossCard;

  return (
    <CardComponent className="p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-lg">{trade.symbol}</span>
            <DirectionTag direction={trade.direction} />
            {isOpen && (
              <Badge variant="info">Open</Badge>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-foreground-secondary">
            <span>
              ₹{trade.entry_price.toLocaleString("en-IN")} × {trade.quantity}
            </span>
            {trade.exit_price && (
              <span>→ ₹{trade.exit_price.toLocaleString("en-IN")}</span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {new Date(trade.entry_time).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          {trade.notes && (
            <p className="text-sm text-foreground-tertiary mt-2 line-clamp-1">
              {trade.notes}
            </p>
          )}
        </div>

        <div className="text-right">
          {trade.pnl !== null ? (
            <p className={`text-xl font-bold ${isProfitable ? "text-profit" : "text-loss"}`}>
              {isProfitable ? "+" : ""}{formatINR(trade.pnl)}
            </p>
          ) : (
            <p className="text-xl font-bold text-foreground-tertiary">—</p>
          )}

          <div className="flex items-center gap-1 mt-2 justify-end">
            {isOpen && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                <CheckCircle2 className="w-4 h-4 mr-1" />
                Close
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onDelete}>
              <Trash2 className="w-4 h-4 text-loss" />
            </Button>
          </div>
        </div>
      </div>
    </CardComponent>
  );
}
