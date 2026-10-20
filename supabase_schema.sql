-- ====================================================================
-- CIVIC-BIN TRACKER: Complete Supabase Database Schema
-- Waste Management, Daily Collection, Open Dumping & Bin Locator
-- ====================================================================

-- Enable PostGIS or UUID extension if required
create extension if not exists "uuid-ossp";

-- 1. Profiles Table (Citizens, Drivers, Municipal Admins)
create table if not exists public.profiles (
    id uuid primary key default uuid_generate_v4(),
    phone text unique not null,
    full_name text not null,
    role text not null check (role in ('citizen', 'driver', 'admin')),
    ward_number text not null default 'Ward 14 (Greenwood)',
    street_name text default 'Oak Ridge Boulevard',
    house_no text default 'B-42',
    avatar_url text,
    civic_points integer default 150,
    created_at timestamptz default now()
);

-- 2. Daily Collection Logs (Collected vs. Not Collected)
create table if not exists public.daily_collections (
    id uuid primary key default uuid_generate_v4(),
    ward_number text not null,
    street_name text not null,
    house_no text not null,
    status text not null check (status in ('collected', 'not_collected')),
    marked_by uuid references public.profiles(id) on delete set null,
    marked_by_role text not null default 'citizen',
    collection_date date not null default current_date,
    notes text,
    created_at timestamptz default now()
);

-- 3. Open Dumping Reports (Hotspots, GPS Geotags & Cleanup Proof)
create table if not exists public.dumping_reports (
    id uuid primary key default uuid_generate_v4(),
    title text not null,
    description text,
    photo_url text,
    latitude double precision not null,
    longitude double precision not null,
    address_landmark text not null,
    ward_number text not null,
    severity text not null check (severity in ('low', 'medium', 'critical')),
    status text not null check (status in ('reported', 'assigned', 'in_progress', 'cleaned')) default 'reported',
    reported_by uuid references public.profiles(id) on delete set null,
    assigned_crew text,
    cleanup_proof_url text,
    cleaned_at timestamptz,
    created_at timestamptz default now()
);

-- 4. Missing Bin Requests (Infrastructure Community Upvoting)
create table if not exists public.missing_bin_requests (
    id uuid primary key default uuid_generate_v4(),
    title text not null,
    bin_type text not null check (bin_type in ('segregated_pair', 'organic_wet', 'dry_recyclable', 'heavy_commercial', 'e_waste')),
    description text,
    latitude double precision not null,
    longitude double precision not null,
    location_name text not null,
    ward_number text not null,
    upvotes_count integer not null default 1,
    target_threshold integer not null default 25,
    status text not null check (status in ('community_voting', 'approved_for_installation', 'installed', 'rejected')) default 'community_voting',
    created_by uuid references public.profiles(id) on delete set null,
    upvoted_by jsonb default '[]'::jsonb,
    created_at timestamptz default now()
);

-- 5. Sanitation Truck Routes & Collection Shifts
create table if not exists public.driver_routes (
    id uuid primary key default uuid_generate_v4(),
    driver_id uuid references public.profiles(id) on delete set null,
    driver_name text not null,
    vehicle_number text not null,
    ward_number text not null,
    shift_date date default current_date,
    status text not null check (status in ('scheduled', 'on_route', 'completed')) default 'on_route',
    stops_completed integer default 0,
    total_stops integer default 28,
    collected_kg numeric default 0,
    current_lat double precision,
    current_lng double precision,
    updated_at timestamptz default now()
);

-- Row Level Security (RLS) setup
alter table public.profiles enable row level security;
alter table public.daily_collections enable row level security;
alter table public.dumping_reports enable row level security;
alter table public.missing_bin_requests enable row level security;
alter table public.driver_routes enable row level security;

-- Public read policies for transparency
create policy "Allow read on profiles" on public.profiles for select using (true);
create policy "Allow read on daily_collections" on public.daily_collections for select using (true);
create policy "Allow read on dumping_reports" on public.dumping_reports for select using (true);
create policy "Allow read on missing_bin_requests" on public.missing_bin_requests for select using (true);
create policy "Allow read on driver_routes" on public.driver_routes for select using (true);

-- Insert / Update policies for authenticated / demo public
create policy "Allow insert on daily_collections" on public.daily_collections for insert with check (true);
create policy "Allow update on daily_collections" on public.daily_collections for update using (true);
create policy "Allow insert on dumping_reports" on public.dumping_reports for insert with check (true);
create policy "Allow update on dumping_reports" on public.dumping_reports for update using (true);
create policy "Allow insert on missing_bin_requests" on public.missing_bin_requests for insert with check (true);
create policy "Allow update on missing_bin_requests" on public.missing_bin_requests for update using (true);
