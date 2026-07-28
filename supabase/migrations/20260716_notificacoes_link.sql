-- ============================================================
-- NOTIFICAÇÕES: coluna `link` (destino ao clicar)
-- ------------------------------------------------------------
-- Rode no painel Supabase -> SQL Editor -> New query -> Run.
-- Idempotente: pode rodar mais de uma vez sem problema.
--
-- Cada notificação passa a poder guardar uma rota interna (ex.:
-- "/hq/projects/123", "/portal/updates"). O sino usa isso para
-- levar o usuário direto à tela certa ao clicar. Notificações
-- antigas ficam com link nulo (só marcam como lida ao clicar).
-- Os gatilhos que POPULAM esse campo vêm na Fase 2.
-- ============================================================

alter table public.notifications
  add column if not exists link text;
