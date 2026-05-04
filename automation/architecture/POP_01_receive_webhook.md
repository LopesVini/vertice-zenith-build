# POP 01 — Receber e Validar Webhook

## Objetivo
Receber o payload do Supabase quando um novo orçamento é inserido, validar a autenticidade e extrair os dados do lead.

## Entrada
- HTTP POST em `/webhook/supabase`
- Header: `x-webhook-secret: <valor>`
- Body JSON com estrutura definida em gemini.md

## Lógica
1. Verificar se `request.headers["x-webhook-secret"] == SUPABASE_WEBHOOK_SECRET`
2. Se inválido: retornar HTTP 401
3. Verificar se `payload["type"] == "INSERT"` — ignorar outros eventos
4. Salvar payload em `.tmp/last_payload.json` para debug
5. Extrair `payload["record"]` e passar para o orquestrador

## Casos de Borda
- Payload malformado: retornar HTTP 400, logar em `.tmp/errors.log`
- Secret ausente no header: retornar HTTP 401
- Tipo diferente de INSERT: retornar HTTP 200 com `{"status": "ignored"}`
