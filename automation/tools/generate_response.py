import os
import httpx
from tools.utils import log_error

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

FALLBACK = """Olá,

Recebemos sua solicitação de orçamento e agradecemos o interesse na Verticie.

Em breve nossa equipe entrará em contato para dar continuidade ao seu atendimento.

Atenciosamente,
Equipe Verticie"""


def generate_response(record: dict) -> str:
    nome = record.get("nome", "")
    tipo = record.get("tipo", "")
    fase = record.get("fase", "")
    cidade = record.get("cidade", "")
    area = record.get("area", "")
    mensagem = record.get("mensagem", "")

    extras = []
    if area:
        extras.append(f"- Área aproximada: {area} m²")
    if mensagem:
        extras.append(f"- Observação do cliente: {mensagem}")
    extras_str = "\n".join(extras)

    prompt = f"""Você é o assistente da Verticie, empresa de engenharia civil especializada em projetos residenciais em Belo Horizonte, Nova Lima e Contagem.

Um cliente enviou uma solicitação de orçamento com os seguintes dados:
- Nome: {nome}
- Tipo de projeto: {tipo}
- Fase atual: {fase}
- Cidade: {cidade}
{extras_str}

Escreva um e-mail de resposta automática profissional e personalizado para esse cliente.
Regras:
- Tom: profissional mas acolhedor
- Confirme que recebemos o pedido
- Mencione brevemente o tipo de projeto solicitado
- Informe que entraremos em contato em até 24 horas úteis
- Assine como "Equipe Verticie"
- Escreva apenas o corpo do e-mail, sem linha de assunto
- Use português formal, sem exageros"""

    try:
        res = httpx.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={"Authorization": f"Bearer {GROQ_API_KEY}"},
            json={
                "model": "llama-3.3-70b-versatile",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.4,
            },
            timeout=30,
        )
        res.raise_for_status()
        return res.json()["choices"][0]["message"]["content"].strip()
    except Exception as e:
        log_error(f"generate_response falhou: {e}")
        return FALLBACK
