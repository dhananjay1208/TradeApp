-- Add category column to trading_rules table
ALTER TABLE trading_rules
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'General';

-- Update existing default rules with categories
-- First, delete the old default rules to replace them with categorized ones
-- This will only affect new users going forward

-- Update the function that creates default rules on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user_rules()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert default trading rules with categories for the new user
  INSERT INTO public.trading_rules (user_id, rule_text, category, is_default, is_active, sort_order)
  VALUES
    -- Risk Management (rules 1-3)
    (NEW.id, 'Never risk more than 2% of capital on a single trade', 'Risk Management', true, true, 1),
    (NEW.id, 'Always set stop-loss before entering a trade', 'Risk Management', true, true, 2),
    (NEW.id, 'Stop trading after 3 consecutive losses', 'Risk Management', true, true, 3),
    -- Profit Taking (rules 4-5)
    (NEW.id, 'Take partial profits at 1:1 risk-reward', 'Profit Taking', true, true, 4),
    (NEW.id, 'Trail stop-loss after taking partial profits', 'Profit Taking', true, true, 5),
    -- Discipline (rules 6-7)
    (NEW.id, 'No trading during the first 15 minutes', 'Discipline', true, true, 6),
    (NEW.id, 'Review and journal every trade within 24 hours', 'Discipline', true, true, 7);
  RETURN NEW;
END;
$$;
