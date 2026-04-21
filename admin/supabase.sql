-- Small Runs Admin (Supabase)
-- Paste into Supabase SQL editor.

-- 1) Inventory table
create table if not exists public.inventory_items (
  id uuid primary key default gen_random_uuid(),
  sku text not null unique,
  name text not null,
  on_hand integer not null default 0,
  low_stock_threshold integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists inventory_items_updated_at_idx on public.inventory_items (updated_at desc);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_inventory_items_updated_at on public.inventory_items;
create trigger set_inventory_items_updated_at
before update on public.inventory_items
for each row
execute function public.set_updated_at();

-- 2) Row Level Security
alter table public.inventory_items enable row level security;

-- Policy: only allow the single admin email to read/write.
-- Replace this email if you want multiple admins later.
drop policy if exists "inventory_items_admin_read" on public.inventory_items;
create policy "inventory_items_admin_read"
on public.inventory_items
for select
to authenticated
using (auth.jwt() ->> 'email' = 'rory@fiveammusic.com');

drop policy if exists "inventory_items_admin_write" on public.inventory_items;
create policy "inventory_items_admin_write"
on public.inventory_items
for all
to authenticated
using (auth.jwt() ->> 'email' = 'rory@fiveammusic.com')
with check (auth.jwt() ->> 'email' = 'rory@fiveammusic.com');

