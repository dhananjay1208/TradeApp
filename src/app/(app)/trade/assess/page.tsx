"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { BaseCard, ProfitCard } from "@/components/ui/card-variants";
import { Button } from "@/components/ui/button-variants";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Shield,
  ChevronRight,
  ChevronLeft,
  AlertTriangle,
  CheckCircle2,
  Target,
  TrendingUp,
  TrendingDown,
  Loader2,
  Sparkles,
} from "lucide-react";
import type { Profile, TradingRule, TradeType, TradeDirection, EmotionType } from "@/types";
import { formatINR } from "@/lib/utils";

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

const EMOTIONS: { value: EmotionType; label: string; emoji: string; color: string }[] = [
  { value: "CALM", label: "Calm", emoji: "😌", color: "text-profit" },
  { value: "CONFIDENT", label: "Confident", emoji: "😊", color: "text-info" },
  { value: "FEARFUL", label: "Fearful", emoji: "😰", color: "text-warning" },
  { value: "GREEDY", label: "Greedy", emoji: "🤑", color: "text-loss" },
  { value: "FOMO", label: "FOMO", emoji: "😤", color: "text-loss" },
  { value: "REVENGE", label: "Revenge", emoji: "😡", color: "text-loss" },
];

const STEP_TITLES = [
  { title: "Trade Details", subtitle: "What are you planning to trade?" },
  { title: "Risk Assessment", subtitle: "Let's check your risk parameters" },
  { title: "Setup Validation", subtitle: "Have you done your homework?" },
  { title: "Emotion Check", subtitle: "Let's check your emotional state" },
  { title: "Rules Reminder", subtitle: "Your trading rules - read & acknowledge" },
  { title: "Trade Approved", subtitle: "You're ready to trade" },
];

export default function TradeAssessPage() {
  const router = useRouter();
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [rules, setRules] = useState<TradingRule[]>([]);
  const [todayLoss, setTodayLoss] = useState(0);

  // Step state
  const [step, setStep] = useState(1);

  // Step 1: Trade Details
  const [symbol, setSymbol] = useState("");
  const [tradeType, setTradeType] = useState<TradeType>("EQUITY");
  const [direction, setDirection] = useState<TradeDirection>("LONG");
  const [quantity, setQuantity] = useState("");
  const [entryPrice, setEntryPrice] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [targetPrice, setTargetPrice] = useState("");

  // Step 2: Risk Acknowledgments
  const [riskAcknowledged, setRiskAcknowledged] = useState(false);
  const [affordabilityConfirmed, setAffordabilityConfirmed] = useState(false);
  const [limitCheckConfirmed, setLimitCheckConfirmed] = useState(false);

  // Step 3: Setup Validation
  const [setupType, setSetupType] = useState("");
  const [chartAnalyzed, setChartAnalyzed] = useState(false);
  const [levelsIdentified, setLevelsIdentified] = useState(false);
  const [validReason, setValidReason] = useState(false);
  const [matchesPlan, setMatchesPlan] = useState(false);
  const [wouldRepeat, setWouldRepeat] = useState(false);
  const [tradeReason, setTradeReason] = useState("");

  // Step 4: Emotion Check
  const [emotion, setEmotion] = useState<EmotionType | "">("");
  const [notFomo, setNotFomo] = useState(false);
  const [notRevenge, setNotRevenge] = useState(false);
  const [notGreedy, setNotGreedy] = useState(false);
  const [calmState, setCalmState] = useState(false);
  const [willRespectSL, setWillRespectSL] = useState(false);

  // Step 5: Rules Acknowledgment
  const [acknowledgedRules, setAcknowledgedRules] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      // Load profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileData) setProfile(profileData);

      // Load active rules
      const { data: rulesData } = await supabase
        .from("trading_rules")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (rulesData) setRules(rulesData);

      // Calculate today's loss
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const { data: todayTrades } = await supabase
        .from("trades")
        .select("pnl")
        .eq("user_id", user.id)
        .eq("status", "CLOSED")
        .gte("entry_time", startOfDay.toISOString());

      if (todayTrades) {
        const loss = todayTrades.reduce((sum, t) => sum + Math.min(0, t.pnl || 0), 0);
        setTodayLoss(Math.abs(loss));
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  }

  // Calculations
  const calculations = useMemo(() => {
    const qty = parseFloat(quantity) || 0;
    const entry = parseFloat(entryPrice) || 0;
    const sl = parseFloat(stopLoss) || 0;
    const target = parseFloat(targetPrice) || 0;

    const positionSize = qty * entry;
    const riskPerUnit = direction === "LONG" ? entry - sl : sl - entry;
    const riskAmount = Math.abs(riskPerUnit * qty);
    const rewardPerUnit = direction === "LONG" ? target - entry : entry - target;
    const rewardAmount = Math.abs(rewardPerUnit * qty);
    const riskRewardRatio = riskAmount > 0 ? rewardAmount / riskAmount : 0;

    const perTradeRiskLimit = profile?.per_trade_risk || 5000;
    const dailyLossLimit = profile?.daily_loss_limit || 10000;
    const riskUsagePercent = (riskAmount / perTradeRiskLimit) * 100;
    const dailyLossUsed = todayLoss;
    const dailyLossRemaining = Math.max(0, dailyLossLimit - dailyLossUsed);
    const dailyLossPercent = (dailyLossUsed / dailyLossLimit) * 100;

    const exceedsPerTradeRisk = riskAmount > perTradeRiskLimit;
    const exceedsDailyLimit = riskAmount > dailyLossRemaining;

    return {
      positionSize,
      riskAmount,
      rewardAmount,
      riskRewardRatio,
      perTradeRiskLimit,
      dailyLossLimit,
      riskUsagePercent,
      dailyLossUsed,
      dailyLossRemaining,
      dailyLossPercent,
      exceedsPerTradeRisk,
      exceedsDailyLimit,
    };
  }, [quantity, entryPrice, stopLoss, targetPrice, direction, profile, todayLoss]);

  // Validation for each step
  const canProceed = useMemo(() => {
    return {
      step1: symbol && quantity && entryPrice && stopLoss && targetPrice,
      step2: riskAcknowledged && affordabilityConfirmed && limitCheckConfirmed,
      step3: setupType && chartAnalyzed && levelsIdentified && validReason && matchesPlan && wouldRepeat && tradeReason.length >= 20,
      step4: emotion && notFomo && notRevenge && notGreedy && calmState && willRespectSL,
      step5: acknowledgedRules.size === rules.length,
    };
  }, [
    symbol, quantity, entryPrice, stopLoss, targetPrice,
    riskAcknowledged, affordabilityConfirmed, limitCheckConfirmed,
    setupType, chartAnalyzed, levelsIdentified, validReason, matchesPlan, wouldRepeat, tradeReason,
    emotion, notFomo, notRevenge, notGreedy, calmState, willRespectSL,
    acknowledgedRules, rules.length,
  ]);

  function toggleRule(ruleId: string) {
    setAcknowledgedRules((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(ruleId)) {
        newSet.delete(ruleId);
      } else {
        newSet.add(ruleId);
      }
      return newSet;
    });
  }

  function nextStep() {
    if (step < 6) setStep(step + 1);
  }

  function prevStep() {
    if (step > 1) setStep(step - 1);
  }

  function resetAssessment() {
    setStep(1);
    setSymbol("");
    setTradeType("EQUITY");
    setDirection("LONG");
    setQuantity("");
    setEntryPrice("");
    setStopLoss("");
    setTargetPrice("");
    setRiskAcknowledged(false);
    setAffordabilityConfirmed(false);
    setLimitCheckConfirmed(false);
    setSetupType("");
    setChartAnalyzed(false);
    setLevelsIdentified(false);
    setValidReason(false);
    setMatchesPlan(false);
    setWouldRepeat(false);
    setTradeReason("");
    setEmotion("");
    setNotFomo(false);
    setNotRevenge(false);
    setNotGreedy(false);
    setCalmState(false);
    setWillRespectSL(false);
    setAcknowledgedRules(new Set());
  }

  async function createTrade() {
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

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
        quantity: parseFloat(quantity),
        entry_price: parseFloat(entryPrice),
        stop_loss: parseFloat(stopLoss),
        target_price: parseFloat(targetPrice),
        setup_type: setupType,
        emotion_entry: emotion as EmotionType,
        notes: `Trade Reason: ${tradeReason}`,
        entry_time: new Date().toISOString(),
        status: "OPEN",
      };

      const { error } = await supabase.from("trades").insert(tradeData);

      if (error) throw error;

      toast.success("Trade created successfully! Honor your stop loss.");
      router.push("/journal");
    } catch (error) {
      console.error("Error creating trade:", error);
      toast.error("Failed to create trade");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Group rules by category
  const rulesByCategory = useMemo(() => {
    const grouped: Record<string, TradingRule[]> = {};
    rules.forEach((rule) => {
      const cat = rule.category || "General";
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(rule);
    });
    return grouped;
  }, [rules]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand to-info flex items-center justify-center">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Trade Guardian</h1>
          <p className="text-sm text-foreground-secondary">
            {STEP_TITLES[step - 1].subtitle}
          </p>
        </div>
      </div>

      {/* Progress */}
      {step < 6 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-foreground-secondary">Step {step} of 5</span>
            <span className="font-medium">{STEP_TITLES[step - 1].title}</span>
          </div>
          <Progress value={(step / 5) * 100} className="h-2" />
        </div>
      )}

      {/* Step 1: Trade Details */}
      {step === 1 && (
        <BaseCard className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <Label>Symbol</Label>
              <Input
                placeholder="NIFTY, RELIANCE..."
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Type</Label>
              <Select value={tradeType} onValueChange={(v) => setTradeType(v as TradeType)}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EQUITY">Equity</SelectItem>
                  <SelectItem value="OPTIONS">Options</SelectItem>
                  <SelectItem value="FUTURES">Futures</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Direction</Label>
              <div className="flex gap-2 mt-1.5">
                <button
                  onClick={() => setDirection("LONG")}
                  className={`flex-1 py-3 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${
                    direction === "LONG"
                      ? "bg-profit/20 border-profit text-profit"
                      : "border-border hover:border-profit/50"
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  LONG
                </button>
                <button
                  onClick={() => setDirection("SHORT")}
                  className={`flex-1 py-3 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${
                    direction === "SHORT"
                      ? "bg-loss/20 border-loss text-loss"
                      : "border-border hover:border-loss/50"
                  }`}
                >
                  <TrendingDown className="w-4 h-4" />
                  SHORT
                </button>
              </div>
            </div>
            <div>
              <Label>Quantity</Label>
              <Input
                type="number"
                placeholder="50"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="mt-1.5"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Entry Price</Label>
              <Input
                type="number"
                placeholder="24500"
                value={entryPrice}
                onChange={(e) => setEntryPrice(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Stop Loss *</Label>
              <Input
                type="number"
                placeholder="24400"
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Target</Label>
              <Input
                type="number"
                placeholder="24700"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                className="mt-1.5"
              />
            </div>
          </div>

          {/* R:R Display */}
          {calculations.riskRewardRatio > 0 && (
            <div className={`p-4 rounded-xl ${
              calculations.riskRewardRatio >= 1 ? "bg-profit/10 border border-profit/30" : "bg-warning/10 border border-warning/30"
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground-secondary">Risk:Reward Ratio</span>
                <span className={`text-lg font-bold ${
                  calculations.riskRewardRatio >= 1 ? "text-profit" : "text-warning"
                }`}>
                  1:{calculations.riskRewardRatio.toFixed(1)}
                </span>
              </div>
              {calculations.riskRewardRatio < 1 && (
                <p className="text-xs text-warning mt-1">
                  Warning: Risk is greater than potential reward
                </p>
              )}
            </div>
          )}
        </BaseCard>
      )}

      {/* Step 2: Risk Assessment */}
      {step === 2 && (
        <BaseCard className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-background-surface rounded-xl">
              <p className="text-sm text-foreground-tertiary">Position Size</p>
              <p className="text-xl font-bold">{formatINR(calculations.positionSize)}</p>
            </div>
            <div className="p-4 bg-background-surface rounded-xl">
              <p className="text-sm text-foreground-tertiary">Risk on Trade</p>
              <p className={`text-xl font-bold ${
                calculations.exceedsPerTradeRisk ? "text-loss" : "text-warning"
              }`}>
                {formatINR(calculations.riskAmount)}
              </p>
            </div>
          </div>

          {/* Per-trade risk limit */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Per-trade risk limit</span>
              <span className={calculations.exceedsPerTradeRisk ? "text-loss" : ""}>
                {formatINR(calculations.riskAmount)} / {formatINR(calculations.perTradeRiskLimit)}
              </span>
            </div>
            <Progress
              value={Math.min(100, calculations.riskUsagePercent)}
              className={`h-3 ${
                calculations.riskUsagePercent > 100
                  ? "[&>div]:bg-loss"
                  : calculations.riskUsagePercent > 75
                  ? "[&>div]:bg-warning"
                  : "[&>div]:bg-profit"
              }`}
            />
            {calculations.exceedsPerTradeRisk && (
              <p className="text-xs text-loss flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Exceeds your per-trade risk limit!
              </p>
            )}
          </div>

          {/* Daily loss remaining */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Daily loss used</span>
              <span>
                {formatINR(calculations.dailyLossUsed)} / {formatINR(calculations.dailyLossLimit)}
              </span>
            </div>
            <Progress
              value={calculations.dailyLossPercent}
              className={`h-3 ${
                calculations.dailyLossPercent > 75
                  ? "[&>div]:bg-loss"
                  : calculations.dailyLossPercent > 50
                  ? "[&>div]:bg-warning"
                  : "[&>div]:bg-profit"
              }`}
            />
            <p className="text-xs text-foreground-tertiary">
              Remaining: {formatINR(calculations.dailyLossRemaining)}
            </p>
          </div>

          {calculations.exceedsDailyLimit && (
            <div className="p-4 bg-loss/10 border border-loss/30 rounded-xl">
              <p className="text-loss font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                This trade would exceed your daily loss limit!
              </p>
              <p className="text-sm text-foreground-secondary mt-1">
                Consider reducing position size or skipping this trade.
              </p>
            </div>
          )}

          <div className="space-y-3 pt-4 border-t border-border">
            <label className="flex items-start gap-3 cursor-pointer">
              <Checkbox checked={riskAcknowledged} onCheckedChange={(c) => setRiskAcknowledged(!!c)} />
              <span className="text-sm">I understand this trade risks {formatINR(calculations.riskAmount)}</span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <Checkbox checked={affordabilityConfirmed} onCheckedChange={(c) => setAffordabilityConfirmed(!!c)} />
              <span className="text-sm">I can afford to lose this amount today</span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <Checkbox checked={limitCheckConfirmed} onCheckedChange={(c) => setLimitCheckConfirmed(!!c)} />
              <span className="text-sm">This will not exceed my daily loss limit</span>
            </label>
          </div>
        </BaseCard>
      )}

      {/* Step 3: Setup Validation */}
      {step === 3 && (
        <BaseCard className="space-y-6">
          <div>
            <Label className="mb-3 block">What is your setup type?</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SETUP_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => setSetupType(type)}
                  className={`py-2 px-3 rounded-lg border text-sm transition-all ${
                    setupType === type
                      ? "bg-brand/20 border-brand text-brand"
                      : "border-border hover:border-brand/50"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Confirm each before proceeding:</Label>
            <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg bg-background-surface">
              <Checkbox checked={chartAnalyzed} onCheckedChange={(c) => setChartAnalyzed(!!c)} />
              <span className="text-sm">I have analyzed the chart properly</span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg bg-background-surface">
              <Checkbox checked={levelsIdentified} onCheckedChange={(c) => setLevelsIdentified(!!c)} />
              <span className="text-sm">I have identified clear support/resistance levels</span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg bg-background-surface">
              <Checkbox checked={validReason} onCheckedChange={(c) => setValidReason(!!c)} />
              <span className="text-sm">I have a valid technical/fundamental reason</span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg bg-background-surface">
              <Checkbox checked={matchesPlan} onCheckedChange={(c) => setMatchesPlan(!!c)} />
              <span className="text-sm">This setup matches my trading plan</span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg bg-background-surface">
              <Checkbox checked={wouldRepeat} onCheckedChange={(c) => setWouldRepeat(!!c)} />
              <span className="text-sm">I would take this trade again in similar conditions</span>
            </label>
          </div>

          <div>
            <Label>Why are you taking this trade? (Required)</Label>
            <Textarea
              placeholder="Describe your trade thesis... (minimum 20 characters)"
              value={tradeReason}
              onChange={(e) => setTradeReason(e.target.value)}
              className="mt-1.5"
              rows={3}
            />
            <p className="text-xs text-foreground-tertiary mt-1">
              {tradeReason.length}/20 characters minimum
            </p>
          </div>
        </BaseCard>
      )}

      {/* Step 4: Emotion Check */}
      {step === 4 && (
        <BaseCard className="space-y-6">
          <div>
            <Label className="mb-3 block">How are you feeling right now?</Label>
            <div className="grid grid-cols-3 gap-3">
              {EMOTIONS.map((e) => (
                <button
                  key={e.value}
                  onClick={() => setEmotion(e.value)}
                  className={`py-4 px-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${
                    emotion === e.value
                      ? `${e.color} bg-current/10 border-current`
                      : "border-border hover:border-foreground-tertiary"
                  }`}
                >
                  <span className="text-2xl">{e.emoji}</span>
                  <span className="text-sm font-medium">{e.label}</span>
                </button>
              ))}
            </div>
          </div>

          {(emotion === "GREEDY" || emotion === "FOMO" || emotion === "REVENGE") && (
            <div className="p-4 bg-loss/10 border border-loss/30 rounded-xl">
              <p className="text-loss font-medium">Warning: Dangerous Emotional State</p>
              <p className="text-sm text-foreground-secondary mt-1">
                Trading while feeling {emotion.toLowerCase()} often leads to losses. Consider stepping away.
              </p>
            </div>
          )}

          <div className="space-y-3 pt-4 border-t border-border">
            <Label className="text-warning flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              HONEST CHECK - Answer truthfully:
            </Label>
            <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg bg-background-surface">
              <Checkbox checked={notFomo} onCheckedChange={(c) => setNotFomo(!!c)} />
              <span className="text-sm">I am NOT taking this trade out of FOMO</span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg bg-background-surface">
              <Checkbox checked={notRevenge} onCheckedChange={(c) => setNotRevenge(!!c)} />
              <span className="text-sm">I am NOT trying to recover previous losses (revenge trading)</span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg bg-background-surface">
              <Checkbox checked={notGreedy} onCheckedChange={(c) => setNotGreedy(!!c)} />
              <span className="text-sm">I am NOT being greedy (proper position size)</span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg bg-background-surface">
              <Checkbox checked={calmState} onCheckedChange={(c) => setCalmState(!!c)} />
              <span className="text-sm">I am in a calm, rational state of mind</span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg bg-background-surface">
              <Checkbox checked={willRespectSL} onCheckedChange={(c) => setWillRespectSL(!!c)} />
              <span className="text-sm font-medium">I will respect my stop loss NO MATTER WHAT</span>
            </label>
          </div>

          <div className="p-4 bg-info/10 border border-info/30 rounded-xl">
            <p className="text-sm text-foreground-secondary">
              <span className="font-medium text-info">Remember:</span> One wrong trade can wipe out weeks of good trading. Respect your capital!
            </p>
          </div>
        </BaseCard>
      )}

      {/* Step 5: Rules Reminder */}
      {step === 5 && (
        <BaseCard className="space-y-6">
          <div className="space-y-4">
            {Object.entries(rulesByCategory).map(([category, categoryRules]) => (
              <div key={category}>
                <Label className="text-xs uppercase tracking-wider text-foreground-tertiary mb-2 block">
                  {category}
                </Label>
                <div className="space-y-2">
                  {categoryRules.map((rule) => (
                    <label
                      key={rule.id}
                      className={`flex items-start gap-3 cursor-pointer p-3 rounded-lg border transition-all ${
                        acknowledgedRules.has(rule.id)
                          ? "bg-profit/10 border-profit/30"
                          : "bg-background-surface border-transparent"
                      }`}
                    >
                      <Checkbox
                        checked={acknowledgedRules.has(rule.id)}
                        onCheckedChange={() => toggleRule(rule.id)}
                      />
                      <span className="text-sm">{rule.rule_text}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center text-sm text-foreground-tertiary">
            {acknowledgedRules.size}/{rules.length} rules acknowledged
          </div>

          <div className="p-4 bg-gradient-to-r from-brand/10 to-info/10 border border-brand/30 rounded-xl text-center">
            <p className="font-semibold text-lg">Respect Your Money</p>
            <p className="text-sm text-foreground-secondary mt-1">
              This capital took effort to earn. Trade wisely. Be in the 5% who succeed.
            </p>
          </div>
        </BaseCard>
      )}

      {/* Step 6: Trade Approved */}
      {step === 6 && (
        <div className="space-y-6">
          <ProfitCard className="text-center py-6">
            <CheckCircle2 className="w-16 h-16 text-profit mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-profit">Trade Approved</h2>
            <p className="text-foreground-secondary mt-1">All checks passed. You may proceed.</p>
          </ProfitCard>

          <BaseCard className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Target className="w-5 h-5 text-brand" />
              Trade Summary
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-foreground-tertiary">Symbol</p>
                <p className="font-medium">{symbol} ({direction})</p>
              </div>
              <div>
                <p className="text-foreground-tertiary">Type</p>
                <p className="font-medium">{tradeType}</p>
              </div>
              <div>
                <p className="text-foreground-tertiary">Entry</p>
                <p className="font-medium">{formatINR(parseFloat(entryPrice))}</p>
              </div>
              <div>
                <p className="text-foreground-tertiary">Quantity</p>
                <p className="font-medium">{quantity}</p>
              </div>
              <div>
                <p className="text-foreground-tertiary">Stop Loss</p>
                <p className="font-medium text-loss">{formatINR(parseFloat(stopLoss))}</p>
              </div>
              <div>
                <p className="text-foreground-tertiary">Target</p>
                <p className="font-medium text-profit">{formatINR(parseFloat(targetPrice))}</p>
              </div>
              <div>
                <p className="text-foreground-tertiary">Risk</p>
                <p className="font-medium">{formatINR(calculations.riskAmount)}</p>
              </div>
              <div>
                <p className="text-foreground-tertiary">R:R Ratio</p>
                <p className="font-medium">1:{calculations.riskRewardRatio.toFixed(1)}</p>
              </div>
            </div>
            <div className="pt-4 border-t border-border">
              <p className="text-foreground-tertiary text-sm mb-1">Setup & Emotion</p>
              <p className="font-medium">{setupType} | {emotion}</p>
            </div>
            <div>
              <p className="text-foreground-tertiary text-sm mb-1">Trade Reason</p>
              <p className="text-sm">{tradeReason}</p>
            </div>
          </BaseCard>

          <div className="p-4 bg-warning/10 border border-warning/30 rounded-xl">
            <p className="text-sm text-center">
              <span className="font-medium text-warning">Final Reminder:</span> Honor your stop loss at {formatINR(parseFloat(stopLoss))}
            </p>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-3">
        {step > 1 && step < 6 && (
          <Button variant="outline" onClick={prevStep} className="flex-1">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
        )}

        {step < 5 && (
          <Button
            onClick={nextStep}
            disabled={!canProceed[`step${step}` as keyof typeof canProceed]}
            className="flex-1"
          >
            Next Step
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        )}

        {step === 5 && (
          <Button
            onClick={nextStep}
            disabled={!canProceed.step5}
            className="flex-1"
          >
            <Shield className="w-4 h-4 mr-2" />
            Trade Approved
          </Button>
        )}

        {step === 6 && (
          <>
            <Button variant="outline" onClick={resetAssessment} className="flex-1">
              Start Fresh
            </Button>
            <Button onClick={createTrade} disabled={isSubmitting} className="flex-1">
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              Add to Journal
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
