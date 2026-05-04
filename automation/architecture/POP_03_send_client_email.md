# POP 03 — Enviar E-mail ao Cliente

## Objetivo
Enviar o e-mail de resposta automática gerado pela IA para o endereço do cliente.

## Entrada
- `record["email"]`: destinatário
- `record["nome"]`: para personalizar o assunto
- `body`: texto gerado pela IA (POP 02)

## Lógica
1. Montar MIMEMultipart com versão plain text e HTML
2. Assunto: `Recebemos seu pedido de orçamento, {primeiro nome}!`
3. HTML envolve o corpo da IA em template com identidade visual da Verticie
4. Enviar via SMTP SSL (smtp.gmail.com:465) com App Password

## Casos de Borda
- E-mail inválido: SMTP vai lançar exceção — logar e continuar (não bloquear Sheets/notificação)
- Falha de autenticação: logar erro crítico
