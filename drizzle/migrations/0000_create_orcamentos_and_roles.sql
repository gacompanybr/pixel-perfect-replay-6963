create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  unique (user_id, role)
);

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

create policy "Users can read their own roles"
  on public.user_roles for select to authenticated
  using (user_id = auth.uid());

create table public.orcamentos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  whatsapp text not null,
  email text,
  cidade text not null,
  bairro text,
  servico text not null,
  descricao text not null,
  medidas text,
  prazo text,
  preferencia_contato text not null default 'WhatsApp',
  fotos text[] not null default '{}',
  status text not null default 'Novo',
  created_at timestamptz not null default now()
);

grant insert on public.orcamentos to anon;
grant select, update on public.orcamentos to authenticated;
grant all on public.orcamentos to service_role;

alter table public.orcamentos enable row level security;

create policy "Qualquer visitante pode enviar um orcamento"
  on public.orcamentos for insert to anon
  with check (true);

create policy "Admins podem ver todos os orcamentos"
  on public.orcamentos for select to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "Admins podem atualizar orcamentos"
  on public.orcamentos for update to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Visitantes podem enviar fotos do orcamento"
  on storage.objects for insert to anon
  with check (bucket_id = 'orcamento-fotos');

create policy "Admins podem ver as fotos dos orcamentos"
  on storage.objects for select to authenticated
  using (bucket_id = 'orcamento-fotos' and public.has_role(auth.uid(), 'admin'));