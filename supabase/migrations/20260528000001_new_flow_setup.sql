-- =============================================================================
-- New Flow Setup — Public Order Form + AI Negotiation + Design Upload
-- =============================================================================

-- A) Create Supabase Storage bucket for design files
-- =============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'design-files',
  'design-files', 
  false,
  10485760,
  ARRAY['image/jpeg','image/png','image/webp','image/gif','application/pdf',
        'application/postscript','application/octet-stream']
) ON CONFLICT (id) DO NOTHING;

-- B) Add missing columns to orders table (only if they don't exist)
-- =============================================================================

-- Design file uploaded by customer via public order form
ALTER TABLE orders ADD COLUMN IF NOT EXISTS design_file_url TEXT;

-- Customer identity (no login required — stored directly on order)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_name TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_email TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_whatsapp TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_address TEXT;

-- Order specifications: sizes, quantity per size, custom notes
ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_specs JSONB;

-- Negotiation columns (some may already exist from previous migration)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS negotiated_price INTEGER;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS original_price INTEGER;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS negotiation_summary TEXT;

-- AI chat session tracking
ALTER TABLE orders ADD COLUMN IF NOT EXISTS ai_session_id TEXT;

-- C) RLS policies for design-files Storage bucket
-- =============================================================================

-- Admin can read all design files
CREATE POLICY "Admin read design files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'design-files');

-- Public can upload (for order form — no login required)
CREATE POLICY "Public upload design files"  
ON storage.objects FOR INSERT
TO anon
WITH CHECK (bucket_id = 'design-files');

-- D) Update orders table RLS
-- =============================================================================

-- Allow anonymous insert (public order form, no login needed)
CREATE POLICY "Public can create orders"
ON orders FOR INSERT
TO anon
WITH CHECK (true);

-- Admin can do everything
CREATE POLICY "Admin full access orders"
ON orders FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- =============================================================================
-- DONE
-- =============================================================================
