-- Update invoices status CHECK constraint
ALTER TABLE invoices 
DROP CONSTRAINT IF EXISTS invoices_status_check;

ALTER TABLE invoices 
ADD CONSTRAINT invoices_status_check 
CHECK (status IN (
  'draft',
  'sent', 
  'submitted',
  'paid',
  'rejected_payment',
  'cancelled',
  'unpaid',
  'overdue',
  'partial'
));

-- Update existing unpaid invoices to draft
UPDATE invoices SET status = 'draft' WHERE status = 'unpaid';
