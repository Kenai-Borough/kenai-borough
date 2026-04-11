create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  avatar_url text,
  role text not null default 'visitor' check (role in ('visitor', 'business_owner', 'admin')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.business_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  category_id uuid references public.business_categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  short_description text,
  description text not null,
  town text not null,
  address text,
  latitude numeric(9,6),
  longitude numeric(9,6),
  phone text,
  email text,
  website text,
  photos jsonb not null default '[]'::jsonb,
  services jsonb not null default '[]'::jsonb,
  social_links jsonb not null default '{}'::jsonb,
  hours jsonb not null default '{}'::jsonb,
  approved boolean not null default false,
  featured boolean not null default false,
  advertising_tier text not null default 'Free' check (advertising_tier in ('Free', 'Featured', 'Premium', 'Enterprise')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  title text not null,
  slug text not null unique,
  description text not null,
  category text not null,
  town text not null,
  seasons text[] not null default '{}',
  duration text,
  difficulty text,
  price_from numeric(10,2),
  price_to numeric(10,2),
  group_size text,
  photo_url text,
  approved boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references public.businesses(id) on delete set null,
  title text not null,
  category text not null,
  town text not null,
  venue text,
  summary text,
  description text,
  start_at timestamptz not null,
  end_at timestamptz not null,
  price_label text,
  featured boolean not null default false,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references public.businesses(id) on delete cascade,
  trip_plan_id uuid,
  name text not null,
  email text not null,
  phone text,
  travel_start date,
  travel_end date,
  message text not null,
  status text not null default 'new' check (status in ('new', 'replied', 'archived')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete set null,
  rating integer not null check (rating between 1 and 5),
  title text,
  body text,
  status text not null default 'published' check (status in ('pending', 'published', 'hidden')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.saved_businesses (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  business_id uuid not null references public.businesses(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (profile_id, business_id)
);

create table if not exists public.trip_plans (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade,
  start_date date,
  end_date date,
  group_size integer,
  interests text[] not null default '{}',
  itinerary jsonb not null default '[]'::jsonb,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.inquiries add constraint inquiries_trip_plan_fkey foreign key (trip_plan_id) references public.trip_plans(id) on delete set null;

create table if not exists public.advertising_invoices (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  tier text not null,
  invoice_month date not null,
  amount numeric(10,2) not null,
  status text not null default 'draft' check (status in ('draft', 'issued', 'paid', 'void')),
  stripe_invoice_id text,
  due_at timestamptz,
  paid_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_businesses_owner_id on public.businesses(owner_id);
create index if not exists idx_businesses_slug on public.businesses(slug);
create index if not exists idx_businesses_approved on public.businesses(approved);
create index if not exists idx_businesses_category_id on public.businesses(category_id);
create index if not exists idx_activities_business_id on public.activities(business_id);
create index if not exists idx_activities_slug on public.activities(slug);
create index if not exists idx_events_start_at on public.events(start_at);
create index if not exists idx_events_status on public.events(status);
create index if not exists idx_inquiries_business_id on public.inquiries(business_id);
create index if not exists idx_reviews_business_id on public.reviews(business_id);
create index if not exists idx_trip_plans_profile_id on public.trip_plans(profile_id);
create index if not exists idx_advertising_invoices_business_id on public.advertising_invoices(business_id);

create trigger set_profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger set_business_categories_updated_at before update on public.business_categories for each row execute function public.set_updated_at();
create trigger set_businesses_updated_at before update on public.businesses for each row execute function public.set_updated_at();
create trigger set_activities_updated_at before update on public.activities for each row execute function public.set_updated_at();
create trigger set_events_updated_at before update on public.events for each row execute function public.set_updated_at();
create trigger set_inquiries_updated_at before update on public.inquiries for each row execute function public.set_updated_at();
create trigger set_reviews_updated_at before update on public.reviews for each row execute function public.set_updated_at();
create trigger set_trip_plans_updated_at before update on public.trip_plans for each row execute function public.set_updated_at();
create trigger set_advertising_invoices_updated_at before update on public.advertising_invoices for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data ->> 'role', 'visitor')
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = excluded.full_name,
        role = excluded.role;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.business_categories enable row level security;
alter table public.businesses enable row level security;
alter table public.activities enable row level security;
alter table public.events enable row level security;
alter table public.inquiries enable row level security;
alter table public.reviews enable row level security;
alter table public.saved_businesses enable row level security;
alter table public.trip_plans enable row level security;
alter table public.advertising_invoices enable row level security;

create policy "profiles are readable by owner or admin" on public.profiles
for select using (auth.uid() = id or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "profiles insert self" on public.profiles
for insert with check (auth.uid() = id);

create policy "profiles update self" on public.profiles
for update using (auth.uid() = id or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "categories public read" on public.business_categories
for select using (true);

create policy "categories admin manage" on public.business_categories
for all using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "businesses public approved read" on public.businesses
for select using (approved = true or owner_id = auth.uid() or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "businesses owner insert" on public.businesses
for insert with check (owner_id = auth.uid());

create policy "businesses owner update" on public.businesses
for update using (owner_id = auth.uid() or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
with check (owner_id = auth.uid() or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "activities public approved read" on public.activities
for select using (approved = true or exists (select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid()) or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "activities owner manage" on public.activities
for all using (exists (select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid()) or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
with check (exists (select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid()) or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "events public approved read" on public.events
for select using (status = 'approved' or exists (select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid()) or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "events owner manage" on public.events
for all using (exists (select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid()) or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
with check (exists (select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid()) or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "public can create inquiries" on public.inquiries
for insert with check (true);

create policy "owners and admins read inquiries" on public.inquiries
for select using (exists (select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid()) or exists (select 1 from public.trip_plans t where t.id = trip_plan_id and t.profile_id = auth.uid()) or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "owners update inquiries" on public.inquiries
for update using (exists (select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid()) or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
with check (exists (select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid()) or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "reviews public published read" on public.reviews
for select using (status = 'published' or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "authenticated can create reviews" on public.reviews
for insert with check (auth.uid() = profile_id);

create policy "review owner update" on public.reviews
for update using (auth.uid() = profile_id or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
with check (auth.uid() = profile_id or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "saved businesses owner manage" on public.saved_businesses
for all using (auth.uid() = profile_id)
with check (auth.uid() = profile_id);

create policy "trip plans owner manage" on public.trip_plans
for all using (auth.uid() = profile_id or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
with check (auth.uid() = profile_id or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "advertising invoices owner read" on public.advertising_invoices
for select using (exists (select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid()) or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "advertising invoices admin manage" on public.advertising_invoices
for all using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
