-- ============================================================
-- WEB PUSH — FASE 4: inscrições de notificação (site fechado)
-- ------------------------------------------------------------
-- Rode no painel Supabase -> SQL Editor -> New query -> Run.
-- Idempotente: pode rodar mais de uma vez sem problema.
--
-- Guarda a "inscrição" (PushSubscription) de cada aparelho/navegador
-- do usuário. A Edge Function send-web-push lê daqui (com service role)
-- para disparar o push quando uma notificação é criada.
-- Um mesmo usuário pode ter várias linhas (celular, notebook, etc.).
-- ============================================================

create table if not exists public.push_subscriptions (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  endpoint   text not null unique,          -- URL do serviço de push do navegador
  p256dh     text not null,                 -- chave pública do cliente (criptografia)
  auth       text not null,                 -- segredo de autenticação do cliente
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists idx_push_subs_user
  on public.push_subscriptions (user_id);

alter table public.push_subscriptions enable row level security;

-- Cada um gerencia apenas as próprias inscrições. A Edge Function usa a
-- service role (ignora RLS) para ler as de qualquer destinatário.
drop policy if exists "ver minhas push subs" on public.push_subscriptions;
create policy "ver minhas push subs"
  on public.push_subscriptions for select to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "criar minhas push subs" on public.push_subscriptions;
create policy "criar minhas push subs"
  on public.push_subscriptions for insert to authenticated
  with check (user_id = (select auth.uid()));

drop policy if exists "atualizar minhas push subs" on public.push_subscriptions;
create policy "atualizar minhas push subs"
  on public.push_subscriptions for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

drop policy if exists "apagar minhas push subs" on public.push_subscriptions;
create policy "apagar minhas push subs"
  on public.push_subscriptions for delete to authenticated
  using (user_id = (select auth.uid()));
