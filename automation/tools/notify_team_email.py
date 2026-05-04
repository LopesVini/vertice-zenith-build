import os
import datetime
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from tools.utils import log_error, send_gmail, GMAIL_USER

EMAIL_DESTINATARIO = os.getenv("EMAIL_DESTINATARIO")


def notify_team_email(record: dict):
    nome = record.get("nome", "")
    tipo = record.get("tipo", "")
    email = record.get("email", "")
    celular = record.get("celular", "")
    cidade = record.get("cidade", "")
    area = record.get("area") or "não informado"
    fase = record.get("fase", "")
    mensagem = record.get("mensagem") or "nenhuma"

    msg = MIMEMultipart()
    msg["Subject"] = f"Novo orçamento: {nome} ({tipo})"
    msg["From"] = f"Verticie Bot <{GMAIL_USER}>"
    msg["To"] = EMAIL_DESTINATARIO

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
Verticie Automação · {datetime.datetime.now().strftime("%d/%m/%Y %H:%M")}
"""

    msg.attach(MIMEText(body, "plain", "utf-8"))

    try:
        send_gmail(EMAIL_DESTINATARIO, msg)
    except Exception as e:
        log_error(f"notify_team_email falhou: {e}")
