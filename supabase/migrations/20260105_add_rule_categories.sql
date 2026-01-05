-- ============================================
-- MIGRATION: Add categories to trading rules
-- ============================================

-- Step 1: Add category column to trading_rules table
ALTER TABLE trading_rules
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'General';

-- Step 2: Update existing default rules with categories for existing users
UPDATE public.trading_rules
SET category = 'Risk Management'
WHERE rule_text ILIKE '%risk%' OR rule_text ILIKE '%stop loss%' OR rule_text ILIKE '%position sizing%';

UPDATE public.trading_rules
SET category = 'Profit Taking'
WHERE rule_text ILIKE '%profit%' OR rule_text ILIKE '%winner%' OR rule_text ILIKE '%trail%';

UPDATE public.trading_rules
SET category = 'Discipline'
WHERE rule_text ILIKE '%patient%' OR rule_text ILIKE '%target%' OR rule_text ILIKE '%fomo%';

-- Step 3: Update the function that creates default rules on user signup (for new users)
CREATE OR REPLACE FUNCTION public.create_default_rules()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.trading_rules (user_id, rule_text, category, is_default, is_active, sort_order) VALUES
    -- Risk Management
    (NEW.id, 'Never risk more than 2% of capital on a single trade', 'Risk Management', true, true, 1),
    (NEW.id, 'Always set stop-loss before entering a trade', 'Risk Management', true, true, 2),
    (NEW.id, 'Stop trading after 3 consecutive losses', 'Risk Management', true, true, 3),
    -- Profit Taking
    (NEW.id, 'Take partial profits at 1:1 risk-reward', 'Profit Taking', true, true, 4),
    (NEW.id, 'Trail stop-loss after taking partial profits', 'Profit Taking', true, true, 5),
    -- Discipline
    (NEW.id, 'No trading during the first 15 minutes', 'Discipline', true, true, 6),
    (NEW.id, 'Review and journal every trade within 24 hours', 'Discipline', true, true, 7);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
