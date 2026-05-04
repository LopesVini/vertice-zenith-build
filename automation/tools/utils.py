import os
import httpx
import datetime

RESEND_API_KEY = os.getenv("RESEND_API_KEY", "").strip()
RESEND_FROM_EMAIL = os.getenv("RESEND_FROM_EMAIL", "onboarding@resend.dev").strip()

SHEETS_SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
]


def log_error(msg: str):
    print(f"[ERROR] {msg}", flush=True)
    os.makedirs(".tmp", exist_ok=True)
    with open(".tmp/errors.log", "a", encoding="utf-8") as f:
        f.write(f"[{datetime.datetime.now()}] {msg}\n")


def send_email_api(to_addr: str, subject: str, html_body: str, text_body: str):
    if not RESEND_API_KEY:
        log_error("RESEND_API_KEY não configurada no Render.")
        return

    payload = {
        "from": f"Verticie Projetos <{RESEND_FROM_EMAIL}>",
        "to": [to_addr],
        "subject": subject,
        "html": html_body,
        "text": text_body
    }

    # Força IPv4 (Render Free Tier bloqueia chamadas IPv6 dando Network is unreachable)
    transport = httpx.HTTPTransport(local_address="0.0.0.0")
    with httpx.Client(transport=transport) as client:
        res = client.post(
            "https://api.resend.com/emails",
            headers={"Authorization": f"Bearer {RESEND_API_KEY}"},
            json=payload,
            timeout=15
        )
        res.raise_for_status()
