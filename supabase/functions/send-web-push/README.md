# Web Push — guia de configuração (Fase 4)

Faz as notificações aparecerem **com o site fechado** (Android e desktop hoje;
iPhone exige "Adicionar à Tela de Início" + manifest PWA, ainda pendente).

Fluxo: `notifications` recebe INSERT → Database Webhook chama a Edge Function
`send-web-push` → ela lê `push_subscriptions` do destinatário → envia o push.

## Passo a passo (uma vez só)

### 1. Rodar a migration
No Supabase → SQL Editor, rode `supabase/migrations/20260716_push_subscriptions.sql`.

### 2. Gerar as chaves VAPID
```bash
npx web-push generate-vapid-keys
```
Guarde a **Public Key** e a **Private Key**.

### 3. Colar a chave pública no frontend
Em `src/lib/push.ts`, preencha:
```ts
export const VAPID_PUBLIC_KEY = "COLE_A_PUBLIC_KEY_AQUI";
```

### 4. Deploy da Edge Function
```bash
supabase functions deploy send-web-push --no-verify-jwt
```
(`--no-verify-jwt` porque quem chama é o Database Webhook, não um usuário
logado; a proteção é o `WEBHOOK_SECRET` abaixo.)

### 5. Definir os secrets da função
```bash
supabase secrets set \
  VAPID_PUBLIC_KEY="a_mesma_public_key" \
  VAPID_PRIVATE_KEY="a_private_key" \
  VAPID_SUBJECT="mailto:seu-email@dominio.com" \
  WEBHOOK_SECRET="um-segredo-forte-qualquer"
```
`SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` são injetados automaticamente.

### 6. Criar o Database Webhook
Painel → **Database → Webhooks → Create a new hook**:
- **Table:** `public.notifications`
- **Events:** `INSERT`
- **Type:** HTTP Request · **Method:** `POST`
- **URL:** `https://xqagqxntyppsyfdyebym.supabase.co/functions/v1/send-web-push`
- **HTTP Headers:** adicione `x-webhook-secret` = o mesmo valor de `WEBHOOK_SECRET`

### 7. Ativar no app
Abra o sino → botão **Ativar** → conceda a permissão do navegador.
Pronto: a partir daí, notificações chegam com o site fechado.

## Testar
Gere qualquer evento (ex.: mande uma mensagem no chat para o usuário que
ativou). Deve aparecer a notificação do sistema mesmo com a aba fechada.

## Observações
- **iPhone:** só funciona se o site for instalado via "Adicionar à Tela de
  Início" (iOS 16.4+). Precisa de um manifest PWA — fica para a fase mobile.
- **Custo:** R$ 0. VAPID, Service Worker e Edge Function cabem no free tier.
- A função remove sozinha inscrições mortas (respostas 404/410).
