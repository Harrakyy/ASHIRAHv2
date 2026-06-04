-- =============================================================================
-- BUG FIX 1: Infinite Recursion in RLS Policies
-- =============================================================================
-- Run this in Supabase SQL Editor to fix infinite recursion in profiles table
-- =============================================================================

-- ============================================================================
-- STEP 1: Drop ALL existing policies on profiles table
-- ============================================================================
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update profile" ON profiles;
DROP POLICY IF EXISTS "Admin can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Admin can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admin can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Admin can update profiles" ON profiles;
DROP POLICY IF EXISTS "Admin full access" ON profiles;

-- ============================================================================
-- STEP 2: Create NON-RECURSIVE policies for profiles
-- ============================================================================
-- User can view their own profile (direct auth.uid() comparison)
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- User can update their own profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Admin can do everything (using JWT claim, NOT querying profiles)
CREATE POLICY "Admin full access"
ON profiles FOR ALL
USING (auth.jwt() ->> 'role' = 'admin');

-- ============================================================================
-- STEP 3: Create helper function for other tables (avoid recursion)
-- ============================================================================
-- This function safely gets the current user's role without recursion
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT SECURITY DEFINER STABLE SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Use auth.jwt() directly to get role from JWT token
  -- This avoids querying the profiles table which causes recursion
  RETURN auth.jwt() ->> 'role';
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- STEP 4: Fix policies on other tables that reference profiles
-- ============================================================================

-- Fix SERVICES table policies
DROP POLICY IF EXISTS "Anyone can read active services" ON services;
DROP POLICY IF EXISTS "Admin can manage services" ON services;

CREATE POLICY "Anyone can read active services" ON services
FOR SELECT USING (is_active = true);

CREATE POLICY "Admin can manage services" ON services
FOR ALL USING (public.get_current_user_role() = 'admin');

-- Fix ORDERS table policies
DROP POLICY IF EXISTS "Users can read own orders" ON orders;
DROP POLICY IF EXISTS "Users can create own orders" ON orders;
DROP POLICY IF EXISTS "Users can update own orders" ON orders;
DROP POLICY IF EXISTS "Admin can read all orders" ON orders;
DROP POLICY IF EXISTS "Admin can update all orders" ON orders;

CREATE POLICY "Users can read own orders" ON orders
FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Users can create own orders" ON orders
FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Users can update own orders" ON orders
FOR UPDATE USING (auth.uid() = customer_id);

CREATE POLICY "Admin can read all orders" ON orders
FOR SELECT USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admin can update all orders" ON orders
FOR UPDATE USING (public.get_current_user_role() = 'admin');

-- Fix ORDER_UPDATES table policies
DROP POLICY IF EXISTS "Users can read own order updates" ON order_updates;
DROP POLICY IF EXISTS "Admin can create order updates" ON order_updates;

CREATE POLICY "Users can read own order updates" ON order_updates
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM orders 
        WHERE orders.id = order_updates.order_id 
        AND orders.customer_id = auth.uid()
    )
    OR is_customer_visible = true
    OR public.get_current_user_role() = 'admin'
);

CREATE POLICY "Admin can create order updates" ON order_updates
FOR INSERT WITH CHECK (public.get_current_user_role() = 'admin');

-- Fix INVOICES table policies
DROP POLICY IF EXISTS "Users can read own invoices" ON invoices;
DROP POLICY IF EXISTS "Admin can read all invoices" ON invoices;

CREATE POLICY "Users can read own invoices" ON invoices
FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Admin can read all invoices" ON invoices
FOR SELECT USING (public.get_current_user_role() = 'admin');

-- Fix INVOICE_ITEMS table policies
DROP POLICY IF EXISTS "Users can read own invoice items" ON invoice_items;

CREATE POLICY "Users can read own invoice items" ON invoice_items
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM invoices 
        WHERE invoices.id = invoice_items.invoice_id 
        AND invoices.customer_id = auth.uid()
    )
    OR public.get_current_user_role() = 'admin'
);

-- Fix PAYMENTS table policies
DROP POLICY IF EXISTS "Users can read own payments" ON payments;
DROP POLICY IF EXISTS "Admin can read all payments" ON payments;

CREATE POLICY "Users can read own payments" ON payments
FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Admin can read all payments" ON payments
FOR SELECT USING (public.get_current_user_role() = 'admin');

-- Fix MESSAGES table policies
DROP POLICY IF EXISTS "Users can read own messages" ON messages;
DROP POLICY IF EXISTS "Users can create messages" ON messages;

CREATE POLICY "Users can read own messages" ON messages
FOR SELECT USING (
    auth.uid() = sender_id 
    OR auth.uid() = receiver_id
    OR is_internal = false
    OR public.get_current_user_role() = 'admin'
);

CREATE POLICY "Users can create messages" ON messages
FOR INSERT WITH CHECK (
    auth.uid() = sender_id 
    OR public.get_current_user_role() = 'admin'
);

-- Fix NOTIFICATIONS table policies
DROP POLICY IF EXISTS "Users can read own notifications" ON notifications;
DROP POLICY IF EXISTS "System can create notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;

CREATE POLICY "Users can read own notifications" ON notifications
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications" ON notifications
FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own notifications" ON notifications
FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================================
-- DONE!
-- ============================================================================
-- The policies now use get_current_user_role() instead of direct SELECT
-- This avoids the infinite recursion because the function uses JWT claims
-- ============================================================================