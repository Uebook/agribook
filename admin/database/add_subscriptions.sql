-- Subscription System Tables
-- Run this in Supabase SQL Editor

-- Subscription Types table (managed by admin)
CREATE TABLE IF NOT EXISTS subscription_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL, -- e.g., "Monthly Subscription", "Per Book Pay"
  type VARCHAR(50) NOT NULL, -- 'monthly' or 'per_book'
  description TEXT,
  price DECIMAL(10,2) NOT NULL, -- Monthly price for monthly, or price per book for per_book
  duration_days INTEGER, -- For monthly subscriptions (e.g., 30 days)
  features JSONB, -- Additional features/benefits
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User Subscriptions table (tracks user's active subscriptions)
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  subscription_type_id UUID REFERENCES subscription_types(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'active', -- active, expired, cancelled
  start_date TIMESTAMP DEFAULT NOW(),
  end_date TIMESTAMP, -- For monthly subscriptions
  auto_renew BOOLEAN DEFAULT false,
  payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add subscription_type_id to payments table for tracking subscription payments
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS subscription_type_id UUID REFERENCES subscription_types(id) ON DELETE SET NULL;

-- Add subscription_id to users table to track current active subscription
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS subscription_type_id UUID REFERENCES subscription_types(id) ON DELETE SET NULL;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_subscription_types_type ON subscription_types(type);
CREATE INDEX IF NOT EXISTS idx_subscription_types_active ON subscription_types(is_active);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_dates ON user_subscriptions(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_payments_subscription ON payments(subscription_type_id);

-- Trigger for subscription_types updated_at
DROP TRIGGER IF EXISTS update_subscription_types_updated_at ON subscription_types;
CREATE TRIGGER update_subscription_types_updated_at BEFORE UPDATE ON subscription_types
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for user_subscriptions updated_at
DROP TRIGGER IF EXISTS update_user_subscriptions_updated_at ON user_subscriptions;
CREATE TRIGGER update_user_subscriptions_updated_at BEFORE UPDATE ON user_subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to check if user has active subscription
CREATE OR REPLACE FUNCTION has_active_subscription(user_id_param UUID)
RETURNS BOOLEAN AS $$
DECLARE
  active_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO active_count
  FROM user_subscriptions
  WHERE user_id = user_id_param
    AND status = 'active'
    AND (end_date IS NULL OR end_date > NOW());
  
  RETURN active_count > 0;
END;
$$ language 'plpgsql';

-- Insert default subscription types
INSERT INTO subscription_types (name, type, description, price, duration_days, features, is_active)
VALUES 
  ('Monthly Subscription', 'monthly', 'Unlimited access to all books for one month', 299.00, 30, '{"unlimited_books": true, "ad_free": true, "priority_support": true}'::jsonb, true),
  ('Per Book Pay', 'per_book', 'Pay for individual books as you read', 0.00, NULL, '{"pay_per_book": true}'::jsonb, true)
ON CONFLICT DO NOTHING;
