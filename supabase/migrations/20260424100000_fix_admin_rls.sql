-- Fix RLS policies for admin access
-- Run this in Supabase SQL Editor

-- ==================== IS_ADMIN FUNCTION ====================
-- Ensure is_admin function exists and works properly
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ==================== PROFILES ====================
-- Drop conflicting policies
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admin can read all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admin can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_all" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;

-- Create clean policies for profiles
-- Anyone can read profiles (needed for customer list)
CREATE POLICY "profiles_select_all" ON public.profiles
  FOR SELECT
  USING (true);

-- Users can update their own profile
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admin can insert new profiles (for creating test users)
CREATE POLICY "profiles_insert_admin" ON public.profiles
  FOR INSERT
  WITH CHECK (public.is_admin());

-- Admin can update any profile
CREATE POLICY "profiles_update_admin" ON public.profiles
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ==================== ORDERS ====================
-- Drop conflicting policies
DROP POLICY IF EXISTS "Users can read own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can update own orders" ON public.orders;
DROP POLICY IF EXISTS "Admin can read all orders" ON public.orders;
DROP POLICY IF EXISTS "Admin can update all orders" ON public.orders;
DROP POLICY IF EXISTS "orders_select_own" ON public.orders;
DROP POLICY IF EXISTS "orders_insert" ON public.orders;
DROP POLICY IF EXISTS "orders_update" ON public.orders;
DROP POLICY IF EXISTS "orders_select_order" ON public.orders;

-- Create clean policies for orders
-- Customers can read their own orders
CREATE POLICY "orders_select_own" ON public.orders
  FOR SELECT
  USING (customer_id = auth.uid());

-- Admin can read all orders
CREATE POLICY "orders_select_admin" ON public.orders
  FOR SELECT
  USING (public.is_admin());

-- Customers can create their own orders
CREATE POLICY "orders_insert" ON public.orders
  FOR INSERT
  WITH CHECK (customer_id = auth.uid());

-- Admin can update any orders
CREATE POLICY "orders_update_admin" ON public.orders
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ==================== SERVICES ====================
-- Drop conflicting policies
DROP POLICY IF EXISTS "Anyone can read active services" ON public.services;
DROP POLICY IF EXISTS "Admin can manage services" ON public.services;
DROP POLICY IF EXISTS "services_select_all" ON public.services;

-- Create clean policies for services
-- Anyone can read active services
CREATE POLICY "services_select_active" ON public.services
  FOR SELECT
  USING (is_active = true);

-- Admin can manage services
CREATE POLICY "services_manage_admin" ON public.services
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ==================== INVOICES ====================
-- Drop conflicting policies
DROP POLICY IF EXISTS "Users can read own invoices" ON public.invoices;
DROP POLICY IF EXISTS "Admin can read all invoices" ON public.invoices;
DROP POLICY IF EXISTS "invoices_select_own" ON public.invoices;
DROP POLICY IF EXISTS "invoices_select_admin" ON public.invoices;
DROP POLICY IF EXISTS "invoices_select_via_order" ON public.invoices;

-- Create clean policies for invoices
-- Customers can read their own invoices
CREATE POLICY "invoices_select_own" ON public.invoices
  FOR SELECT
  USING (customer_id = auth.uid());

-- Admin can read all invoices
CREATE POLICY "invoices_select_admin" ON public.invoices
  FOR SELECT
  USING (public.is_admin());

-- Admin can insert/update invoices
CREATE POLICY "invoices_manage_admin" ON public.invoices
  FOR INSERT
  WITH CHECK (public.is_admin());

-- ==================== ORDER_UPDATES ====================
-- Drop conflicting policies
DROP POLICY IF EXISTS "Users can read own order updates" ON public.order_updates;
DROP POLICY IF EXISTS "Admin can create order updates" ON public.order_updates;

-- Create clean policies for order_updates
-- Users can read their own order updates
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

-- Admin can create order updates
CREATE POLICY "order_updates_insert_admin" ON public.order_updates
  FOR INSERT
  WITH CHECK (public.is_admin());

-- ==================== INVOICE_ITEMS ====================
-- Drop conflicting policies
DROP POLICY IF EXISTS "Users can read own invoice items" ON public.invoice_items;

-- Create clean policies for invoice_items
-- Users can read their own invoice items via invoice join
CREATE POLICY "invoice_items_select_own" ON public.invoice_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.invoices inv
      WHERE inv.id = invoice_items.invoice_id
        AND (inv.customer_id = auth.uid() OR public.is_admin())
    )
  );

-- ==================== PAYMENTS ====================
-- Drop conflicting policies
DROP POLICY IF EXISTS "Users can read own payments" ON public.payments;
DROP POLICY IF EXISTS "Admin can read all payments" ON public.payments;

-- Create clean policies for payments
-- Customers can read their own payments
CREATE POLICY "payments_select_own" ON public.payments
  FOR SELECT
  USING (customer_id = auth.uid());

-- Admin can read all payments
CREATE POLICY "payments_select_admin" ON public.payments
  FOR SELECT
  USING (public.is_admin());

-- ==================== MESSAGES ====================
-- Drop conflicting policies
DROP POLICY IF EXISTS "Users can read own messages" ON public.messages;
DROP POLICY IF EXISTS "Users can create messages" ON public.messages;

-- Create clean policies for messages
-- Users can read messages they sent or received
CREATE POLICY "messages_select_own" ON public.messages
  FOR SELECT
  USING (
    sender_id = auth.uid() 
    OR receiver_id = auth.uid()
    OR is_internal = false
    OR public.is_admin()
  );

-- Users can create messages
CREATE POLICY "messages_insert" ON public.messages
  FOR INSERT
  WITH CHECK (
    sender_id = auth.uid() 
    OR public.is_admin()
  );

-- ==================== NOTIFICATIONS ====================
-- Drop conflicting policies
DROP POLICY IF EXISTS "Users can read own notifications" ON public.notifications;
DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
DROP POLICY IF EXISTS "notifications_insert_admin" ON public.notifications;

-- Create clean policies for notifications
-- Users can read their own notifications
CREATE POLICY "notifications_select_own" ON public.notifications
  FOR SELECT
  USING (user_id = auth.uid());

-- System/Admin can create notifications (any user_id)
CREATE POLICY "notifications_insert_any" ON public.notifications
  FOR INSERT
  WITH CHECK (true);

-- Users can update read status
CREATE POLICY "notifications_update_own" ON public.notifications
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ==================== DONE ====================