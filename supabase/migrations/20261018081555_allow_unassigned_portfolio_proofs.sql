alter table public.portfolio_proofs
  alter column owner_type drop not null,
  alter column owner_id drop not null;