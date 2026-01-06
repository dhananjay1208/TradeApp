"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useRitualData, useUser } from "@/hooks/use-data";
import { BaseCard } from "@/components/ui/card-variants";
import { Button } from "@/components/ui/button-variants";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { RitualSkeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Quote,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Sun,
  Moon,
  Loader2
} from "lucide-react";
import type { MoodType } from "@/types";
import { formatINR } from "@/lib/utils";

const MOODS: { value: MoodType; label: string; emoji: string; color: string }[] = [
  { value: "EXCELLENT", label: "Excellent", emoji: "🔥", color: "bg-profit/20 border-profit text-profit" },
  { value: "GOOD", label: "Good", emoji: "😊", color: "bg-brand/20 border-brand text-brand" },
  { value: "NEUTRAL", label: "Neutral", emoji: "😐", color: "bg-info/20 border-info text-info" },
  { value: "STRESSED", label: "Stressed", emoji: "😰", color: "bg-warning/20 border-warning text-warning" },
  { value: "ANXIOUS", label: "Anxious", emoji: "😤", color: "bg-loss/20 border-loss text-loss" },
];

export default function RitualPage() {
  const router = useRouter();
  const supabase = createClient();
  const { user, isLoading: userLoading } = useUser();
  const { profile, rules, todaySession, quote, isLoading, mutate } = useRitualData();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkedRules, setCheckedRules] = useState<Set<string>>(new Set());
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [marketNotes, setMarketNotes] = useState("");

  // Check if ritual already done
  const ritualAlreadyDone = todaySession?.session_started_at !== null;

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/login");
    }
  }, [user, userLoading, router]);

  function toggleRule(ruleId: string) {
    setCheckedRules((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(ruleId)) {
        newSet.delete(ruleId);
      } else {
        newSet.add(ruleId);
      }
      return newSet;
    });
  }

  const allRulesChecked = rules.length > 0 && checkedRules.size === rules.length;
  const canStart = allRulesChecked && selectedMood !== null;

  async function handleStartTrading() {
    if (!canStart) return;

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date().toISOString().split("T")[0];

      // Upsert daily session
      const { error } = await supabase
        .from("daily_sessions")
        .upsert({
          user_id: user.id,
          session_date: today,
          pre_market_mood: selectedMood,
          rules_checked: Array.from(checkedRules),
          pre_market_notes: marketNotes || null,
          session_started_at: new Date().toISOString(),
        }, {
          onConflict: "user_id,session_date"
        });

      if (error) throw error;

      toast.success("Ritual complete! Ready to trade with discipline.");
      mutate(); // Refresh cached data
      router.push("/dashboard");
    } catch (error) {
      console.error("Error starting trading session:", error);
      toast.error("Failed to start trading session");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Show skeleton on first load only (cached data shows instantly)
  if (isLoading && !profile) {
    return <RitualSkeleton />;
  }

  if (ritualAlreadyDone) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <CheckCircle2 className="w-16 h-16 text-profit mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Ritual Complete!</h1>
          <p className="text-foreground-secondary mb-6">
            You have already completed your pre-market ritual today.
          </p>
          <Button onClick={() => router.push("/dashboard")}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const greeting = new Date().getHours() < 12 ? "Good Morning" :
                   new Date().getHours() < 17 ? "Good Afternoon" : "Good Evening";

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          {new Date().getHours() < 17 ? (
            <Sun className="w-6 h-6 text-warning" />
          ) : (
            <Moon className="w-6 h-6 text-info" />
          )}
          <h1 className="text-2xl font-bold">{greeting}!</h1>
        </div>
        <p className="text-foreground-secondary">
          Complete your pre-market ritual before trading
        </p>
      </div>

      {/* Motivational Quote */}
      {quote && (
        <BaseCard className="bg-gradient-to-br from-brand/10 to-transparent border-brand/30">
          <div className="flex gap-4">
            <Quote className="w-8 h-8 text-brand flex-shrink-0" />
            <div>
              <p className="text-lg italic text-foreground-primary mb-2">
                &ldquo;{quote.quote_text}&rdquo;
              </p>
              {quote.author && (
                <p className="text-sm text-foreground-secondary">— {quote.author}</p>
              )}
            </div>
          </div>
        </BaseCard>
      )}

      {/* Risk Limits Card */}
      {profile && (
        <BaseCard>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-warning" />
            <h2 className="text-lg font-semibold">Today&apos;s Risk Limits</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-background-surface rounded-xl p-4">
              <p className="text-sm text-foreground-tertiary">Max Daily Loss</p>
              <p className="text-xl font-bold text-loss">{formatINR(profile.daily_loss_limit)}</p>
            </div>
            <div className="bg-background-surface rounded-xl p-4">
              <p className="text-sm text-foreground-tertiary">Max Per Trade</p>
              <p className="text-xl font-bold text-warning">{formatINR(profile.per_trade_risk)}</p>
            </div>
            <div className="bg-background-surface rounded-xl p-4">
              <p className="text-sm text-foreground-tertiary">Max Trades</p>
              <p className="text-xl font-bold text-info">{profile.max_trades_per_day}</p>
            </div>
            <div className="bg-background-surface rounded-xl p-4">
              <p className="text-sm text-foreground-tertiary">Capital at Risk</p>
              <p className="text-xl font-bold text-foreground-primary">{formatINR(profile.trading_capital)}</p>
            </div>
          </div>
        </BaseCard>
      )}

      {/* Trading Rules Checklist */}
      <BaseCard>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Trading Rules</h2>
          <span className="text-sm text-foreground-tertiary">
            {checkedRules.size}/{rules.length} acknowledged
          </span>
        </div>
        <div className="space-y-3">
          {rules.map((rule, index) => (
            <label
              key={rule.id}
              className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                checkedRules.has(rule.id)
                  ? "bg-profit/10 border border-profit/30"
                  : "bg-background-surface hover:bg-background-elevated"
              }`}
            >
              <Checkbox
                checked={checkedRules.has(rule.id)}
                onCheckedChange={() => toggleRule(rule.id)}
                className="mt-0.5"
              />
              <div className="flex-1">
                <span className="text-xs text-foreground-tertiary">Rule {index + 1}</span>
                <p className={checkedRules.has(rule.id) ? "text-profit" : "text-foreground-primary"}>
                  {rule.rule_text}
                </p>
              </div>
              {checkedRules.has(rule.id) && (
                <CheckCircle2 className="w-5 h-5 text-profit flex-shrink-0" />
              )}
            </label>
          ))}
        </div>
      </BaseCard>

      {/* Mood Selector */}
      <BaseCard>
        <h2 className="text-lg font-semibold mb-4">How are you feeling today?</h2>
        <div className="grid grid-cols-5 gap-2">
          {MOODS.map((mood) => (
            <button
              key={mood.value}
              onClick={() => setSelectedMood(mood.value)}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all ${
                selectedMood === mood.value
                  ? mood.color
                  : "bg-background-surface border-transparent hover:border-border-subtle"
              }`}
            >
              <span className="text-2xl">{mood.emoji}</span>
              <span className="text-xs">{mood.label}</span>
            </button>
          ))}
        </div>
      </BaseCard>

      {/* Market Notes */}
      <BaseCard>
        <h2 className="text-lg font-semibold mb-4">Pre-Market Notes (Optional)</h2>
        <Textarea
          placeholder="Market sentiment, key levels to watch, planned setups..."
          value={marketNotes}
          onChange={(e) => setMarketNotes(e.target.value)}
          className="min-h-[100px] bg-background-surface border-border"
        />
      </BaseCard>

      {/* Start Trading Button */}
      <Button
        onClick={handleStartTrading}
        disabled={!canStart || isSubmitting}
        className="w-full h-14 text-lg"
        size="lg"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Starting...
          </>
        ) : (
          <>
            <TrendingUp className="w-5 h-5 mr-2" />
            I Am Ready to Trade
          </>
        )}
      </Button>

      {!canStart && (
        <p className="text-center text-sm text-foreground-tertiary">
          {!allRulesChecked && "Acknowledge all rules"}
          {!allRulesChecked && !selectedMood && " and "}
          {!selectedMood && "select your mood"} to continue
        </p>
      )}
    </div>
  );
}
