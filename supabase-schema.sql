-- ThreadForge Supabase Database Schema
-- Run this in your Supabase SQL Editor to set up the database.

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ── Designs table ─────────────────────────────────────────
create table if not exists designs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete set null,
  prompt text not null,
  style text not null,
  image_urls text[] not null default '{}',
  selected_image_url text,
  final_render_url text,
  tier text default 'schnell',
  created_at timestamptz default now()
);

-- ── Orders table ──────────────────────────────────────────
create table if not exists orders (
  id uuid primary key default uuid_generate_v4(),
  design_id uuid references designs(id) on delete set null,
  stripe_session_id text unique not null,
  stripe_customer_email text,
  printful_order_id text,
  status text default 'payment_received'
    check (status in ('payment_received', 'processing', 'sent_to_print', 'printing', 'shipped', 'delivered', 'failed')),
  size text not null,
  color text not null,
  shirt_style text default 'Crew Neck',
  shipping_address jsonb,
  tracking_number text,
  tracking_url text,
  amount_total integer not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ── Generation tracking (anonymous users) ─────────────────
create table if not exists generation_counts (
  id uuid primary key default uuid_generate_v4(),
  fingerprint text,
  ip_address text,
  count integer default 0,
  last_generated_at timestamptz default now(),
  created_at timestamptz default now()
);

-- ── Indexes ───────────────────────────────────────────────
create index if not exists idx_designs_user_id on designs(user_id);
create index if not exists idx_designs_created_at on designs(created_at desc);
create index if not exists idx_orders_stripe_session on orders(stripe_session_id);
create index if not exists idx_orders_status on orders(status);
create index if not exists idx_orders_email on orders(stripe_customer_email);
create index if not exists idx_gen_counts_fingerprint on generation_counts(fingerprint);
create index if not exists idx_gen_counts_ip on generation_counts(ip_address);

-- ── Row Level Security ────────────────────────────────────
alter table designs enable row level security;
alter table orders enable row level security;
alter table generation_counts enable row level security;

-- Designs: users can read their own, service role can read/write all
create policy "Users can view own designs"
  on designs for select
  using (auth.uid() = user_id);

create policy "Users can insert own designs"
  on designs for insert
  with check (auth.uid() = user_id);

create policy "Service role full access to designs"
  on designs for all
  using (auth.role() = 'service_role');

-- Orders: users can read orders by email match, service role full access
create policy "Service role full access to orders"
  on orders for all
  using (auth.role() = 'service_role');

-- Generation counts: service role only
create policy "Service role full access to gen counts"
  on generation_counts for all
  using (auth.role() = 'service_role');

-- ── Updated_at trigger ────────────────────────────────────
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger orders_updated_at
  before update on orders
  for each row
  execute function update_updated_at();
