-- Enable realtime for messages table
-- Run this in Supabase SQL Editor

-- Enable realtime for messages table
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- Ensure is_admin function exists
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Drop and recreate messages RLS policies for realtime
DROP POLICY IF EXISTS "Users can read own messages" ON public.messages;
DROP POLICY IF EXISTS "Users can read messages" ON public.messages;
DROP POLICY IF EXISTS "users_select_own" ON public.messages;
DROP POLICY IF EXISTS "messages_select_own" ON public.messages;
DROP POLICY IF EXISTS "Users can create messages" ON public.messages;
DROP POLICY IF EXISTS "messages_insert" ON public.messages;

-- Policy: Allow users to read messages they sent or received
CREATE POLICY "messages_select_own" ON public.messages
  FOR SELECT
  USING (
    auth.uid() = sender_id 
    OR auth.uid() = receiver_id 
    OR public.is_admin()
    OR is_internal = false
  );

-- Policy: Allow users to insert messages they send
CREATE POLICY "messages_insert_own" ON public.messages
  FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id 
    OR public.is_admin()
  );

-- Policy: Allow users to update read status for messages they receive
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

-- Verify realtime is enabled
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_publication_tables
WHERE pubname = 'supabase_realtime'
AND tablename = 'messages';