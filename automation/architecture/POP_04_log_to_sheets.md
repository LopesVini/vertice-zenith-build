# POP 04 — Registrar Lead no Google Sheets

## Objetivo
Adicionar uma linha na planilha "Leads Verticie" com todos os dados do orçamento e timestamp.

## Entrada
- `record`: dict completo do orçamento

## Lógica
1. Autenticar com service account (JSON file)
2. Abrir planilha pelo GOOGLE_SHEET_ID
3. Verificar se cabeçalho existe na linha 1 — criar se ausente
4. Append nova linha: [timestamp, nome, email, celular, cidade, tipo, area, fase, mensagem]

## Colunas da Planilha
| Data | Nome | E-mail | WhatsApp | Cidade | Tipo | Área | Fase | Mensagem |

## Casos de Borda
- Planilha não compartilhada com service account: PermissionError — logar
- SHEET_ID incorreto: SpreadsheetNotFound — logar
