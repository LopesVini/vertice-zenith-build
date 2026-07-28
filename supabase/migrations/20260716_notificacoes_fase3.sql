-- ============================================================
-- NOTIFICAÇÕES — FASE 3: mural, resposta ao cliente e novo cliente
-- ------------------------------------------------------------
-- Rode no painel Supabase -> SQL Editor -> New query -> Run.
-- Idempotente: pode rodar mais de uma vez sem problema.
-- Depende das Fases 1 e 2 (coluna `link` + gatilhos anteriores).
--
-- Eventos cobertos:
--   5) Mural: novo post              -> demais admins
--   6) Mural: comentário num post    -> autor do post
--   7) Equipe responde comentário    -> cliente dono do projeto
--      (reescreve o gatilho de update_comments para os DOIS sentidos)
--   8) Novo cliente cadastrado       -> todos os admins
--
-- Curtidas do mural ficam DE FORA de propósito (ruído alto, valor baixo).
-- ============================================================


-- ---------- 5. Mural: novo post -> demais admins ----------
create or replace function public.notify_admins_on_new_post()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $$
declare
  v_author_name text;
begin
  select display_name into v_author_name from public.profiles where id = new.author_id;

  insert into public.notifications (recipient_id, actor_id, type, title, body, link)
  select pr.id,
         new.author_id,
         'mural_post',
         coalesce(v_author_name, 'Alguém') || ' publicou no mural',
         left(coalesce(nullif(new.title, ''), new.content, '(sem título)'), 140),
         '/hq/feed'
    from public.profiles pr
   where pr.role = 'admin'
     and pr.id <> new.author_id;   -- não notifica o próprio autor
  return new;
end;
$$;

drop trigger if exists trg_notify_admins_on_new_post on public.posts;
create trigger trg_notify_admins_on_new_post
after insert on public.posts
for each row execute function public.notify_admins_on_new_post();


-- ---------- 6. Mural: comentário num post -> autor do post ----------
create or replace function public.notify_author_on_post_comment()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $$
declare
  v_post_author   uuid;
  v_commenter     text;
begin
  select author_id into v_post_author from public.posts where id = new.post_id;

  -- Sem autor, ou o próprio autor comentando: não notifica
  if v_post_author is null or v_post_author = new.author_id then
    return new;
  end if;

  select display_name into v_commenter from public.profiles where id = new.author_id;

  insert into public.notifications (recipient_id, actor_id, type, title, body, link)
  values (
    v_post_author,
    new.author_id,
    'mural_comment',
    coalesce(v_commenter, 'Alguém') || ' comentou no seu post',
    left(coalesce(new.content, '(imagem)'), 140),
    '/hq/feed'
  );
  return new;
end;
$$;

drop trigger if exists trg_notify_author_on_post_comment on public.comments;
create trigger trg_notify_author_on_post_comment
after insert on public.comments
for each row execute function public.notify_author_on_post_comment();


-- ---------- 7. Comentário numa atualização: os DOIS sentidos ----------
-- Substitui o notify_admins_on_client_comment (que só cobria cliente->admin).
-- Agora: cliente comenta -> admins;  equipe responde -> cliente dono.
create or replace function public.notify_on_update_comment()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $$
declare
  v_author_name  text;
  v_author_role  text;
  v_update_title text;
  v_project_id   uuid;
  v_project_name text;
  v_client_id    uuid;
begin
  select display_name, role into v_author_name, v_author_role
    from public.profiles where id = new.author_id;

  select u.title, u.project_id, p.name, p.client_id
    into v_update_title, v_project_id, v_project_name, v_client_id
    from public.updates u
    join public.projects p on p.id = u.project_id
   where u.id = new.update_id;

  if v_author_role = 'admin' then
    -- A EQUIPE respondeu -> notifica o cliente dono do projeto
    if v_client_id is not null and v_client_id <> new.author_id then
      insert into public.notifications (recipient_id, actor_id, type, title, body, link)
      values (
        v_client_id,
        new.author_id,
        'comment_reply',
        'A equipe respondeu na sua atualização',
        'Projeto "' || coalesce(v_project_name, '—') || '", atualização "'
          || coalesce(v_update_title, '—') || '": '
          || left(coalesce(new.content, '(imagem)'), 140),
        '/portal/updates'
      );
    end if;
  else
    -- O CLIENTE comentou -> notifica todos os admins
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
  end if;

  return new;
end;
$$;

-- Troca o gatilho antigo pelo novo (mesma tabela)
drop trigger if exists trg_notify_admins_on_client_comment on public.update_comments;
drop trigger if exists trg_notify_on_update_comment on public.update_comments;
create trigger trg_notify_on_update_comment
after insert on public.update_comments
for each row execute function public.notify_on_update_comment();

-- Função antiga não é mais usada
drop function if exists public.notify_admins_on_client_comment();


-- ---------- 8. Novo cliente cadastrado -> todos os admins ----------
create or replace function public.notify_admins_on_new_client()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $$
begin
  -- Só interessa cliente novo; admins são criados/promovidos manualmente
  if new.role is distinct from 'client' then
    return new;
  end if;

  insert into public.notifications (recipient_id, actor_id, type, title, body, link)
  select pr.id,
         new.id,
         'new_client',
         'Novo cliente cadastrado',
         coalesce(nullif(new.display_name, ''), new.email, 'Sem nome'),
         '/hq/clients'
    from public.profiles pr
   where pr.role = 'admin'
     and pr.id <> new.id;
  return new;
end;
$$;

drop trigger if exists trg_notify_admins_on_new_client on public.profiles;
create trigger trg_notify_admins_on_new_client
after insert on public.profiles
for each row execute function public.notify_admins_on_new_client();


-- ---------- Funções internas fora da API pública ----------
revoke execute on function public.notify_admins_on_new_post()      from anon, authenticated, public;
revoke execute on function public.notify_author_on_post_comment()  from anon, authenticated, public;
revoke execute on function public.notify_on_update_comment()       from anon, authenticated, public;
revoke execute on function public.notify_admins_on_new_client()    from anon, authenticated, public;
