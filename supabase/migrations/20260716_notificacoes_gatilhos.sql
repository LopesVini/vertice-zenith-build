-- ============================================================
-- NOTIFICAÇÕES — FASE 2: gatilhos de eventos + links clicáveis
-- ------------------------------------------------------------
-- Rode no painel Supabase -> SQL Editor -> New query -> Run.
-- Idempotente: pode rodar mais de uma vez sem problema.
-- Depende da coluna `link` (migration 20260716_notificacoes_link.sql).
--
-- Eventos cobertos:
--   1) Chat: nova mensagem            -> notifica o destinatário
--   2) Nova atualização no projeto    -> notifica o cliente dono
--   3) Novo orçamento (lead)          -> notifica todos os admins
--   4) Marco: cliente aprova          -> notifica os admins
--      Marco: equipe cria/entrega     -> notifica o cliente
--   (+) Atualiza o gatilho de comentário já existente para gravar link
--
-- Todas as funções são SECURITY DEFINER (o INSERT em notifications é
-- feito no servidor; não há policy de INSERT para o usuário comum).
-- ============================================================


-- ---------- 1. Chat: nova mensagem -> destinatário ----------
create or replace function public.notify_on_new_message()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $$
declare
  v_sender_name    text;
  v_recipient_role text;
  v_link           text;
begin
  -- Mensagem para si mesmo não gera notificação (defensivo)
  if new.sender_id = new.receiver_id then
    return new;
  end if;

  select display_name into v_sender_name from public.profiles where id = new.sender_id;
  select role         into v_recipient_role from public.profiles where id = new.receiver_id;

  -- O chat é um widget flutuante (sem rota própria): o link leva à home da
  -- área do destinatário; o sino também dispara a abertura do widget.
  v_link := case when v_recipient_role = 'admin' then '/hq' else '/portal' end;

  insert into public.notifications (recipient_id, actor_id, type, title, body, link)
  values (
    new.receiver_id,
    new.sender_id,
    'message',
    coalesce(v_sender_name, 'Alguém') || ' te enviou uma mensagem',
    left(coalesce(new.content, ''), 140),
    v_link
  );
  return new;
end;
$$;

drop trigger if exists trg_notify_on_new_message on public.messages;
create trigger trg_notify_on_new_message
after insert on public.messages
for each row execute function public.notify_on_new_message();


-- ---------- 2. Nova atualização no projeto -> cliente ----------
create or replace function public.notify_client_on_new_update()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $$
declare
  v_client_id    uuid;
  v_project_name text;
begin
  select client_id, name into v_client_id, v_project_name
    from public.projects where id = new.project_id;

  -- Projeto sem cliente vinculado: ninguém para notificar
  if v_client_id is null then
    return new;
  end if;

  insert into public.notifications (recipient_id, actor_id, type, title, body, link)
  values (
    v_client_id,
    auth.uid(),
    'update',
    'Nova atualização no seu projeto',
    'Projeto "' || coalesce(v_project_name, '—') || '": '
      || left(coalesce(new.title, ''), 120),
    '/portal/updates'
  );
  return new;
end;
$$;

drop trigger if exists trg_notify_client_on_new_update on public.updates;
create trigger trg_notify_client_on_new_update
after insert on public.updates
for each row execute function public.notify_client_on_new_update();


-- ---------- 3. Novo orçamento (lead) -> todos os admins ----------
create or replace function public.notify_admins_on_new_lead()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $$
begin
  insert into public.notifications (recipient_id, actor_id, type, title, body, link)
  select pr.id,
         null,                       -- lead não é um usuário do sistema
         'lead',
         'Novo orçamento recebido',
         coalesce(new.nome, 'Alguém') || ' pediu orçamento'
           || case when coalesce(new.tipo, '')   <> '' then ' (' || new.tipo || ')' else '' end
           || case when coalesce(new.cidade, '') <> '' then ' — ' || new.cidade else '' end,
         '/hq'
    from public.profiles pr
   where pr.role = 'admin';
  return new;
end;
$$;

drop trigger if exists trg_notify_admins_on_new_lead on public."Orçamentos";
create trigger trg_notify_admins_on_new_lead
after insert on public."Orçamentos"
for each row execute function public.notify_admins_on_new_lead();


-- ---------- 4. Marcos: aprovação (cliente->admins) / criação e entrega (equipe->cliente) ----------
create or replace function public.notify_on_milestone_change()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $$
declare
  v_actor_name   text;
  v_client_id    uuid;
  v_project_name text;
begin
  select client_id, name into v_client_id, v_project_name
    from public.projects where id = new.project_id;

  -- CASO A: o CLIENTE acabou de aprovar (approved_at foi de nulo -> preenchido)
  --         Só conta como aprovação do cliente quando o ator NÃO é admin.
  if tg_op = 'update'
     and old.approved_at is null
     and new.approved_at is not null
     and not public.is_admin() then

    select display_name into v_actor_name from public.profiles where id = auth.uid();

    insert into public.notifications (recipient_id, actor_id, type, title, body, link)
    select pr.id,
           auth.uid(),
           'milestone_approved',
           coalesce(v_actor_name, 'O cliente') || ' aprovou um marco',
           'Projeto "' || coalesce(v_project_name, '—') || '": marco "'
             || coalesce(new.name, '—') || '"',
           '/hq/projects/' || new.project_id
      from public.profiles pr
     where pr.role = 'admin';

    return new;
  end if;

  -- CASO B: a EQUIPE (admin) criou um marco ou marcou como concluído -> avisa o cliente
  if public.is_admin() and v_client_id is not null then
    if tg_op = 'insert' then
      insert into public.notifications (recipient_id, actor_id, type, title, body, link)
      values (
        v_client_id, auth.uid(), 'milestone',
        'Novo marco no seu projeto',
        'O marco "' || coalesce(new.name, '—') || '" foi adicionado ao projeto "'
          || coalesce(v_project_name, '—') || '"',
        '/portal'
      );
    elsif tg_op = 'update'
          and new.status = 'done'
          and old.status is distinct from 'done' then
      insert into public.notifications (recipient_id, actor_id, type, title, body, link)
      values (
        v_client_id, auth.uid(), 'milestone',
        'Marco entregue 🎉',
        'O marco "' || coalesce(new.name, '—') || '" do projeto "'
          || coalesce(v_project_name, '—') || '" foi concluído',
        '/portal'
      );
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_notify_on_milestone_change on public.milestones;
create trigger trg_notify_on_milestone_change
after insert or update on public.milestones
for each row execute function public.notify_on_milestone_change();


-- ---------- (+) Comentário do cliente: agora com link para o projeto ----------
-- Recria o gatilho já existente apenas para gravar o `link` (antes ficava nulo).
create or replace function public.notify_admins_on_client_comment()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $$
declare
  v_author_name  text;
  v_author_role  text;
  v_update_title text;
  v_project_name text;
  v_project_id   uuid;
begin
  select display_name, role into v_author_name, v_author_role
    from public.profiles where id = new.author_id;

  -- Comentário da própria equipe não gera notificação
  if v_author_role = 'admin' then
    return new;
  end if;

  select u.title, u.project_id, p.name
    into v_update_title, v_project_id, v_project_name
    from public.updates u
    join public.projects p on p.id = u.project_id
   where u.id = new.update_id;

  insert into public.notifications (recipient_id, actor_id, type, title, body, link)
  select pr.id,
         new.author_id,
         'comment',
         coalesce(v_author_name, 'Cliente') || ' comentou em uma atualização',
         'Projeto "' || coalesce(v_project_name, '—') || '", atualização "'
           || coalesce(v_update_title, '—') || '": '
           || left(coalesce(new.content, '(imagem)'), 140),
         '/hq/projects/' || v_project_id
    from public.profiles pr
   where pr.role = 'admin';

  return new;
end;
$$;


-- ---------- Funções internas fora da API pública ----------
revoke execute on function public.notify_on_new_message()        from anon, authenticated, public;
revoke execute on function public.notify_client_on_new_update()  from anon, authenticated, public;
revoke execute on function public.notify_admins_on_new_lead()    from anon, authenticated, public;
revoke execute on function public.notify_on_milestone_change()   from anon, authenticated, public;
