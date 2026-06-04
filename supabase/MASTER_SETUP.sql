-- =============================================================================
-- Ashira.co — MASTER SETUP
-- Combined from all 11 migration files, deduplicated, idempotent.
-- Run ONCE on a blank Supabase database.
-- =============================================================================

-- =============================================================================
-- Extensions
-- =============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- Enum types (must exist before tables reference them)
-- =============================================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'approval_status') THEN
    CREATE TYPE public.approval_status AS ENUM ('pending_approval', 'approved', 'rejected');
  END IF;
END$$;

-- =============================================================================
-- TABLES
-- =============================================================================

-- === FROM: 001_initial_schema.sql (with all later column additions) ===

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    whatsapp TEXT,
    role TEXT DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
    status TEXT DEFAULT 'active',
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama TEXT NOT NULL,
    deskripsi TEXT,
    harga NUMERIC NOT NULL,
    estimasi TEXT,
    max_slots INTEGER DEFAULT 10,
    current_slots INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    -- FROM: 006_ai_readiness.sql
    min_order_qty INTEGER DEFAULT 12,
    category TEXT DEFAULT 'apparel',
    materials TEXT,
    available_sizes TEXT DEFAULT 'S,M,L,XL,XXL',
    printing_techniques TEXT,
    discount_max_percent INTEGER DEFAULT 10
);

CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT NOT NULL UNIQUE,
    customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'review', 'revision', 'completed', 'cancelled')),
    progress NUMERIC DEFAULT 0,
    price NUMERIC NOT NULL,
    deadline TIMESTAMPTZ,
    internal_notes TEXT,
    approval_status public.approval_status NOT NULL DEFAULT 'pending_approval',
    approved_at TIMESTAMPTZ,
    approved_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    -- FROM: 006_ai_readiness.sql
    ai_generated BOOLEAN DEFAULT false,
    negotiated_price INTEGER,
    original_price INTEGER,
    customer_specifications JSONB,
    customer_notes TEXT,
    -- FROM: 20260528000001_new_flow_setup.sql
    design_file_url TEXT,
    customer_name TEXT,
    customer_email TEXT,
    customer_whatsapp TEXT,
    customer_address TEXT,
    order_specs JSONB,
    negotiation_summary TEXT,
    ai_session_id TEXT
);

CREATE TABLE IF NOT EXISTS public.order_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_customer_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number TEXT NOT NULL UNIQUE,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    subtotal NUMERIC NOT NULL,
    tax_percent NUMERIC DEFAULT 11,
    total NUMERIC NOT NULL,
    status TEXT DEFAULT 'draft' CHECK (status IN (
      'draft', 'sent', 'submitted', 'paid', 'rejected_payment', 'cancelled',
      'unpaid', 'overdue', 'partial'
    )),
    due_date TIMESTAMPTZ,
    notes TEXT,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    nama_layanan TEXT NOT NULL,
    qty INTEGER NOT NULL DEFAULT 1,
    harga_satuan NUMERIC NOT NULL,
    subtotal NUMERIC NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    jumlah NUMERIC NOT NULL,
    metode TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    receiver_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT false,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    -- FROM: 006_ai_readiness.sql
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'assistant', 'system')),
    conversation_id UUID,
    metadata JSONB
);

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type TEXT DEFAULT 'info',
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- === FROM: 006_ai_readiness.sql ===
CREATE TABLE IF NOT EXISTS public.conversations (
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

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- FUNCTIONS (final versions — latest migration wins)
-- =============================================================================

-- === FROM: 001_initial_schema.sql (never overwritten) ===
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- === FROM: 002_fix_rls_recursion.sql (never overwritten) ===
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT SECURITY DEFINER STABLE SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN NULL;
  END IF;
  RETURN auth.jwt() ->> 'role';
END;
$$ LANGUAGE plpgsql;

-- === FROM: 20260417112600_fix_orders_rls_and_transitions.sql (final version) ===
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  normalized_role TEXT;
BEGIN
  normalized_role := CASE
    WHEN COALESCE(NEW.raw_user_meta_data ->> 'role', 'customer') IN ('admin', 'customer') THEN NEW.raw_user_meta_data ->> 'role'
    WHEN NEW.raw_user_meta_data ->> 'role' = 'user' THEN 'customer'
    ELSE 'customer'
  END;

  INSERT INTO public.profiles (id, full_name, email, whatsapp, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'nama', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'whatsapp', NULL),
    normalized_role
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
    whatsapp = COALESCE(EXCLUDED.whatsapp, public.profiles.whatsapp),
    role = CASE
      WHEN public.profiles.role = 'admin' THEN 'admin'
      ELSE EXCLUDED.role
    END;

  RETURN NEW;
END;
$$;

-- === FROM: 20260425100000_enable_messages_realtime.sql (final version) ===
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- === FROM: 20260417140000_order_updates_rls_approval_notifications.sql (final version) ===
CREATE OR REPLACE FUNCTION public.validate_order_status_transition()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.status = 'in_progress' AND NEW.approval_status IS DISTINCT FROM 'approved' THEN
    RAISE EXCEPTION 'Order must be approved before moving to in_progress';
  END IF;

  IF NEW.status IS DISTINCT FROM OLD.status THEN
    IF OLD.status = 'pending' AND NEW.status NOT IN ('in_progress', 'cancelled') THEN
      RAISE EXCEPTION 'Invalid order status transition: % -> %', OLD.status, NEW.status;
    ELSIF OLD.status = 'in_progress' AND NEW.status NOT IN ('review', 'revision', 'cancelled') THEN
      RAISE EXCEPTION 'Invalid order status transition: % -> %', OLD.status, NEW.status;
    ELSIF OLD.status = 'review' AND NEW.status NOT IN ('revision', 'completed', 'cancelled') THEN
      RAISE EXCEPTION 'Invalid order status transition: % -> %', OLD.status, NEW.status;
    ELSIF OLD.status = 'revision' AND NEW.status NOT IN ('in_progress', 'review', 'cancelled') THEN
      RAISE EXCEPTION 'Invalid order status transition: % -> %', OLD.status, NEW.status;
    ELSIF OLD.status IN ('completed', 'cancelled') AND NEW.status <> OLD.status THEN
      RAISE EXCEPTION 'Invalid order status transition: % -> %', OLD.status, NEW.status;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- === FROM: 20260417140000_order_updates_rls_approval_notifications.sql ===
CREATE OR REPLACE FUNCTION public.notify_order_approval_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  msg TEXT;
BEGIN
  IF NEW.approval_status IS DISTINCT FROM OLD.approval_status THEN
    IF NEW.approval_status = 'approved' THEN
      msg := 'Pesananmu telah di-approve.';
    ELSIF NEW.approval_status = 'rejected' THEN
      msg := 'Pesananmu telah di-reject.' || CASE WHEN NEW.rejection_reason IS NOT NULL AND NEW.rejection_reason <> '' THEN ' Alasan: ' || NEW.rejection_reason ELSE '' END;
    ELSE
      msg := 'Status approval pesanan diperbarui.';
    END IF;

    INSERT INTO public.notifications (user_id, type, message, is_read)
    VALUES (NEW.customer_id, 'order_approval', msg, false);
  END IF;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.notify_order_update_visible()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  oid uuid;
  cust uuid;
  ordno text;
BEGIN
  IF NEW.is_customer_visible = true THEN
    oid := NEW.order_id;
    SELECT o.customer_id, o.order_number INTO cust, ordno
    FROM public.orders o
    WHERE o.id = oid;

    IF cust IS NOT NULL THEN
      INSERT INTO public.notifications (user_id, type, message, is_read)
      VALUES (cust, 'order_update', 'Ada update baru dari admin untuk pesanan ' || COALESCE(ordno, '') || '.', false);
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- =============================================================================
-- TRIGGERS (final versions — dropped & recreated where needed)
-- =============================================================================

-- === FROM: 20260417112600_fix_orders_rls_and_transitions.sql (final) ===
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- === FROM: 001_initial_schema.sql ===
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_services_updated_at ON services;
CREATE TRIGGER update_services_updated_at
    BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_invoices_updated_at ON invoices;
CREATE TRIGGER update_invoices_updated_at
    BEFORE UPDATE ON invoices
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- === FROM: 20260417140000_order_updates_rls_approval_notifications.sql (final) ===
DROP TRIGGER IF EXISTS validate_order_status_transition_trigger ON public.orders;
CREATE TRIGGER validate_order_status_transition_trigger
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_order_status_transition();

DROP TRIGGER IF EXISTS tr_notify_order_approval_status_change ON public.orders;
CREATE TRIGGER tr_notify_order_approval_status_change
  AFTER UPDATE OF approval_status ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_order_approval_status_change();

DROP TRIGGER IF EXISTS tr_notify_order_update_visible ON public.order_updates;
CREATE TRIGGER tr_notify_order_update_visible
  AFTER INSERT ON public.order_updates
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_order_update_visible();

-- =============================================================================
-- RLS POLICIES (final versions only — duplicates removed)
-- =============================================================================

-- === PROFILES — FROM: 20260424100000_fix_admin_rls.sql ===
CREATE POLICY "profiles_select_all" ON public.profiles
  FOR SELECT
  USING (true);

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_insert_admin" ON public.profiles
  FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "profiles_update_admin" ON public.profiles
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- === SERVICES — FROM: 20260424100000_fix_admin_rls.sql ===
CREATE POLICY "services_select_active" ON public.services
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "services_manage_admin" ON public.services
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- === ORDERS — FROM: 20260424100000_fix_admin_rls.sql + 20260528000001_new_flow_setup.sql ===
CREATE POLICY "orders_select_own" ON public.orders
  FOR SELECT
  USING (customer_id = auth.uid());

CREATE POLICY "orders_select_admin" ON public.orders
  FOR SELECT
  USING (public.is_admin());

CREATE POLICY "orders_insert" ON public.orders
  FOR INSERT
  WITH CHECK (customer_id = auth.uid());

CREATE POLICY "orders_update_admin" ON public.orders
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Public can create orders"
ON orders FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Admin full access orders"
ON orders FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- === ORDER UPDATES — FROM: 20260424100000_fix_admin_rls.sql ===
CREATE POLICY "order_updates_select_own" ON public.order_updates
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_updates.order_id
        AND orders.customer_id = auth.uid()
    )
    OR is_customer_visible = true
    OR public.is_admin()
  );

CREATE POLICY "order_updates_insert_admin" ON public.order_updates
  FOR INSERT
  WITH CHECK (public.is_admin());

-- === INVOICES — FROM: 20260424100000_fix_admin_rls.sql ===
CREATE POLICY "invoices_select_own" ON public.invoices
  FOR SELECT
  USING (customer_id = auth.uid());

CREATE POLICY "invoices_select_admin" ON public.invoices
  FOR SELECT
  USING (public.is_admin());

CREATE POLICY "invoices_manage_admin" ON public.invoices
  FOR INSERT
  WITH CHECK (public.is_admin());

-- === INVOICE ITEMS — FROM: 20260424100000_fix_admin_rls.sql ===
CREATE POLICY "invoice_items_select_own" ON public.invoice_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.invoices inv
      WHERE inv.id = invoice_items.invoice_id
        AND (inv.customer_id = auth.uid() OR public.is_admin())
    )
  );

-- === PAYMENTS — FROM: 20260424100000_fix_admin_rls.sql ===
CREATE POLICY "payments_select_own" ON public.payments
  FOR SELECT
  USING (customer_id = auth.uid());

CREATE POLICY "payments_select_admin" ON public.payments
  FOR SELECT
  USING (public.is_admin());

-- === MESSAGES — FROM: 20260425100000_enable_messages_realtime.sql (final) ===
CREATE POLICY "messages_select_own" ON public.messages
  FOR SELECT
  USING (
    auth.uid() = sender_id
    OR auth.uid() = receiver_id
    OR public.is_admin()
    OR is_internal = false
  );

CREATE POLICY "messages_insert_own" ON public.messages
  FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id
    OR public.is_admin()
  );

CREATE POLICY "messages_update_own" ON public.messages
  FOR UPDATE
  USING (
    auth.uid() = receiver_id
    OR public.is_admin()
  )
  WITH CHECK (
    auth.uid() = receiver_id
    OR public.is_admin()
  );

-- === NOTIFICATIONS — FROM: 20260424100000_fix_admin_rls.sql ===
CREATE POLICY "notifications_select_own" ON public.notifications
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "notifications_insert_any" ON public.notifications
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "notifications_update_own" ON public.notifications
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- === CONVERSATIONS — FROM: 006_ai_readiness.sql ===
CREATE POLICY "Users can view own conversations"
ON conversations FOR SELECT
USING (auth.uid() = customer_id OR public.is_admin());

CREATE POLICY "Users can create conversations"
ON conversations FOR INSERT
WITH CHECK (auth.uid() = customer_id OR public.is_admin());

CREATE POLICY "Admin can update conversations"
ON conversations FOR UPDATE
USING (public.is_admin());

-- =============================================================================
-- STORAGE: design-files bucket + RLS — FROM: 20260528000001_new_flow_setup.sql
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

CREATE POLICY "Admin read design files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'design-files');

CREATE POLICY "Public upload design files"
ON storage.objects FOR INSERT
TO anon
WITH CHECK (bucket_id = 'design-files');

-- =============================================================================
-- INDEXES — FROM: 001_initial_schema.sql + 006_ai_readiness.sql
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_service_id ON orders(service_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_invoices_customer_id ON invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_order_id ON invoices(order_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_payments_customer_id ON payments(customer_id);
CREATE INDEX IF NOT EXISTS idx_payments_invoice_id ON payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_messages_role ON messages(role);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_conversations_customer_id ON conversations(customer_id);
CREATE INDEX IF NOT EXISTS idx_conversations_status ON conversations(status);

-- =============================================================================
-- SEED DATA — FROM: 001_initial_schema.sql
-- =============================================================================
INSERT INTO public.services (nama, deskripsi, harga, estimasi, max_slots, is_active) VALUES
('Jersey Printing', 'Custom jersey printing with your design or our templates', 150000, '7-14 hari kerja', 50, true),
('T-Shirt Custom', 'Custom t-shirt with your design', 75000, '5-7 hari kerja', 100, true),
('Varsity Jacket', 'Premium varsity jacket with custom embroidery', 350000, '14-21 hari kerja', 20, true),
('Work Jacket', 'Industrial work jacket with company branding', 250000, '10-14 hari kerja', 30, true),
('Corporate Uniform', 'Complete corporate uniform package', 200000, '14-21 hari kerja', 25, true)
ON CONFLICT DO NOTHING;

-- =============================================================================
-- DONE
-- =============================================================================
