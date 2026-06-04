# Database Schema Documentation

## Overview

This document describes the database schema based on the codebase analysis. The database uses Supabase (PostgreSQL) with the following tables:

---

## Tables

### 1. profiles
User profile table linked to Supabase Auth.

| Column | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key (FK to auth.users) |
| email | text | User email |
| full_name | text | User's full name |
| whatsapp | text | WhatsApp number |
| role | text | Enum: "admin" or "customer" |
| status | text | Account status |
| avatar_url | text | URL to avatar image |
| created_at | timestamp | Creation timestamp |

---

### 2. services
Available services/products that customers can order.

| Column | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| nama | text | Service name |
| deskripsi | text | Service description |
| harga | numeric | Price in IDR |
| estimasi | text | Estimated completion time |
| max_slots | integer | Maximum concurrent orders |
| current_slots | integer | Current active orders |
| is_active | boolean | Whether service is available |
| created_at | timestamp | Creation timestamp |

---

### 3. orders
Customer orders linked to services.

| Column | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| order_number | text | Unique order number (e.g., ORD-2024-001) |
| customer_id | uuid | FK to profiles.id |
| service_id | uuid | FK to services.id |
| status | text | Enum: pending, in_progress, review, revision, completed, cancelled |
| progress | numeric | Progress percentage (0-100) |
| price | numeric | Order price |
| deadline | timestamp | Due date |
| internal_notes | text | Internal admin notes |
| approval_status | text | Enum: pending_approval, approved, rejected |
| approved_at | timestamp | Approval timestamp |
| approved_by | uuid | FK to profiles.id (admin) |
| rejection_reason | text | Reason if rejected |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Last update |

**Status Flow:**
```
pending → in_progress → review → revision → completed
         ↓          ↓         ↓
       cancelled  cancelled  cancelled
```

---

### 4. order_updates
Updates/messages on orders.

| Column | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| order_id | uuid | FK to orders.id |
| message | text | Update message |
| is_customer_visible | boolean | Whether visible to customer |
| created_at | timestamp | Creation timestamp |

---

### 5. invoices
Invoice generated from orders.

| Column | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| invoice_number | text | Unique invoice number |
| order_id | uuid | FK to orders.id |
| customer_id | uuid | FK to profiles.id |
| subtotal | numeric | Subtotal before tax |
| tax_percent | numeric | Tax percentage |
| total | numeric | Total including tax |
| status | text | Enum: unpaid, paid, overdue, partial |
| due_date | timestamp | Payment due date |
| notes | text | Additional notes |
| paid_at | timestamp | Payment timestamp |
| created_at | timestamp | Creation timestamp |

---

### 6. invoice_items
Line items on invoices.

| Column | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| invoice_id | uuid | FK to invoices.id |
| nama_layanan | text | Service name |
| qty | integer | Quantity |
| harga_satuan | numeric | Unit price |
| subtotal | numeric | Line total |

---

### 7. payments
Payment records.

| Column | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| customer_id | uuid | FK to profiles.id |
| invoice_id | uuid | FK to invoices.id |
| jumlah | numeric | Payment amount |
| metode | text | Payment method |
| created_at | timestamp | Creation timestamp |

---

### 8. messages
Internal and customer messages.

| Column | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| sender_id | uuid | FK to profiles.id |
| receiver_id | uuid | FK to profiles.id |
| content | text | Message content |
| is_internal | boolean | Internal-only message |
| is_read | boolean | Read status |
| created_at | timestamp | Creation timestamp |

---

### 9. notifications
User notifications.

| Column | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | FK to profiles.id |
| type | text | Notification type |
| title | text | Notification title |
| message | text | Notification message |
| link | text | Optional link |
| is_read | boolean | Read status |
| created_at | timestamp | Creation timestamp |

---

## Relationships

```
auth.users ───profiles─── orders (customer_id)
                    ─── orders (approved_by)
                    ─── invoices
                    ─── payments
                    ─── messages (sender_id, receiver_id)
                    ─── notifications

services ────── orders (service_id)

orders ──────── order_updates
          ────── invoices

invoices ───── invoice_items
       ───── payments
```

---

## Key Queries (from queries.ts)

### Get All Services
```typescript
getServices() → Service[]
```

### Get Orders with Filters
```typescript
getOrdersByCustomer(customerId) → Order[]
getOrdersByStatus(status) → Order[]
getOrderById(orderId) → Order
```

### Create Order
```typescript
createOrder({ customer_id, service_id,notes }) → Order
```

### Update Order Status
```typescript
updateOrderStatus(orderId, status) → Order
```

### Create Invoice
```typescript
createInvoice({ order_id, customer_id, items[] }) → Invoice
```

### Get Notifications
```typescript
getUnreadNotificationsCount(userId) → number
```

---

## Notes

1. **RLS (Row Level Security)** is enabled on all tables
2. **Triggers** may exist for automatic created_at/updated_at timestamps
3. The `approval_status` field requires admin approval before work begins
4. Invoice system connects orders with payments
5. Role-based access: `admin` can see all data, `customer` only sees their own

---

## Potentially Missing Features

1. Password reset functionality in auth
2. Email verification flow
3. File/image attachments for orders
4. Review/rating system for completed orders
5. Analytics/reporting tables