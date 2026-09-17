-- Fix invoices table: make order_id nullable
-- Run this in Supabase SQL Editor

-- Make order_id nullable so invoices can be created without an order
ALTER TABLE public.invoices 
ALTER COLUMN order_id DROP NOT NULL;

-- Drop the foreign key constraint first if it exists
ALTER TABLE public.invoices 
DROP CONSTRAINT IF EXISTS invoices_order_id_fkey;

-- Re-add foreign key as optional (ON DELETE SET NULL)
ALTER TABLE public.invoices 
ADD CONSTRAINT invoices_order_id_fkey 
FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL;

-- Verify the change
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'invoices' AND column_name = 'order_id';