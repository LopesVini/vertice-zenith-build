# POP 02 — Gerar Resposta Personalizada com IA

## Objetivo
Usar o Groq (Llama 3.3 70B) para gerar um e-mail personalizado ao cliente com base nos dados do formulário.

## Entrada
- `record`: dict com os campos do orçamento

## Lógica
1. Montar prompt com nome, tipo de projeto, fase, cidade, área e mensagem
2. Chamar API Groq: POST https://api.groq.com/openai/v1/chat/completions
3. Extrair texto de `choices[0].message.content`
4. Retornar corpo do e-mail como string

## Regras de Comportamento (conforme gemini.md)
- Tom: profissional e acolhedor, português formal
- Confirmar recebimento, mencionar tipo de projeto, informar retorno em 24h
- Assinar como "Equipe Verticie"
- Não mencionar campos vazios (area, mensagem)

## Casos de Borda
- Timeout (>30s): logar erro, usar texto padrão fixo como fallback
- API key inválida: logar erro crítico em `.tmp/errors.log`
