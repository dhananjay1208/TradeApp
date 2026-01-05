"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { BaseCard } from "@/components/ui/card-variants";
import { Button } from "@/components/ui/button-variants";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import type { TradeType, TradeDirection, EmotionType } from "@/types";

const TRADE_TYPES: { value: TradeType; label: string }[] = [
  { value: "EQUITY", label: "Equity" },
  { value: "OPTIONS", label: "Options" },
  { value: "FUTURES", label: "Futures" },
];

const EMOTIONS: { value: EmotionType; label: string }[] = [
  { value: "CONFIDENT", label: "Confident" },
  { value: "CALM", label: "Calm" },
  { value: "FEARFUL", label: "Fearful" },
  { value: "GREEDY", label: "Greedy" },
  { value: "FOMO", label: "FOMO" },
  { value: "REVENGE", label: "Revenge" },
];

const SETUP_TYPES = [
  "Breakout",
  "Breakdown",
  "Pullback",
  "Reversal",
  "Trend Following",
  "Range Trade",
  "News Based",
  "Other",
];

export default function NewTradePage() {
  const router = useRouter();
  const supabase = createClient();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [direction, setDirection] = useState<TradeDirection>("LONG");

  // Form state
  const [symbol, setSymbol] = useState("");
  const [tradeType, setTradeType] = useState<TradeType>("EQUITY");
  const [quantity, setQuantity] = useState("");
  const [entryPrice, setEntryPrice] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [setupType, setSetupType] = useState("");
  const [emotionEntry, setEmotionEntry] = useState<EmotionType | "">("");
  const [notes, setNotes] = useState("");

  // Options specific
  const [optionType, setOptionType] = useState<"CE" | "PE">("CE");
  const [strikePrice, setStrikePrice] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  // Calculated values
  const qty = parseFloat(quantity) || 0;
  const entry = parseFloat(entryPrice) || 0;
  const sl = parseFloat(stopLoss) || 0;
  const target = parseFloat(targetPrice) || 0;

  const riskPerShare = direction === "LONG" ? entry - sl : sl - entry;
  const totalRisk = sl > 0 ? Math.abs(riskPerShare * qty) : 0;
  const potentialProfit = target > 0 ? Math.abs((direction === "LONG" ? target - entry : entry - target) * qty) : 0;
  const riskReward = totalRisk > 0 && potentialProfit > 0 ? (potentialProfit / totalRisk).toFixed(2) : "—";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!symbol || !quantity || !entryPrice) {
      toast.error("Please fill in required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      // Get today's session if exists
      const today = new Date().toISOString().split("T")[0];
      const { data: session } = await supabase
        .from("daily_sessions")
        .select("id")
        .eq("user_id", user.id)
        .eq("session_date", today)
        .single();

      const tradeData = {
        user_id: user.id,
        session_id: session?.id || null,
        symbol: symbol.toUpperCase(),
        trade_type: tradeType,
        direction,
        quantity: parseInt(quantity),
        entry_price: parseFloat(entryPrice),
        stop_loss: stopLoss ? parseFloat(stopLoss) : null,
        target_price: targetPrice ? parseFloat(targetPrice) : null,
        setup_type: setupType || null,
        emotion_entry: emotionEntry || null,
        notes: notes || null,
        entry_time: new Date().toISOString(),
        status: "OPEN",
        // Options fields
        option_type: tradeType === "OPTIONS" ? optionType : null,
        strike_price: tradeType === "OPTIONS" && strikePrice ? parseFloat(strikePrice) : null,
        expiry_date: tradeType === "OPTIONS" && expiryDate ? expiryDate : null,
      };

      const { error } = await supabase.from("trades").insert(tradeData);

      if (error) throw error;

      toast.success("Trade added successfully!");
      router.push("/journal");
    } catch (error) {
      console.error("Error adding trade:", error);
      toast.error("Failed to add trade");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">New Trade</h1>
          <p className="text-sm text-foreground-secondary">Log your trade entry</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Direction Toggle */}
        <BaseCard>
          <Label className="mb-3 block">Direction</Label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setDirection("LONG")}
              className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                direction === "LONG"
                  ? "bg-profit/20 border-profit text-profit"
                  : "bg-background-surface border-transparent hover:border-border-subtle"
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              <span className="font-semibold">LONG</span>
            </button>
            <button
              type="button"
              onClick={() => setDirection("SHORT")}
              className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                direction === "SHORT"
                  ? "bg-loss/20 border-loss text-loss"
                  : "bg-background-surface border-transparent hover:border-border-subtle"
              }`}
            >
              <TrendingDown className="w-5 h-5" />
              <span className="font-semibold">SHORT</span>
            </button>
          </div>
        </BaseCard>

        {/* Basic Details */}
        <BaseCard>
          <h2 className="text-lg font-semibold mb-4">Trade Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <Label htmlFor="symbol">Symbol *</Label>
              <Input
                id="symbol"
                placeholder="e.g., RELIANCE, NIFTY"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                className="mt-1.5"
                required
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <Label htmlFor="tradeType">Type</Label>
              <Select value={tradeType} onValueChange={(v) => setTradeType(v as TradeType)}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TRADE_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="100"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="mt-1.5"
                required
                min="1"
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <Label htmlFor="entryPrice">Entry Price *</Label>
              <Input
                id="entryPrice"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={entryPrice}
                onChange={(e) => setEntryPrice(e.target.value)}
                className="mt-1.5"
                required
              />
            </div>
          </div>
        </BaseCard>

        {/* Options Fields */}
        {tradeType === "OPTIONS" && (
          <BaseCard>
            <h2 className="text-lg font-semibold mb-4">Options Details</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Option Type</Label>
                <div className="grid grid-cols-2 gap-2 mt-1.5">
                  <button
                    type="button"
                    onClick={() => setOptionType("CE")}
                    className={`p-2 rounded-lg text-sm font-medium transition-all ${
                      optionType === "CE"
                        ? "bg-profit/20 text-profit border border-profit"
                        : "bg-background-surface"
                    }`}
                  >
                    CE (Call)
                  </button>
                  <button
                    type="button"
                    onClick={() => setOptionType("PE")}
                    className={`p-2 rounded-lg text-sm font-medium transition-all ${
                      optionType === "PE"
                        ? "bg-loss/20 text-loss border border-loss"
                        : "bg-background-surface"
                    }`}
                  >
                    PE (Put)
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="strikePrice">Strike Price</Label>
                <Input
                  id="strikePrice"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={strikePrice}
                  onChange={(e) => setStrikePrice(e.target.value)}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="mt-1.5"
                />
              </div>
            </div>
          </BaseCard>
        )}

        {/* Risk Management */}
        <BaseCard>
          <h2 className="text-lg font-semibold mb-4">Risk Management</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="stopLoss">Stop Loss</Label>
              <Input
                id="stopLoss"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="targetPrice">Target Price</Label>
              <Input
                id="targetPrice"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                className="mt-1.5"
              />
            </div>
          </div>

          {/* Risk Summary */}
          {(totalRisk > 0 || potentialProfit > 0) && (
            <div className="mt-4 p-4 bg-background-surface rounded-xl">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xs text-foreground-tertiary">Risk</p>
                  <p className="text-lg font-bold text-loss">₹{totalRisk.toLocaleString("en-IN")}</p>
                </div>
                <div>
                  <p className="text-xs text-foreground-tertiary">Reward</p>
                  <p className="text-lg font-bold text-profit">₹{potentialProfit.toLocaleString("en-IN")}</p>
                </div>
                <div>
                  <p className="text-xs text-foreground-tertiary">R:R Ratio</p>
                  <p className="text-lg font-bold text-info">{riskReward}</p>
                </div>
              </div>
            </div>
          )}
        </BaseCard>

        {/* Psychology */}
        <BaseCard>
          <h2 className="text-lg font-semibold mb-4">Trade Psychology</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="setupType">Setup Type</Label>
              <Select value={setupType} onValueChange={setSetupType}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select setup" />
                </SelectTrigger>
                <SelectContent>
                  {SETUP_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="emotion">Entry Emotion</Label>
              <Select value={emotionEntry} onValueChange={(v) => setEmotionEntry(v as EmotionType)}>
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
          </div>

          <div className="mt-4">
            <Label htmlFor="notes">Trade Notes</Label>
            <Textarea
              id="notes"
              placeholder="Why are you taking this trade? What's your thesis?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1.5 min-h-[80px]"
            />
          </div>
        </BaseCard>

        {/* Submit */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Adding...
              </>
            ) : (
              "Add Trade"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
