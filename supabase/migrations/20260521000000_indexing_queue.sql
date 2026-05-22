create table if not exists indexing_queue (
  url          text primary key,
  status       text not null default 'pending',
  submitted_at timestamptz,
  created_at   timestamptz default now()
);

alter table indexing_queue enable row level security;

create policy "Service role full access" on indexing_queue
  for all to service_role using (true);
