# POP 05 — Notificar Equipe Verticie

## Objetivo
Enviar e-mail interno para o responsável com resumo completo do lead recebido.

## Entrada
- `record`: dict completo do orçamento

## Lógica
1. Montar e-mail plain text com todos os campos formatados
2. Assunto: `🔔 Novo orçamento: {nome} ({tipo})`
3. Remetente: verticeprojetos7@gmail.com
4. Destinatário: EMAIL_DESTINATARIO (definido no .env)
5. Enviar via SMTP SSL

## Casos de Borda
- Falha de envio: logar em `.tmp/errors.log`, não interromper fluxo
