import os
import datetime
from tools.utils import log_error, send_email_api

EMAIL_DESTINATARIO = os.getenv("EMAIL_DESTINATARIO", "").strip()


def notify_team_email(record: dict):
    nome = record.get("nome", "")
    tipo = record.get("tipo", "")
    email = record.get("email", "")
    celular = record.get("celular", "")
    cidade = record.get("cidade", "")
    area = record.get("area") or "não informado"
    fase = record.get("fase", "")
    mensagem = record.get("mensagem") or "nenhuma"

    subject = f"Novo orçamento: {nome} ({tipo})"

    body = f"""Novo pedido de orçamento recebido via site.

Nome:     {nome}
E-mail:   {email}
WhatsApp: {celular}
Cidade:   {cidade}
Tipo:     {tipo}
Área:     {area}
Fase:     {fase}
Mensagem: {mensagem}

---
Vertice Automação · {datetime.datetime.now().strftime("%d/%m/%Y %H:%M")}
"""

    html = body.replace("\n", "<br>")

    try:
        send_email_api(EMAIL_DESTINATARIO, subject, html, body)
    except Exception as e:
        log_error(f"notify_team_email falhou: {e}")
        if hasattr(e, "response") and e.response is not None:
            log_error(f"Detalhes: {e.response.text}")
