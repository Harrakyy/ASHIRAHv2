-- =============================================================================
-- AI Readiness Migration - Fix 3: Add AI columns to services table
-- =============================================================================

ALTER TABLE services
ADD COLUMN IF NOT EXISTS min_order_qty INTEGER DEFAULT 12,
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'apparel',
ADD COLUMN IF NOT EXISTS materials TEXT,
ADD COLUMN IF NOT EXISTS available_sizes TEXT DEFAULT 'S,M,L,XL,XXL',
ADD COLUMN IF NOT EXISTS printing_techniques TEXT,
ADD COLUMN IF NOT EXISTS discount_max_percent INTEGER DEFAULT 10;

-- Update data services yang sudah ada
UPDATE services SET 
  min_order_qty = 12,
  category = 'jersey',
  materials = 'Polyester Drifit, Polyester Spandex',
  printing_techniques = 'Sublimation, DTG, Screen Printing',
  discount_max_percent = 10
WHERE nama ILIKE '%jersey%';

UPDATE services SET 
  min_order_qty = 12,
  category = 'tshirt',
  materials = 'Cotton Combed 30s, Cotton Combed 24s, CVC',
  printing_techniques = 'DTG, Screen Printing, Transfer Paper',
  discount_max_percent = 10
WHERE nama ILIKE '%t-shirt%' OR nama ILIKE '%kaos%';

UPDATE services SET
  min_order_qty = 6,
  category = 'jacket',
  materials = 'Fleece, Taslan, Terry',
  printing_techniques = 'Bordir, Screen Printing',
  discount_max_percent = 8
WHERE nama ILIKE '%jacket%' OR nama ILIKE '%jaket%';

-- =============================================================================
-- AI Readiness Migration - Fix 4: Add AI columns to orders table
-- =============================================================================

ALTER TABLE orders
ADD COLUMN IF NOT EXISTS ai_generated BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS negotiated_price NUMERIC,
ADD COLUMN IF NOT EXISTS original_price NUMERIC,
ADD COLUMN IF NOT EXISTS customer_specifications JSONB,
ADD COLUMN IF NOT EXISTS customer_notes TEXT;

-- =============================================================================
-- AI Readiness Migration - Fix 5: Add conversation support to messages
-- =============================================================================

ALTER TABLE messages
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' 
  CHECK (role IN ('user', 'assistant', 'system')),
ADD COLUMN IF NOT EXISTS conversation_id UUID,
ADD COLUMN IF NOT EXISTS metadata JSONB;

-- Buat tabel conversations untuk grouping
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES profiles(id),
  type TEXT DEFAULT 'support' 
    CHECK (type IN ('support', 'ai_public', 'ai_negotiation')),
  status TEXT DEFAULT 'active'
    CHECK (status IN ('active', 'resolved', 'archived')),
  title TEXT,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Helper function to check admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE POLICY "Users can view own conversations"
ON conversations FOR SELECT
USING (auth.uid() = customer_id OR is_admin());

CREATE POLICY "Users can create conversations"
ON conversations FOR INSERT
WITH CHECK (auth.uid() = customer_id OR is_admin());

CREATE POLICY "Admin can update conversations"
ON conversations FOR UPDATE
USING (is_admin());

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_messages_role ON messages(role);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_conversations_customer_id ON conversations(customer_id);
CREATE INDEX IF NOT EXISTS idx_conversations_status ON conversations(status);
