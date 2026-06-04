-- FIX 5: Check storage buckets
SELECT id, name, public 
FROM storage.buckets;

-- If 'payment-proofs' not found, run this:
INSERT INTO storage.buckets (id, name, public) 
VALUES ('payment-proofs', 'payment-proofs', false)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
CREATE POLICY IF NOT EXISTS "Customer upload own proof"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'payment-proofs' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY IF NOT EXISTS "Customer and admin view proof"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'payment-proofs' AND
  (auth.uid()::text = (storage.foldername(name))[1] 
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
);
