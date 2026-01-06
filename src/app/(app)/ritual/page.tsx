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
  Loader2,
  Shield,
  Target,
  Brain,
  Award,
  Lightbulb,
} from "lucide-react";
import type { MoodType } from "@/types";
import { formatINR } from "@/lib/utils";

// Famous Trading Quotes for sidebar cards
const WISDOM_QUOTES = {
  left: [
    {
      quote: "The goal of a successful trader is to make the best trades. Money is secondary.",
      author: "Alexander Elder",
      icon: Target,
      gradient: "from-brand/20 to-brand/5",
      border: "border-brand/30",
      iconColor: "text-brand",
    },
    {
      quote: "Risk comes from not knowing what you are doing.",
      author: "Warren Buffett",
      icon: Shield,
      gradient: "from-warning/20 to-warning/5",
      border: "border-warning/30",
      iconColor: "text-warning",
    },
    {
      quote: "The elements of good trading are: cutting losses, cutting losses, and cutting losses.",
      author: "Ed Seykota",
      icon: AlertTriangle,
      gradient: "from-loss/20 to-loss/5",
      border: "border-loss/30",
      iconColor: "text-loss",
    },
  ],
  right: [
    {
      quote: "Be fearful when others are greedy and greedy when others are fearful.",
      author: "Warren Buffett",
      icon: Brain,
      gradient: "from-info/20 to-info/5",
      border: "border-info/30",
      iconColor: "text-info",
    },
    {
      quote: "Discipline is the bridge between goals and accomplishment.",
      author: "Jim Rohn",
      icon: Award,
      gradient: "from-profit/20 to-profit/5",
      border: "border-profit/30",
      iconColor: "text-profit",
    },
    {
      quote: "It's not whether you're right or wrong, but how much you make when right and lose when wrong.",
      author: "George Soros",
      icon: Lightbulb,
      gradient: "from-purple-500/20 to-purple-500/5",
      border: "border-purple-500/30",
      iconColor: "text-purple-400",
    },
  ],
};

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

  const greeting = new Date().getHours() < 12 ? "Good Morning" :
                   new Date().getHours() < 17 ? "Good Afternoon" : "Good Evening";

  // Wisdom Quote Card Component
  const WisdomCard = ({ quote, author, icon: Icon, gradient, border, iconColor }: {
    quote: string;
    author: string;
    icon: React.ElementType;
    gradient: string;
    border: string;
    iconColor: string;
  }) => (
    <BaseCard className={`bg-gradient-to-br ${gradient} ${border} !p-3`}>
      <div className="flex items-start gap-2.5">
        <div className={`w-8 h-8 rounded-lg bg-background-card/50 flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
        <div className="min-w-0">
          <p className="text-xs italic text-foreground-primary leading-relaxed">
            &ldquo;{quote}&rdquo;
          </p>
          <p className="text-[10px] text-foreground-tertiary font-medium mt-1.5">— {author}</p>
        </div>
      </div>
    </BaseCard>
  );

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[280px_1fr_280px] gap-6">
      {/* Left Sidebar - Wisdom Quotes (hidden on smaller screens) */}
      <div className="hidden xl:block">
        <div className="sticky top-6 h-[calc(100vh-6rem)] flex flex-col">
          <h3 className="text-xs font-semibold text-foreground-tertiary uppercase tracking-wider px-1 mb-4">
            Trading Wisdom
          </h3>
          <div className="flex-1 flex flex-col justify-between">
            {WISDOM_QUOTES.left.map((item, index) => (
              <WisdomCard key={index} {...item} />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Success Banner when ritual is complete */}
        {ritualAlreadyDone && (
          <BaseCard className="bg-gradient-to-r from-profit/20 to-profit/5 border-profit/30">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-profit/20 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-profit" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-profit">Ritual Complete!</p>
                <p className="text-sm text-foreground-secondary">
                  You have completed your pre-market ritual today. Review your rules below.
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => router.push("/dashboard")}>
                Dashboard
              </Button>
            </div>
          </BaseCard>
        )}

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
            {ritualAlreadyDone ? "Review your trading rules and mindset" : "Complete your pre-market ritual before trading"}
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

      {/* Start Trading Button - only show if not already done */}
      {!ritualAlreadyDone && (
        <>
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
        </>
      )}
      </div>

      {/* Right Sidebar - More Wisdom Quotes (hidden on smaller screens) */}
      <div className="hidden xl:block">
        <div className="sticky top-6 h-[calc(100vh-6rem)] flex flex-col">
          <h3 className="text-xs font-semibold text-foreground-tertiary uppercase tracking-wider px-1 mb-4">
            Trader Mindset
          </h3>
          <div className="flex-1 flex flex-col justify-between">
            {WISDOM_QUOTES.right.map((item, index) => (
              <WisdomCard key={index} {...item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
