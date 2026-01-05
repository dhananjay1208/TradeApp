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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
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
  Edit2,
  Plus,
  Trash2,
} from "lucide-react";
import type { Profile, TradingRule, RuleCategory } from "@/types";

const RULE_CATEGORIES: { value: RuleCategory; label: string; color: string }[] = [
  { value: "Risk Management", label: "Risk Management", color: "text-warning" },
  { value: "Profit Taking", label: "Profit Taking", color: "text-profit" },
  { value: "Discipline", label: "Discipline", color: "text-info" },
  { value: "General", label: "General", color: "text-foreground-secondary" },
];

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

  // Rule editing state
  const [editingRule, setEditingRule] = useState<TradingRule | null>(null);
  const [isAddingRule, setIsAddingRule] = useState(false);
  const [ruleText, setRuleText] = useState("");
  const [ruleCategory, setRuleCategory] = useState<RuleCategory>("General");
  const [isSavingRule, setIsSavingRule] = useState(false);

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

  function openEditRule(rule: TradingRule) {
    setEditingRule(rule);
    setRuleText(rule.rule_text);
    setRuleCategory(rule.category || "General");
  }

  function openAddRule() {
    setIsAddingRule(true);
    setRuleText("");
    setRuleCategory("General");
  }

  function closeRuleModal() {
    setEditingRule(null);
    setIsAddingRule(false);
    setRuleText("");
    setRuleCategory("General");
  }

  async function handleSaveRule() {
    if (!ruleText.trim()) {
      toast.error("Please enter a rule");
      return;
    }

    setIsSavingRule(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (editingRule) {
        // Update existing rule
        const { error } = await supabase
          .from("trading_rules")
          .update({
            rule_text: ruleText.trim(),
            category: ruleCategory,
          })
          .eq("id", editingRule.id);

        if (error) throw error;

        setRules(rules.map((r) =>
          r.id === editingRule.id
            ? { ...r, rule_text: ruleText.trim(), category: ruleCategory }
            : r
        ));
        toast.success("Rule updated");
      } else {
        // Add new rule
        const maxSortOrder = Math.max(...rules.map((r) => r.sort_order), 0);
        const { data, error } = await supabase
          .from("trading_rules")
          .insert({
            user_id: user.id,
            rule_text: ruleText.trim(),
            category: ruleCategory,
            is_default: false,
            is_active: true,
            sort_order: maxSortOrder + 1,
          })
          .select()
          .single();

        if (error) throw error;
        if (data) setRules([...rules, data]);
        toast.success("Rule added");
      }

      closeRuleModal();
    } catch (error) {
      console.error("Error saving rule:", error);
      toast.error("Failed to save rule");
    } finally {
      setIsSavingRule(false);
    }
  }

  async function handleDeleteRule(ruleId: string) {
    if (!confirm("Are you sure you want to delete this rule?")) return;

    try {
      const { error } = await supabase
        .from("trading_rules")
        .delete()
        .eq("id", ruleId);

      if (error) throw error;
      setRules(rules.filter((r) => r.id !== ruleId));
      toast.success("Rule deleted");
    } catch (error) {
      console.error("Error deleting rule:", error);
      toast.error("Failed to delete rule");
    }
  }

  function getCategoryColor(category: RuleCategory | undefined): string {
    const cat = RULE_CATEGORIES.find((c) => c.value === category);
    return cat?.color || "text-foreground-secondary";
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
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-info" />
            <h2 className="text-lg font-semibold">Trading Rules</h2>
          </div>
          <Button variant="outline" size="sm" onClick={openAddRule}>
            <Plus className="w-4 h-4 mr-1" />
            Add Rule
          </Button>
        </div>
        <p className="text-sm text-foreground-secondary mb-4">
          Enable or disable rules for your pre-market ritual
        </p>
        <div className="space-y-3">
          {rules.map((rule, index) => (
            <div
              key={rule.id}
              className="p-3 bg-background-surface rounded-xl"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-foreground-tertiary text-sm font-medium">
                      {index + 1}.
                    </span>
                    <span className={rule.is_active ? "" : "text-foreground-tertiary"}>
                      {rule.rule_text}
                    </span>
                  </div>
                  <span className={`text-xs ${getCategoryColor(rule.category)}`}>
                    {rule.category || "General"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditRule(rule)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Switch
                    checked={rule.is_active}
                    onCheckedChange={(checked) => handleToggleRule(rule.id, checked)}
                  />
                </div>
              </div>
            </div>
          ))}
          {rules.length === 0 && (
            <p className="text-center text-foreground-tertiary py-4">
              No trading rules yet. Add your first rule to get started.
            </p>
          )}
        </div>
      </BaseCard>

      {/* Edit/Add Rule Dialog */}
      <Dialog open={!!editingRule || isAddingRule} onOpenChange={closeRuleModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingRule ? "Edit Rule" : "Add New Rule"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Rule Text</Label>
              <Textarea
                placeholder="Enter your trading rule..."
                value={ruleText}
                onChange={(e) => setRuleText(e.target.value)}
                className="mt-1.5"
                rows={3}
              />
            </div>
            <div>
              <Label>Category</Label>
              <Select value={ruleCategory} onValueChange={(v) => setRuleCategory(v as RuleCategory)}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RULE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      <span className={cat.color}>{cat.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3">
              {editingRule && !editingRule.is_default && (
                <Button
                  variant="danger"
                  onClick={() => {
                    handleDeleteRule(editingRule.id);
                    closeRuleModal();
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              )}
              <div className="flex-1" />
              <Button variant="outline" onClick={closeRuleModal}>
                Cancel
              </Button>
              <Button onClick={handleSaveRule} disabled={isSavingRule}>
                {isSavingRule ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-1" />
                    Save
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
