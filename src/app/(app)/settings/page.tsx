"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { BaseCard } from "@/components/ui/card-variants";
import { Button } from "@/components/ui/button-variants";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  User,
  Wallet,
  AlertTriangle,
  Target,
  Shield,
  LogOut,
  Loader2,
  Save,
} from "lucide-react";
import type { Profile, TradingRule } from "@/types";

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [rules, setRules] = useState<TradingRule[]>([]);

  // Form state
  const [fullName, setFullName] = useState("");
  const [tradingCapital, setTradingCapital] = useState("");
  const [dailyLossLimit, setDailyLossLimit] = useState("");
  const [perTradeRisk, setPerTradeRisk] = useState("");
  const [maxTradesPerDay, setMaxTradesPerDay] = useState("");
  const [dailyTarget, setDailyTarget] = useState("");
  const [weeklyTarget, setWeeklyTarget] = useState("");
  const [monthlyTarget, setMonthlyTarget] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
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

      if (profileData) {
        setProfile(profileData);
        setFullName(profileData.full_name || "");
        setTradingCapital(profileData.trading_capital?.toString() || "100000");
        setDailyLossLimit(profileData.daily_loss_limit?.toString() || "5000");
        setPerTradeRisk(profileData.per_trade_risk?.toString() || "1000");
        setMaxTradesPerDay(profileData.max_trades_per_day?.toString() || "10");
        setDailyTarget(profileData.daily_target?.toString() || "2000");
        setWeeklyTarget(profileData.weekly_target?.toString() || "8000");
        setMonthlyTarget(profileData.monthly_target?.toString() || "30000");
      }

      // Load rules
      const { data: rulesData } = await supabase
        .from("trading_rules")
        .select("*")
        .eq("user_id", user.id)
        .order("sort_order", { ascending: true });

      if (rulesData) setRules(rulesData);
    } catch (error) {
      console.error("Error loading settings:", error);
      toast.error("Failed to load settings");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSaveProfile() {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          trading_capital: parseFloat(tradingCapital),
          daily_loss_limit: parseFloat(dailyLossLimit),
          per_trade_risk: parseFloat(perTradeRisk),
          max_trades_per_day: parseInt(maxTradesPerDay),
          daily_target: parseFloat(dailyTarget),
          weekly_target: parseFloat(weeklyTarget),
          monthly_target: parseFloat(monthlyTarget),
        })
        .eq("id", user.id);

      if (error) throw error;
      toast.success("Settings saved successfully");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleToggleRule(ruleId: string, isActive: boolean) {
    try {
      const { error } = await supabase
        .from("trading_rules")
        .update({ is_active: isActive })
        .eq("id", ruleId);

      if (error) throw error;

      setRules(rules.map((r) =>
        r.id === ruleId ? { ...r, is_active: isActive } : r
      ));
    } catch (error) {
      console.error("Error toggling rule:", error);
      toast.error("Failed to update rule");
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

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
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-foreground-secondary">
          Manage your account and trading preferences
        </p>
      </div>

      {/* Profile Section */}
      <BaseCard>
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-brand" />
          <h2 className="text-lg font-semibold">Profile</h2>
        </div>
        <div className="space-y-4">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              value={profile?.email || ""}
              disabled
              className="mt-1.5 opacity-50"
            />
          </div>
        </div>
      </BaseCard>

      {/* Capital Settings */}
      <BaseCard>
        <div className="flex items-center gap-2 mb-4">
          <Wallet className="w-5 h-5 text-brand" />
          <h2 className="text-lg font-semibold">Trading Capital</h2>
        </div>
        <div>
          <Label htmlFor="tradingCapital">Total Capital (₹)</Label>
          <Input
            id="tradingCapital"
            type="number"
            value={tradingCapital}
            onChange={(e) => setTradingCapital(e.target.value)}
            className="mt-1.5"
          />
          <p className="text-xs text-foreground-tertiary mt-1">
            Your total trading capital for ROI calculations
          </p>
        </div>
      </BaseCard>

      {/* Risk Limits */}
      <BaseCard>
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-warning" />
          <h2 className="text-lg font-semibold">Risk Limits</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="dailyLossLimit">Max Daily Loss (₹)</Label>
            <Input
              id="dailyLossLimit"
              type="number"
              value={dailyLossLimit}
              onChange={(e) => setDailyLossLimit(e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="perTradeRisk">Max Per Trade (₹)</Label>
            <Input
              id="perTradeRisk"
              type="number"
              value={perTradeRisk}
              onChange={(e) => setPerTradeRisk(e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="maxTradesPerDay">Max Trades/Day</Label>
            <Input
              id="maxTradesPerDay"
              type="number"
              value={maxTradesPerDay}
              onChange={(e) => setMaxTradesPerDay(e.target.value)}
              className="mt-1.5"
            />
          </div>
        </div>
      </BaseCard>

      {/* Goals */}
      <BaseCard>
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-profit" />
          <h2 className="text-lg font-semibold">Profit Targets</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="dailyTarget">Daily Target (₹)</Label>
            <Input
              id="dailyTarget"
              type="number"
              value={dailyTarget}
              onChange={(e) => setDailyTarget(e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="weeklyTarget">Weekly Target (₹)</Label>
            <Input
              id="weeklyTarget"
              type="number"
              value={weeklyTarget}
              onChange={(e) => setWeeklyTarget(e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="monthlyTarget">Monthly Target (₹)</Label>
            <Input
              id="monthlyTarget"
              type="number"
              value={monthlyTarget}
              onChange={(e) => setMonthlyTarget(e.target.value)}
              className="mt-1.5"
            />
          </div>
        </div>
      </BaseCard>

      {/* Save Button */}
      <Button
        onClick={handleSaveProfile}
        disabled={isSaving}
        className="w-full"
      >
        {isSaving ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Saving...
          </>
        ) : (
          <>
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </>
        )}
      </Button>

      <Separator />

      {/* Trading Rules */}
      <BaseCard>
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-info" />
          <h2 className="text-lg font-semibold">Trading Rules</h2>
        </div>
        <p className="text-sm text-foreground-secondary mb-4">
          Enable or disable rules for your pre-market ritual
        </p>
        <div className="space-y-3">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="flex items-center justify-between p-3 bg-background-surface rounded-xl"
            >
              <span className={rule.is_active ? "" : "text-foreground-tertiary"}>
                {rule.rule_text}
              </span>
              <Switch
                checked={rule.is_active}
                onCheckedChange={(checked) => handleToggleRule(rule.id, checked)}
              />
            </div>
          ))}
        </div>
      </BaseCard>

      <Separator />

      {/* Logout */}
      <Button
        variant="danger"
        onClick={handleLogout}
        className="w-full"
      >
        <LogOut className="w-4 h-4 mr-2" />
        Log Out
      </Button>
    </div>
  );
}
