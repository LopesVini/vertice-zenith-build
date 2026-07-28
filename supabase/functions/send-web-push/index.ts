// ============================================================
// Edge Function: send-web-push
// ------------------------------------------------------------
// Dispara notificações Web Push (aparecem com o site FECHADO).
// É chamada por um Database Webhook do Supabase, no INSERT da
// tabela public.notifications.
//
// Fluxo: recebe a notificação criada -> busca as inscrições push
// do destinatário (service role, ignora RLS) -> envia o push
// criptografado (VAPID) para cada aparelho -> limpa inscrições
// expiradas (404/410).
//
// Secrets necessários (supabase secrets set ...):
//   VAPID_PUBLIC_KEY   — chave pública VAPID (a mesma de src/lib/push.ts)
//   VAPID_PRIVATE_KEY  — chave privada VAPID (NUNCA no frontend)
//   VAPID_SUBJECT      — "mailto:seu-email@dominio" (contato do remetente)
//   WEBHOOK_SECRET     — (opcional) valida o header x-webhook-secret
// SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY já são injetados pelo runtime.
// ============================================================

import webpush from "npm:web-push@3.6.7";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const VAPID_PUBLIC = Deno.env.get("VAPID_PUBLIC_KEY") ?? "";
const VAPID_PRIVATE = Deno.env.get("VAPID_PRIVATE_KEY") ?? "";
const VAPID_SUBJECT = Deno.env.get("VAPID_SUBJECT") ?? "mailto:contato@vebram.dev";
const WEBHOOK_SECRET = Deno.env.get("WEBHOOK_SECRET");

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC, VAPID_PRIVATE);

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

interface NotificationRow {
  recipient_id: string;
  title: string;
  body: string | null;
  link: string | null;
}

Deno.serve(async (req) => {
  // Valida o segredo do webhook, se configurado.
  if (WEBHOOK_SECRET && req.headers.get("x-webhook-secret") !== WEBHOOK_SECRET) {
    return new Response("unauthorized", { status: 401 });
  }

  const payload = await req.json().catch(() => null);
  // Database Webhook envia { type, table, record, old_record }.
  const n: NotificationRow | undefined = payload?.record ?? payload;
  if (!n?.recipient_id) {
    return new Response("sem destinatário", { status: 200 });
  }

  const { data: subs, error } = await supabase
    .from("push_subscriptions")
    .select("endpoint, p256dh, auth")
    .eq("user_id", n.recipient_id);

  if (error) {
    console.error("erro ao ler inscrições:", error.message);
    return new Response("erro", { status: 500 });
  }

  const message = JSON.stringify({
    title: n.title,
    body: n.body ?? "",
    link: n.link ?? "/",
    tag: n.recipient_id,
  });

  await Promise.all(
    (subs ?? []).map(async (s) => {
      try {
        await webpush.sendNotification(
          { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
          message
        );
      } catch (err) {
        const code = (err as { statusCode?: number }).statusCode;
        // 404/410 = inscrição morta (usuário desinstalou/limpou): remove.
        if (code === 404 || code === 410) {
          await supabase.from("push_subscriptions").delete().eq("endpoint", s.endpoint);
        } else {
          console.error("push falhou:", code, (err as Error).message);
        }
      }
    })
  );

  return new Response("ok", { status: 200 });
});
