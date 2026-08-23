-- glp1_prices table + seed data
-- Run this in the Supabase SQL editor (dashboard → SQL Editor → New query).
-- Once this table has rows, src/app/glp1-prices/page.tsx will read from it
-- instead of falling back to the hardcoded SEED_PRICES array.

create table if not exists glp1_prices (
  id uuid primary key default gen_random_uuid(),
  pharmacy_name text not null,
  pharmacy_type text not null, -- 'Telehealth' | 'Retail' | 'Online'
  province text not null,
  drug_name text not null,
  dosage text,
  price_cad numeric,
  dispensing_fee numeric default 0,
  requires_rx boolean default true,
  is_estimate boolean default false,
  url text,
  notes text,
  verified_at date,
  updated_at timestamptz default now()
);

alter table glp1_prices enable row level security;

create policy "Public read access" on glp1_prices
  for select to anon using (true);

-- Seed with the current hardcoded listings from src/app/glp1-prices/page.tsx
-- (SEED_PRICES array, as of 2026-05-21) so the cutover to Supabase doesn't
-- lose any current pricing data. Update/replace rows going forward via the
-- Supabase dashboard or a future admin UI.

insert into glp1_prices
  (pharmacy_name, pharmacy_type, province, drug_name, dosage, price_cad, dispensing_fee, requires_rx, is_estimate, url, notes, verified_at)
values
  -- Generic Semaglutide
  ('Shoppers Drug Mart', 'Retail', 'All', 'Generic Semaglutide', '0.25mg–1mg', 114, 0, true, false, 'https://www.shoppersdrugmart.ca', 'Need own prescription. Stock at select locations.', '2026-05-21'),
  ('PocketPills', 'Online', 'Most provinces', 'Generic Semaglutide', '0.25mg–1mg', 114, 0, true, true, 'https://www.pocketpills.com', 'Mail-order. Own prescription required.', '2026-05-21'),
  ('Rexall', 'Retail', 'All', 'Generic Semaglutide', '0.25mg–1mg', 114, 0, true, true, 'https://www.rexall.ca', 'Stock arriving. Own prescription required.', '2026-05-21'),
  ('London Drugs', 'Retail', 'BC, AB, SK, MB', 'Generic Semaglutide', '0.25mg–1mg', 114, 0, true, true, 'https://www.londondrugs.com', 'Western Canada only.', '2026-05-21'),
  ('Hims & Hers', 'Telehealth', 'All', 'Generic Semaglutide', '0.25mg–1mg', 149, 0, false, false, 'https://www.hims.com/ca', 'Consultation + medication bundled. Uses Apo-Semaglutide.', '2026-05-21'),
  ('Felix Health', 'Telehealth', 'All', 'Generic Semaglutide', '0.25mg–1mg', 150, 0, false, false, 'https://www.felixforyou.ca', 'Was $312/pen for brand Ozempic. Consultation included.', '2026-05-21'),

  -- Plosbrio (Novo Nordisk authorized generic of Ozempic)
  ('Costco Pharmacy', 'Retail', 'All', 'Plosbrio', '0.25mg–1mg', 155, 0, true, false, 'https://www.costco.ca/pharmacy', 'Novo Nordisk authorized generic of Ozempic. Membership required.', '2026-05-21'),
  ('Shoppers Drug Mart', 'Retail', 'All', 'Plosbrio', '0.25mg–1mg', 175, 0, true, false, 'https://www.shoppersdrugmart.ca', 'Authorized generic of Ozempic by Novo Nordisk.', '2026-05-21'),

  -- Ozempic
  ('Costco Pharmacy', 'Retail', 'All', 'Ozempic', '1mg', 230, 0, true, false, 'https://www.costco.ca/pharmacy', 'Membership required. Cheapest brand Ozempic in Canada.', '2026-05-21'),
  ('Walmart Pharmacy', 'Retail', 'All', 'Ozempic', '1mg', 262, 0, true, false, 'https://www.walmart.ca/pharmacy', null, '2026-05-21'),
  ('London Drugs', 'Retail', 'BC, AB, SK, MB', 'Ozempic', '1mg', 260, 0, true, false, 'https://www.londondrugs.com', 'Western Canada only.', '2026-05-21'),
  ('Felix Health', 'Telehealth', 'All', 'Ozempic', '1mg', 271, 0, false, false, 'https://www.felixforyou.ca', 'Consultation included.', '2026-05-21'),
  ('Shoppers Drug Mart', 'Retail', 'All', 'Ozempic', '1mg', 271, 0, true, false, 'https://www.shoppersdrugmart.ca', null, '2026-05-21'),
  ('PocketPills', 'Online', 'Most provinces', 'Ozempic', '1mg', 271, 0, true, false, 'https://www.pocketpills.com', 'Mail-order delivery.', '2026-05-21'),
  ('Phoenix', 'Telehealth', 'All', 'Ozempic', '1mg', 299, 0, false, false, 'https://www.phoenix.ca', 'Consultation included. 20% discount from list price.', '2026-05-21'),
  ('Rexall', 'Retail', 'All', 'Ozempic', '1mg', 318, 12.49, true, false, 'https://www.rexall.ca', 'Includes $12.49 dispensing fee.', '2026-05-21'),
  ('Maple', 'Telehealth', 'All provinces & territories', 'Ozempic', '1mg', 271, 0, false, false, 'https://www.getmaple.ca', '$85 one-time consult fee separate. Only telehealth covering QC & NB.', '2026-05-21'),

  -- Wegovy
  ('Costco Pharmacy', 'Retail', 'All', 'Wegovy', '0.25mg–2.4mg', 350, 0, true, false, 'https://www.costco.ca/pharmacy', 'Membership required.', '2026-05-21'),
  ('Shoppers Drug Mart', 'Retail', 'All', 'Wegovy', '0.25mg–2.4mg', 420, 0, true, false, 'https://www.shoppersdrugmart.ca', null, '2026-05-21'),
  ('Felix Health', 'Telehealth', 'All', 'Wegovy', '0.25mg–2.4mg', 450, 0, false, false, 'https://www.felixforyou.ca', 'Consultation included.', '2026-05-21'),
  ('Raven', 'Telehealth', 'ON, BC, AB, MB, SK, NS, NB, PE, NL', 'Wegovy', '0.25mg–2.4mg', null, 0, false, false, 'https://www.getraven.com', 'Weight-loss focused. Price disclosed after assessment.', '2026-05-21'),

  -- Mounjaro
  ('Costco Pharmacy', 'Retail', 'All', 'Mounjaro', 'Various strengths', 280, 0, true, false, 'https://www.costco.ca/pharmacy', 'Tirzepatide. Membership required.', '2026-05-21'),
  ('Shoppers Drug Mart', 'Retail', 'All', 'Mounjaro', 'Various strengths', 350, 0, true, false, 'https://www.shoppersdrugmart.ca', 'Tirzepatide.', '2026-05-21'),
  ('Felix Health', 'Telehealth', 'All', 'Mounjaro', 'Various strengths', 380, 0, false, false, 'https://www.felixforyou.ca', 'Consultation included.', '2026-05-21'),
  ('PocketPills', 'Online', 'Most provinces', 'Mounjaro', 'Various strengths', 340, 0, true, false, 'https://www.pocketpills.com', 'Mail-order delivery.', '2026-05-21'),

  -- Zepbound
  ('Costco Pharmacy', 'Retail', 'All', 'Zepbound', 'Various strengths', 315, 0, true, false, 'https://www.costco.ca/pharmacy', 'Tirzepatide for weight loss. Membership required.', '2026-05-21'),
  ('Shoppers Drug Mart', 'Retail', 'All', 'Zepbound', 'Various strengths', 390, 0, true, false, 'https://www.shoppersdrugmart.ca', 'Tirzepatide for weight loss.', '2026-05-21');
