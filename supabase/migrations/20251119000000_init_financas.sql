-- Create Categories Table
create table public.categories (
  id uuid not null default gen_random_uuid(),
  name text not null,
  type text not null check (type in ('income', 'expense')),
  user_id uuid default gen_random_uuid(), -- Removed auth reference for prototype
  created_at timestamptz not null default now(),
  primary key (id)
);

-- Create Payment Methods Table
create table public.payment_methods (
  id uuid not null default gen_random_uuid(),
  name text not null,
  user_id uuid default gen_random_uuid(), -- Removed auth reference for prototype
  created_at timestamptz not null default now(),
  primary key (id)
);

-- Create Transactions Table
create table public.transactions (
  id uuid not null default gen_random_uuid(),
  description text not null,
  amount numeric not null,
  date date not null,
  type text not null check (type in ('income', 'expense')),
  category_id uuid references public.categories(id) on delete set null,
  payment_method_id uuid references public.payment_methods(id) on delete set null,
  status text not null default 'pending' check (status in ('paid', 'pending')),
  profile text check (profile in ('Leonardo', 'Flavia')), -- Made optional
  user_id uuid default gen_random_uuid(), -- Removed auth reference for prototype
  created_at timestamptz not null default now(),
  primary key (id)
);

-- Enable RLS
alter table public.categories enable row level security;
alter table public.payment_methods enable row level security;
alter table public.transactions enable row level security;

-- Create Policies (PUBLIC ACCESS FOR PROTOTYPE)
create policy "Public access categories" on public.categories
  for all using (true) with check (true);

create policy "Public access payment_methods" on public.payment_methods
  for all using (true) with check (true);

create policy "Public access transactions" on public.transactions
  for all using (true) with check (true);
