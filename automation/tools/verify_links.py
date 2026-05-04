"""
Fase L - Verificacao de Links
Execute: python -m tools.verify_links
Todos devem mostrar OK antes de prosseguir.
"""
import sys
import os
import smtplib
import httpx

sys.stdout.reconfigure(encoding="utf-8")
import gspread
from google.oauth2.service_account import Credentials
from dotenv import load_dotenv
from tools.utils import SHEETS_SCOPES

load_dotenv()

GMAIL_USER = os.getenv("GMAIL_USER")
GMAIL_APP_PASSWORD = os.getenv("GMAIL_APP_PASSWORD")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
CREDENTIALS_PATH = os.getenv("GOOGLE_SHEETS_CREDENTIALS_PATH", "./google-credentials.json")
SHEET_ID = os.getenv("GOOGLE_SHEET_ID")


def check_gmail():
    print("→ Gmail SMTP...", end=" ", flush=True)
    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as s:
            s.login(GMAIL_USER, GMAIL_APP_PASSWORD)
        print("✅")
        return True
    except Exception as e:
        print(f"❌  {e}")
        return False


def check_groq():
    print("→ Groq API...", end=" ", flush=True)
    try:
        res = httpx.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={"Authorization": f"Bearer {GROQ_API_KEY}"},
            json={
                "model": "llama-3.3-70b-versatile",
                "messages": [{"role": "user", "content": "Responda apenas: OK"}],
                "max_tokens": 5,
            },
            timeout=15,
        )
        res.raise_for_status()
        print("✅")
        return True
    except Exception as e:
        print(f"❌  {e}")
        return False


def check_sheets():
    print("→ Google Sheets...", end=" ", flush=True)
    try:
        creds = Credentials.from_service_account_file(CREDENTIALS_PATH, scopes=SHEETS_SCOPES)
        client = gspread.authorize(creds)
        sheet = client.open_by_key(SHEET_ID).sheet1
        sheet.append_row(["TESTE DE CONEXÃO — pode deletar esta linha"])
        print("✅  (linha de teste adicionada)")
        return True
    except Exception as e:
        print(f"❌  {e}")
        return False


if __name__ == "__main__":
    print("\n=== V.L.A.E.G. — Fase L: Verificação de Links ===\n")
    results = [check_gmail(), check_groq(), check_sheets()]
    print()
    if all(results):
        print("✅  Todos os links OK — pode avançar para a Fase A.")
    else:
        print("❌  Corrija os erros acima antes de continuar.")
