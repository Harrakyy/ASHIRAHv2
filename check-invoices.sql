-- FIX 4: Check invoice statuses
SELECT id, invoice_number, status, customer_id 
FROM invoices 
ORDER BY created_at DESC 
LIMIT 10;
